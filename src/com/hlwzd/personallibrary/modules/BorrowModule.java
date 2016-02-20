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
		if(!User.isLogedIn())
			return Error(1002);
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
			if(action.equals("addBorrowRecord")){
				String bidStr = request.getParameter("bid");
				String loanUidStr = request.getParameter("loan_uid");
				if(bidStr==null)return Error(1001);
				int bid = Integer.parseInt(bidStr);
				int loanUid = Integer.parseInt(loanUidStr);
				return addBorrowRecord(bid, loanUid, User.getUid());
			}
			else if(action.equals("acceptBorrowRecord")){
				String bridStr = request.getParameter("brid");
				String acceptStr = request.getParameter("accept");
				if(bridStr==null||acceptStr==null)return Error(1001);
				int brid = Integer.parseInt(bridStr);
				boolean accept = (Integer.parseInt(acceptStr)==1);
				return acceptBorrowRecord(User.getUid(), brid, accept);
			}
			else if(action.equals("setBookReturned")){
				String bridStr = request.getParameter("brid");
				if(bridStr==null)return Error(1001);
				int brid = Integer.parseInt(bridStr);
				return setBookReturned(User.getUid(), brid);
			}
			else if(action.equals("getBorrowedBookRecordList")){
				String statusStr = request.getParameter("status");
				int status = (statusStr==null)?0:Integer.parseInt(statusStr);
				return getBorrowedBookRecordList(User.getUid(), status);
			}
			else if(action.equals("getLoanedBookRecordList")){
				String statusStr = request.getParameter("status");
				int status = (statusStr==null)?0:Integer.parseInt(statusStr);
				return getLoanedBookRecordList(User.getUid(), status);
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


	private JsonObject addBorrowRecord(int bid, int loan_uid, int borrow_uid) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `userbook` WHERE `uid` = ? AND `bid` = ?",loan_uid, bid);
		if(!rs.next()) return Error(1061);
		rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `loan_uid` = ? AND `book_id` = ? AND `status` = 2",loan_uid, bid);
		if(rs.next()) return Error(1062);
		rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `borrow_uid` = ? AND `loan_uid` = ? AND `book_id` = ? AND `status` = 1",User.getUid(),loan_uid, bid);
		if(rs.next()) return Error(1063);
		DB.executeNonQuery("INSERT INTO `borrows` VALUES (null,?,?,?,NOW(),null,1)", borrow_uid,loan_uid,bid);
		return Success();
	}
	
	private JsonObject acceptBorrowRecord(int uid, int brid, boolean accept) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `book_id` FROM `borrows` WHERE `brid` = ? AND `loan_uid` = ? AND `status` = 1", brid, uid);
		if(!rs.next()) return Error(1064);
		int bid = rs.getInt("book_id");
		if(accept){
			// 拒绝所有相关请求
			DB.executeNonQuery("UPDATE `borrows` SET `status` = 3 "
								+ "WHERE `loan_uid` = ? AND `book_id` = ? AND `status` = 1", uid, bid);
			// 接受指定请求
			DB.executeNonQuery("UPDATE `borrows` SET `borrow_time`=NOW() ,`status` = 2 WHERE `brid` = ? ", brid);
		}
		else 
			DB.executeNonQuery("UPDATE `borrows` SET `status` = 3 WHERE `brid` = ? ", brid);
		return Success();
	}
	
	private JsonObject setBookReturned(int loan_uid, int brid) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `borrows` WHERE `brid` = ? AND `loan_uid` = ? AND `status` = 2", brid, loan_uid);
		if(!rs.next()) return Error(1064);
		DB.executeNonQuery("UPDATE `borrows` SET `status` = 4 , `return_time` = now() WHERE `brid` = ? ", brid);
		return Success();
	}

	private JsonObject getLoanedBookRecordList(int loan_uid, int status) throws SQLException{
		String where = (status==0)?" AND 1 ":" AND `status` = "+status;
		ResultSet rs = DB.executeQuery("SELECT `borrows`.*,`nickname`,`books`.`title` AS `book_name` FROM `borrows` "
										+ " INNER JOIN `userinfo` ON `userinfo`.`uid` = `borrows`.`borrow_uid` "
										+ " INNER JOIN `books` ON `books`.`bid` = `borrows`.`book_id` "
										+ " WHERE `loan_uid` = ? "+where
										+ " ORDER BY `borrow_time` DESC ", loan_uid);
		List<BorrowRecord> requests = new ArrayList<BorrowRecord>();
		while(rs.next()){
			BorrowRecord request = new BorrowRecord(rs.getInt("brid"),rs.getInt("loan_uid"), rs.getInt("borrow_uid"), rs.getString("nickname"), 
													rs.getInt("book_id"), rs.getString("book_name"), rs.getString("borrow_time"),
													rs.getString("return_time"),rs.getInt("status"));
			requests.add(request);
		}
		return Data(requests);
	}

	private JsonObject getBorrowedBookRecordList(int borrow_uid, int status) throws SQLException{
		String where = (status==0)?" AND 1 ":" AND `status` = "+status;
		ResultSet rs = DB.executeQuery("SELECT `borrows`.*,`nickname`,`books`.`title` AS `book_name` FROM `borrows` "
										+ " INNER JOIN `userinfo` ON `userinfo`.`uid` = `borrows`.`loan_uid` "
										+ " INNER JOIN `books` ON `books`.`bid` = `borrows`.`book_id` "
										+ " WHERE `borrow_uid` = ? "+where
										+ " ORDER BY `borrow_time` DESC ", borrow_uid);
		List<BorrowRecord> requests = new ArrayList<BorrowRecord>();
		while(rs.next()){
			BorrowRecord request = new BorrowRecord(rs.getInt("brid"),rs.getInt("loan_uid"), rs.getInt("borrow_uid"), rs.getString("nickname"), 
													rs.getInt("book_id"), rs.getString("book_name"), rs.getString("borrow_time"),
													rs.getString("return_time"),rs.getInt("status"));
			requests.add(request);
		}
		return Data(requests);
	}

	public static class BorrowRecord{
		public int brid,loan_uid,borrow_uid,book_id,status; 
		public String nickname,book_name,borrow_time,return_time;
		public BorrowRecord(int brid,int loan_uid,int borrow_uid, String nickname, int book_id ,String book_name,String borrow_time,String return_time,int status){
			this.brid = brid;
			this.loan_uid = loan_uid;
			this.borrow_uid = borrow_uid;
			this.nickname = nickname;
			this.book_id = book_id;
			this.book_name = book_name;
			borrow_time = (borrow_time!=null)?borrow_time.substring(0,19):null;
			this.borrow_time = borrow_time;
			return_time = (return_time!=null)?return_time.substring(0,19):null;
			this.return_time = return_time;
			this.status = status;
		}
	}
}
