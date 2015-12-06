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
				String description = request.getParameter("description");
				if((isbn13==null||title==null))
					return Error(1001);
				return addBook(User.getUid(), isbn13, title, cover, author, description);
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
				int uid = User.getUid();
				String tidsStr = request.getParameter("tids");
				JsonParser parser = new JsonParser();
				JsonArray tids = (tidsStr==null)?new JsonArray():parser.parse(tidsStr).getAsJsonArray();
				return getBookList(uid, tids);
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

	private JsonObject addBook(int uid, String isbn13, String title, String cover, String author, String description) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `bid` FROM `books` WHERE `isbn13` = ?", isbn13);
		int bid;
		if(rs.next()){
			bid = rs.getInt("bid");
		}else{
			DB.executeNonQuery("INSERT INTO `books` "+
							   "(`isbn13`,`title`,`cover`,`author`,`description`,`regdate`) "+
							   "VALUES (?,?,?,?,?,NOW())", isbn13, title, cover, author, description);
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
	
	private JsonObject getBookList(int uid, JsonArray tids) throws SQLException{
		ResultSet rs;
		if(tids.size()==0)
			rs = DB.executeQuery("SELECT `books`.* FROM `books` "+
								 "INNER JOIN `userbook` ON `userbook`.`bid`=`books`.`bid` "+
								 "WHERE `userbook`.`uid`=?", uid);
		else{
			String tidClause = "";
			for(int i=0;i<tids.size();i++){
				if(i!=tids.size()-1)
					tidClause += " `tid` = "+tids.get(i).getAsInt() + " OR ";
				else
					tidClause += " `tid` = "+tids.get(i).getAsInt();
			}
			if(tidClause.equals(""))
				tidClause = " 1 ";

			rs = DB.executeQuery("SELECT `books`.* FROM `books` "
								+ "INNER JOIN `userbook` ON `userbook`.`bid` = `books`.`bid`"
								+ "WHERE `userbook`.`uid` = 1 AND "
								+ "(SELECT COUNT(1) FROM `booktags` WHERE `booktags`.`bid` = `books`.`bid` "
								+ "AND ("+ tidClause +"))>0");
		}
		List<Book> books = new ArrayList<Book>();
		while(rs.next()){
			int bid = rs.getInt("bid");
			ResultSet tagRs = DB.executeQuery("SELECT `tags`.* FROM `tags` "+
												"INNER JOIN `booktags` ON `booktags`.`tid`=`tags`.tid "+
												"WHERE `booktags`.`bid`=?", bid);
			List<Tag> tags = new ArrayList<Tag>();
			while(tagRs.next())
				tags.add(new Tag(tagRs.getInt("tid"),tagRs.getString("title")));
			
			Book book = new Book(bid, rs.getString("name"), rs.getString("summary"), 
							rs.getString("cover"), rs.getDouble("price"), tags);
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
		String name,summary,cover;
		double price;
		List<Tag> tags = new ArrayList<Tag>();
		public Book(int bid, String name, String summary, String cover, double price, List<Tag> tags){
			this.bid = bid;
			this.name = name;
			this.summary = summary;
			this.cover = cover;
			this.price = price;
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
