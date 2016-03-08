package com.hlwzd.personallibrary.modules;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.hlwzd.personallibrary.DBHelper;
import com.hlwzd.personallibrary.Manager.Module;
import com.hlwzd.personallibrary.Manager.User;

public class LibraryModule extends Module {

	public LibraryModule(DBHelper db, User user) {
		super(db, user);
	}

	@Override
	public JsonObject action(HttpServletRequest request) {
		if(!User.isLogedIn())
			return Error(1002);
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
			if(action.equals("addBook")){
				String isbn13 = request.getParameter("isbn13");
				String title = request.getParameter("title");
				String cover = request.getParameter("cover");
				String author = request.getParameter("author");
				String summary = request.getParameter("summary");
				if((isbn13==null||title==null))
					return Error(1001);
				return addBook(User.getUid(), isbn13, title, cover, author, summary);
			}
			else if(action.equals("deleteBook")){
				String bidstr = request.getParameter("bid");
				if(bidstr==null)return Error(1001);
				int bid = Integer.parseInt(bidstr);
				return deleteBook(User.getUid(),bid);
			}
			else if(action.equals("addTag")){
				String bidstr = request.getParameter("bid");
				String tag = request.getParameter("tag");
				if(bidstr==null||tag==null)return Error(1001);
				int bid = Integer.parseInt(bidstr);
				return addTag(User.getUid(), bid, tag);
			}
			else if(action.equals("deleteTag")){
				String bidstr = request.getParameter("bid");
				String tidstr = request.getParameter("tid");
				if(bidstr==null||tidstr==null)return Error(1001);
				int bid = Integer.parseInt(bidstr);
				int tid = Integer.parseInt(tidstr);
				return deleteTag(User.getUid(), bid, tid);
			}
			else if(action.equals("getTagList")){
				return getTagList();
			}
			else if(action.equals("getBookList")){
				String uidStr = request.getParameter("uid");
				String tidsStr = request.getParameter("tids");
				String keyword = request.getParameter("keyword");
				JsonParser parser = new JsonParser();
				JsonArray tids = (tidsStr==null||"".equals(tidsStr))?new JsonArray():parser.parse(tidsStr).getAsJsonArray();
				int uid = (uidStr==null)?User.getUid():Integer.parseInt(uidStr);
				return getBookList(uid, tids, keyword);
			}
			else if(action.equals("exchangeBook")){
				String bidstr = request.getParameter("bid");
				String uidstr = request.getParameter("uid");
				if(bidstr==null)return Error(1001);
				int bid = Integer.parseInt(bidstr);
				int uid = User.getUid();
				int uidto = Integer.parseInt(uidstr);
				return exchangeBook(bid, uid, uidto);
			}
			else if(action.equals("reorderBooks")){
				String ordersStr = request.getParameter("orders");
				if(ordersStr==null)return Error(1001);
				JsonParser parser = new JsonParser();
				JsonArray ordersJson = parser.parse(ordersStr).getAsJsonArray();
				int[] bids = new int[ordersJson.size()];
				int[] orders = new int[ordersJson.size()];
				for(int i=0; i < ordersJson.size(); i++){
					JsonObject order = ordersJson.get(i).getAsJsonObject();
					bids[i] = order.get("bid").getAsInt();
					orders[i] = order.get("order").getAsInt();
				}
				return reorderBooks(User.getUid(), bids, orders);
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
	
	private JsonObject reorderBooks(int uid, int[] bids, int[] orders) throws SQLException{
		for(int i=0; i< bids.length; i++){
			DB.executeNonQuery("UPDATE `userbook` SET `order`=? WHERE `uid` = ? AND `bid` = ?", orders[i], uid, bids[i]);
		}
		return Success();
	}

	private JsonObject addBook(int uid, String isbn13, String title, String cover, String author, String summary) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `bid` FROM `books` WHERE `isbn13` = ?", isbn13);
		int bid;
		if(rs.next()){
			bid = rs.getInt("bid");
		}else{
			DB.executeNonQuery("INSERT INTO `books` "+
							   "(`isbn13`,`title`,`cover`,`author`,`summary`,`regdate`) "+
							   "VALUES (?,?,?,?,?,NOW())", isbn13, title, cover, author, summary);
			bid = DB.getLastInsertId();
		}
		rs = DB.executeQuery("SELECT 1 FROM `userbook` WHERE `uid` = ? AND `bid` = ?", uid, bid);
		if(rs.next())
			DB.executeNonQuery("UPDATE `userbook` SET `datetime` = NOW() WHERE `uid` = ? AND `bid` = ?", uid, bid);
		else 
			DB.executeNonQuery("INSERT INTO `userbook` (`uid`,`bid`,`datetime`) VALUES (?,?,NOW())", uid, bid);
		JsonObject data = new JsonObject();
		data.addProperty("bid", bid);
		return Data(data);
	}
	
	private JsonObject deleteBook(int uid, int bid) throws SQLException{
		DB.executeNonQuery("DELETE FROM `userbook` WHERE `uid` = ? AND `bid` = ?", uid, bid);
		return Success();
	}
	
	private JsonObject addTag(int uid, int bid, String tag) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `userbook` WHERE `bid`=? AND `uid`=?", bid, uid);
		if(!rs.next())return Error(1021);
		rs = DB.executeQuery("SELECT `tid` FROM `tags` WHERE `title`=?", tag);
		if(rs.next()){
			DB.executeNonQuery("INSERT INTO `booktags` (`bid`,`tid`) "
								+ "VALUES (?,?)", bid, rs.getInt("tid"));
		}else{
			DB.executeNonQuery("INSERT INTO `tags` (`title`) VALUES (?)", tag);
			int lastid = DB.getLastInsertId();
			DB.executeNonQuery("INSERT INTO `booktags` (`bid`,`tid`) "+
							   "VALUES (?,?)", bid, lastid);
		}
		return Success();
	}
	
