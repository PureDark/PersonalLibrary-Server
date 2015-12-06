package com.hlwzd.personallibrary.modules;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.JsonObject;
import com.hlwzd.personallibrary.DBHelper;
import com.hlwzd.personallibrary.Manager.Module;
import com.hlwzd.personallibrary.Manager.User;

public class BorrowModule extends Module {

	public BorrowModule(DBHelper db, User user) {
		super(db, user);
	}

	@Override
	public JsonObject action(HttpServletRequest request) {
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
			if(action.equals("borrowBook")){
				String book_idStr = request.getParameter("book_id");
				String loan_uidStr = request.getParameter("loan_uid");
				if(book_idStr==null||loan_uidStr==null)return Error(1001);
				int book_id = Integer.parseInt(book_idStr);
				int loan_uid = Integer.parseInt(loan_uidStr);
				return borrowBook(book_id,loan_uid);
			}
			else if(action.equals("getBookRequestList")){
				return getBookRequestList();
			}
			else if(action.equals("acceptBorrowRequest")){
				String bidStr = request.getParameter("bid");
				String acceptStr = request.getParameter("accept");
				if(bidStr==null||acceptStr==null)return Error(1001);
				int bid = Integer.parseInt(bidStr);
				boolean accept = (Integer.parseInt(acceptStr)==1);
				return acceptBorrowRequest(bid,accept);
			}
			else if(action.equals("setBookReturned")){
				String bidStr = request.getParameter("bid");
				if(bidStr==null)return Error(1001);
				int bid = Integer.parseInt(bidStr);
				return setBookReturned(bid);
			}
			else if(action.equals("getBookLoanedList")){
				String typeStr = request.getParameter("type");
				int type = (typeStr==null)?0:Integer.parseInt(typeStr);
				return getBookLoanedList(type);
			}
			else if(action.equals("getBookBorrowedList")){
				String typeStr = request.getParameter("type");
				int type = (typeStr==null)?0:Integer.parseInt(typeStr);
				return getBookBorrowedList(type);
			}
			else
				return Error(1006);
			
		} catch (SQLException e) {
			e.printStackTrace();
			return Error(1010);
		} catch (Exception e) {
			e.printStackTrace();
			return Error(1000);
		}
	}


	private JsonObject borrowBook(int book_id,int loan_uid) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `userbook` WHERE `uid` = ? AND `bid` = ?",loan_uid, book_id);
		if(!rs.next()) return Error(1311);
		rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `loan_uid` = ? AND `book_id` = ? AND `status` = 2",loan_uid, book_id);
		if(rs.next()) return Error(1312);
		rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `borrow_uid` = ?  AND `loan_uid` = ? AND `book_id` = ? AND `status` = 1",User.getUid(),loan_uid, book_id);
		if(rs.next()) return Error(1313);
		DB.executeNonQuery("INSERT INTO `borrows` VALUES (null,?,?,?,NOW(),null,1)", User.getUid(),loan_uid,book_id);
		return Success();
	}

	private JsonObject getBookRequestList() throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `borrows`.*,`nickname`,`books`.`name` FROM `borrows` "
				+ "INNER JOIN `userinfo` ON `userinfo`.`uid` = `borrows`.`borrow_uid` "
				+ "INNER JOIN `books` ON `books`.`bid` = `borrows`.`book_id` "
				+ "WHERE `status` = 1");
		List<Task> tasks = new ArrayList<Task>();
		while(rs.next()){
			Task request = new Task(rs.getInt("bid"),rs.getInt("loan_uid"), rs.getInt("borrow_uid"),  rs.getString("nickname"), rs.getInt("book_id"), rs.getString("name"), rs.getString("borrow_time"),rs.getString("return_time"),rs.getInt("status"));
			tasks.add(request);
		}
		return Data(tasks);
	}
	
	private JsonObject acceptBorrowRequest(int bid, boolean accept) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `book_id` FROM `borrows` WHERE `loan_uid` = ? AND `bid` = ? AND `status` = 1",User.getUid(), bid);
		if(!rs.next()) return Error(1331);
		int book_id = rs.getInt("book_id");
		if(accept){
			DB.executeNonQuery("UPDATE `borrows` SET `status` = 3 "
					+ "WHERE `loan_uid` = ? AND `book_id` = ? AND `status` = 1", User.getUid(), book_id);

			DB.executeNonQuery("UPDATE `borrows` SET `borrow_time`=NOW() ,`status` = 2 WHERE `bid` = ? ", bid);
		}
		else 
			DB.executeNonQuery("UPDATE `borrows` SET `status` = 3 WHERE `bid` = ? ", bid);
		return Success();
	}
	
	private JsonObject setBookReturned(int bid) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `loan_uid` = ? AND `bid` = ?",User.getUid(), bid);
		if(!rs.next()) return Error(1341);
		rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `bid` = ? AND `status` = 2",bid);
		if(!rs.next()) return Error(1342);
		DB.executeNonQuery("UPDATE `borrows` SET `status` = 4 , `return_time` = now() WHERE `bid` = ? ", bid);
		return Success();
	}
	
	private JsonObject getBookLoanedList(int type) throws SQLException{
		String status = "";
		if(type==0)
			status = " 2 OR `status` = 4";
		else if(type==1)
			status = "2";
		else if(type==2)
			status = "4";
		else 
			return Error(1001);
		ResultSet rs = DB.executeQuery("SELECT `borrows`.*,`nickname`,`books`.`name` FROM `borrows` "
				+ "INNER JOIN `userinfo` ON `userinfo`.`uid` = `borrows`.`borrow_uid` "
				+ "INNER JOIN `books` ON `books`.`bid` = `borrows`.`book_id` "
				+ "WHERE `loan_uid` = ? AND (`status` = "+status+")",User.getUid());
		List<Task> tasks = new ArrayList<Task>();
		while(rs.next()){
			Task loan = new Task(rs.getInt("bid"),rs.getInt("loan_uid"), rs.getInt("borrow_uid"),  rs.getString("nickname"), rs.getInt("book_id"), rs.getString("name"), rs.getString("borrow_time"),rs.getString("return_time"),rs.getInt("status"));
			tasks.add(loan);
		}
		return Data(tasks);
	}
	
	private JsonObject getBookBorrowedList(int type) throws SQLException{
		String status = "";
		if(type==0)
			status = " 2 OR `status` = 4";
		else if(type==1)
			status = "2";
		else if(type==2)
			status = "4";
		else 
			return Error(1001);
		ResultSet rs = DB.executeQuery("SELECT `borrows`.*,`nickname`,`books`.`name` FROM `borrows` "
				+ "INNER JOIN `userinfo` ON `userinfo`.`uid` = `borrows`.`borrow_uid` "
				+ "INNER JOIN `books` ON `books`.`bid` = `borrows`.`book_id` "
				+ "WHERE `borrow_uid` = ? AND (`status` = "+status+")",User.getUid());
		List<Task> tasks = new ArrayList<Task>();
		while(rs.next()){
			Task borrow = new Task(rs.getInt("bid"),rs.getInt("loan_uid"), rs.getInt("borrow_uid"),  rs.getString("nickname"), rs.getInt("book_id"), rs.getString("name"), rs.getString("borrow_time"),rs.getString("return_time"),rs.getInt("status"));
			tasks.add(borrow);
		}
		return Data(tasks);
	}
	
	public static class Task{
		public int bid,loan_uid,borrow_uid,book_id,status; 
		public String nickname,book_name,borrow_time,return_time;
		public Task(int bid,int loan_uid,int borrow_uid, String nickname, int book_id ,String book_name,String borrow_time,String return_time,int status){
			this.bid = bid;
			this.loan_uid = loan_uid;
			this.borrow_uid = borrow_uid;
			this.nickname = nickname;
			this.book_id = book_id;
			this.book_name = book_name;
			this.borrow_time = borrow_time;
			this.status = status;
			this.return_time = return_time;
		}
	}
}