	private JsonObject deleteTag(int uid, int bid, int tid) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `userbook` WHERE `bid`=? AND `uid`=?", bid, uid);
		if(!rs.next())
			return Error(1021);
		DB.executeNonQuery("DELETE FROM `booktags` WHERE `bid`=? AND `tid`=?", bid, tid);
		return Success();
	}
	
	private JsonObject getTagList() throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT * FROM `tags` ORDER BY RAND() LIMIT 6");
		List<Tag> tags = new ArrayList<Tag>();
		if(rs.next())
			tags.add(new Tag(rs.getInt("tid"), rs.getString("title")));
		else 
			return Error(1032);
		return Data(tags);
	}
	
	private JsonObject getBookList(int uid, JsonArray tids, String keyword) throws SQLException{
		keyword = (keyword==null||"".equals(keyword))?null:"%"+keyword+"%";
		String where = (keyword==null)?"":" AND (`books`.`title` LIKE ? OR `books`.`author` LIKE ?) ";
		ResultSet rs;
		String sql = "";
		if(tids.size()==0){
			sql = "SELECT `books`.* FROM `books` "
				 + "INNER JOIN `userbook` ON `userbook`.`bid`=`books`.`bid` "
				 + "WHERE `userbook`.`uid`=? "+where
				 + "ORDER BY `order` ASC, `datetime` DESC";
		}else{
			String tidClause = "";
			for(int i=0;i<tids.size();i++){
				if(i!=tids.size()-1)
					tidClause += " `tid` = "+tids.get(i).getAsInt() + " OR ";
				else
					tidClause += " `tid` = "+tids.get(i).getAsInt();
			}
			if(tidClause.equals(""))
				tidClause = " 1 ";

			sql = "SELECT `books`.* FROM `books` "
					+ "INNER JOIN `userbook` ON `userbook`.`bid` = `books`.`bid`"
					+ "WHERE `userbook`.`uid` = ? AND "
					+ "(SELECT COUNT(1) FROM `booktags` WHERE `booktags`.`bid` = `books`.`bid` "
					+ "AND ("+ tidClause +"))>0 " +where
					+ "ORDER BY `order` ASC, `datetime` DESC";
		}
		if(keyword==null)
			rs = DB.executeQuery(sql, uid);
		else
			rs = DB.executeQuery(sql, uid, keyword, keyword);
		List<Book> books = new ArrayList<Book>();
		while(rs.next()){
			int bid = rs.getInt("bid");
			ResultSet tagRs = DB.executeQuery("SELECT `tags`.* FROM `tags` "+
												"INNER JOIN `booktags` ON `booktags`.`tid`=`tags`.tid "+
												"WHERE `booktags`.`bid`=?", bid);
			List<Tag> tags = new ArrayList<Tag>();
			while(tagRs.next())
				tags.add(new Tag(tagRs.getInt("tid"),tagRs.getString("title")));
			
			Book book = new Book(bid, rs.getString("isbn13"), rs.getString("cover"), rs.getString("title"),
					rs.getString("author"), rs.getString("summary"), tags);
			books.add(book);
		}
		return Data(books);
	}
	
	private JsonObject exchangeBook(int bid, int uid, int uidto) throws SQLException{
		int mark = DB.executeNonQuery("DELETE FROM `userbook` "+
						   			  "WHERE `uid`=? AND `bid`=?", uid, bid);
		if(mark == 0)return Error(1021);
		DB.executeNonQuery("INSERT INTO `userbook` "+
						   "(`uid`,`bid`) VALUES (?,?)", uidto, bid);
		return Success();
	}
	
	private static class Book{
		int bid;
		String isbn13,title,cover,author,summary;
		List<Tag> tags = new ArrayList<Tag>();
		public Book(int bid, String isbn13, String cover, String title, String author, String summary, List<Tag> tags){
			this.bid = bid;
			this.isbn13 = isbn13;
			this.cover = cover;
			this.title = title;
			this.author = author;
			this.summary = summary;
			this.tags = tags;
		}
	}
	private static class Tag{
		int tid;
		String title;
		public Tag(int tid, String title){
			this.tid = tid;
			this.title = title;
		}
	}
}
