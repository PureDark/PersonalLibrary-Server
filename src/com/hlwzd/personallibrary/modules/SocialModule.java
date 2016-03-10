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

public class SocialModule extends Module {

	public SocialModule(DBHelper db, User user) {
		super(db, user);
	}

	@Override
	public JsonObject action(HttpServletRequest request) {
		if(!User.isLogedIn())
			return Error(1002);
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
		    if(action.equals("addRequest")){
		    	String fidStr = request.getParameter("fid");
		    	if(fidStr==null)return Error(1001);		    	
				int fid = Integer.parseInt(fidStr);
				return addRequest(User.getUid(), fid);
			}
		    else if(action.equals("getRequestList")){
		    	String pageStr = request.getParameter("page");
				int page = (pageStr==null)?1:Integer.parseInt(pageStr);
		    	return getRequestList(User.getUid(), page);
		    }
			else if(action.equals("responseRequest")){
				String rid = request.getParameter("rid");
				String acceptStr = request.getParameter("accept");
				if(rid==null||acceptStr==null)return Error(1001);
				boolean accept = (Integer.parseInt(acceptStr)==1);
				return responseRequest(User.getUid(), Integer.parseInt(rid),accept);			
			}
			else if(action.equals("deleteFriend")){
				String fid = request.getParameter("fid");
				if(fid==null)return Error(1001);
				return deleteFriend(User.getUid(), Integer.parseInt(fid));
			}
			else if(action.equals("getFriendList")){
				String uidStr = request.getParameter("uid");
				String pageStr = request.getParameter("page");
				int uid = (uidStr==null)?User.getUid():Integer.parseInt(uidStr);
				int page = (pageStr==null)?1:Integer.parseInt(pageStr);
				return getFriendList(uid, page);
			}
			else if(action.equals("addBookMark")){
				String bid = request.getParameter("bid");
				String title = request.getParameter("title");
				String content = request.getParameter("content");
				if(bid==null||title==null||content==null)
					return Error(1001);
				return addBookMark(User.getUid(), Integer.parseInt(bid), title, content);
			}
			else if(action.equals("getBookMarkList")){
				String bidStr = request.getParameter("bid");
				String uidStr = request.getParameter("uid");
				String pageStr = request.getParameter("page");
				int bid = (bidStr==null)?0:Integer.parseInt(bidStr);
				int uid = (uidStr==null)?User.getUid():Integer.parseInt(uidStr);
				int page= (pageStr==null)?1:Integer.parseInt(pageStr);
				return getBookMarkList(bid, uid, page);
			}
			else if(action.equals("deleteBookMark")){
				String mid = request.getParameter("mid");
				if(mid==null)return Error(1001);
				return deleteBookMark(User.getUid(), Integer.parseInt(mid));
			}
			else if(action.equals("getRecentBookMarks")){
				String pageStr = request.getParameter("page");
				String uidStr = request.getParameter("uid");
				int page = (pageStr==null)?1:Integer.parseInt(pageStr);
				int uid = (uidStr==null)?User.getUid():Integer.parseInt(uidStr);
				return getRecentBookMarks(uid,page);
			}
			else if(action.equals("getBookMarkDetails")){
				String midStr = request.getParameter("mid");
				if(midStr==null) return Error(1001);
				int mid=Integer.parseInt(midStr);
				return getBookMarkDetails(mid);
			}
			else if(action.equals("searchUser")){
				String keyword = request.getParameter("keyword");
				String p = request.getParameter("page");
				int page;
				if(keyword==null) return Error(1001);			
				if(p==null) page=1;
				else page=Integer.parseInt(p);
				return searchUser(User.getUid(), keyword,page);
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

	private JsonObject getBookMarkList(int bid, int uid, int page) throws SQLException {
		String wherebid = (bid==0)?" 1 ":" `bookmarks`.`bid`= " + bid;
		String whereuid = (uid==0)?" AND 1 ":" AND `bookmarks`.`uid`= " + uid;
		String sql = "SELECT `mid`,`bookmarks`.`title`, `bookmarks`.`summary`,`time`,"
					+ "`books`.`bid`,`isbn13`,`books`.`title` AS `book_title`,`cover`, "
					+ "`userinfo`.`uid`,`nickname`,`signature` FROM `bookmarks` "
					+ " INNER JOIN `books` ON `books`.`bid` = `bookmarks`.`bid` "
					+ " INNER JOIN `userinfo` ON `userinfo`.`uid` = `bookmarks`.`uid` "
					+ " WHERE "+wherebid+whereuid
					+ " ORDER BY `time` DESC LIMIT ?,10 ";
		ResultSet rs = DB.executeQuery(sql, (page-1)*10);
		List<BookMark> bookmarks = new ArrayList<BookMark>();
		while(rs.next()){
			BookMark bookmark = new BookMark(rs.getInt("mid"), rs.getString("title"), rs.getString("summary"), null, rs.getString("time").substring(0,19),
											rs.getInt("bid"), rs.getString("isbn13"), rs.getString("book_title"), rs.getString("cover"),
											rs.getInt("uid"), rs.getString("nickname"), rs.getString("signature"));
			bookmarks.add(bookmark);
		}
		return Data(bookmarks);
	}

	private JsonObject getRecentBookMarks(int uid, int page) throws SQLException {
		String sql = "SELECT `mid`,`bookmarks`.`title`, `bookmarks`.`summary`,`time`,"
					+ "`books`.`bid`,`isbn13`,`books`.`title` AS `book_title`,`cover`, "
					+ "`userinfo`.`uid`,`nickname`,`signature` FROM `bookmarks` "
					+ " INNER JOIN `books` ON `books`.`bid` = `bookmarks`.`bid` "
					+ " INNER JOIN `userinfo` ON `userinfo`.`uid` = `bookmarks`.`uid` "
					+ " WHERE `bookmarks`.`uid` = ? OR "
					+ "(SELECT COUNT(1) FROM `friends` WHERE `friends`.`uid` = ? AND `friends`.`fid` = `bookmarks`.`uid`)=1 "
					+ " ORDER BY `time` DESC LIMIT ?,10 ";
		ResultSet rs = DB.executeQuery(sql, uid, uid, (page-1)*10);
		List<BookMark> bookmarks = new ArrayList<BookMark>();
		while(rs.next()){
			BookMark bookmark = new BookMark(rs.getInt("mid"), rs.getString("title"), rs.getString("summary"), null, rs.getString("time").substring(0,19),
											rs.getInt("bid"), rs.getString("isbn13"), rs.getString("book_title"), rs.getString("cover"),
											rs.getInt("uid"), rs.getString("nickname"), rs.getString("signature"));
			bookmarks.add(bookmark);
		}
		return Data(bookmarks);
	}

	private JsonObject getBookMarkDetails(int mid) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT `bookmarks`.*,`isbn13`,`books`.`title` AS `book_title`,`cover`,"
										+ " `userinfo`.`uid`,`nickname`,`signature` FROM `bookmarks` "
										+ " INNER JOIN `books` ON `books`.`bid` = `bookmarks`.`bid` "
										+ " INNER JOIN `userinfo` ON `userinfo`.`uid` = `bookmarks`.`uid` "
										+ " WHERE `mid` = ?",mid);
		if(!rs.next())return Error(1024);
		BookMark bookmark = new BookMark(rs.getInt("mid"), rs.getString("title"), rs.getString("summary"), rs.getString("content"), rs.getString("time").substring(0,19),
										rs.getInt("bid"), rs.getString("isbn13"), rs.getString("book_title"), rs.getString("cover"),
										rs.getInt("uid"), rs.getString("nickname"), rs.getString("signature"));
		return Data(bookmark);
	}


	private JsonObject deleteBookMark(int uid, int mid) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `bookmarks` WHERE `mid`=? AND `uid` = ?", mid, uid);
		if(!rs.next()) return Error(1051);
		DB.executeNonQuery("DELETE FROM `bookmarks` WHERE mid=?", mid);
		return Success();
	}

	private JsonObject addBookMark(int uid, int bid, String title, String content) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `books` WHERE `bid`=?", bid);
		if(!rs.next()) return Error(1022);
		String summary;
		if(content.length()>200)
			summary = content.substring(0,199);
		else 
			summary = content;
		DB.executeNonQuery("INSERT INTO `bookmarks` (`uid`,`bid`,`title`,`summary`,`content`,`time`) VALUES (?,?,?,?,?,NOW())", uid, bid, title, summary, content);
		return Success();
	}

	private JsonObject getFriendList(int uid, int page) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT *,"
									+ " (SELECT COUNT(1) FROM `friends` WHERE `friends`.`uid` = ? AND `friends`.`fid` = `userinfo`.`uid`) AS `isFriend` "
									+ " FROM `userinfo` "
									+ " WHERE (SELECT COUNT(1) FROM `friends` WHERE `friends`.`uid` = ? AND `friends`.`fid` = `userinfo`.`uid`)=1 "
									+ " ORDER BY `letter` ASC "
									+ " LIMIT ?,100", uid, uid, (page-1)*100);
		List<Friend> friends = new ArrayList<Friend>();
		while(rs.next())
			friends.add(new Friend(rs.getInt("uid"), rs.getInt("sex"),rs.getString("nickname"), rs.getString("signature"), rs.getString("birthday"), rs.getInt("isFriend")==1));		
		return Data(friends);
	}

	private JsonObject deleteFriend(int uid, int fid) throws SQLException {
		DB.executeNonQuery("DELETE FROM `friends` WHERE `uid`=? AND `fid`=?", uid,fid);
		DB.executeNonQuery("DELETE FROM `friends` WHERE `uid`=? AND `fid`=?", fid,uid);
		return Success();
	}


	private JsonObject addRequest(int uid, int fid) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `requests` WHERE `uid`=? AND `fid`=? AND `status` =0", uid, fid);
		if(rs.next()) return Error(1030);
		DB.executeNonQuery("INSERT INTO requests(`uid`,`fid`,`datetime`,`status`) VALUES (?,?,NOW(),0)", uid, fid);
		return Success();
	}

	private JsonObject getRequestList(int uid, int page) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT `rid`,`userinfo`.`uid`,`nickname`,`status` FROM `requests` "
									+ "INNER JOIN `userinfo` ON `userinfo`.uid = `requests`.`uid` "
									+ "WHERE `fid` = ? ORDER BY `datetime` DESC LIMIT ?,100", uid, (page-1)*100);
		List<Request> requests = new ArrayList<Request>();
		while(rs.next()){
			Request request = new Request(rs.getInt("rid"), rs.getInt("uid"), rs.getString("nickname"), rs.getInt("status"));
			requests.add(request);
		}
		return Data(requests);
	}

	private JsonObject responseRequest(int uid, int rid, boolean accept) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `uid` FROM `requests` WHERE `rid`=? AND `fid`= ? AND `status` = 0", rid, uid);
		if(!rs.next()) return Error(1012);
		if(accept==true){
			int fid = rs.getInt("uid");
			DB.executeNonQuery("UPDATE `requests` SET `status`=1 WHERE `rid`= ?", rid);
			DB.executeNonQuery("UPDATE `requests` SET `status`=1 WHERE `uid`=? AND `fid` = ? AND `status` = 0", fid, uid);
			DB.executeNonQuery("INSERT INTO `friends` (`uid`,`fid`) VALUES (?,?)", uid, fid);	
			DB.executeNonQuery("INSERT INTO `friends` (`uid`,`fid`) VALUES (?,?)", fid, uid);
		}
		else
			DB.executeNonQuery("UPDATE `requests` SET `status` = 2 WHERE `rid`=?", rid);
		return Success();
	}

	private JsonObject searchUser(int uid, String keyword, int page) throws SQLException {
		keyword = "%"+keyword+"%";
		ResultSet rs = DB.executeQuery("SELECT *,"
									+ " (SELECT COUNT(1) FROM `friends` WHERE `friends`.`uid` = ? AND `friends`.`fid` = `userinfo`.`uid`) AS `isFriend` "
									+ " FROM `userinfo` WHERE `nickname` LIKE ? AND `userinfo`.`uid` != ?"
									+ " ORDER BY `letter` ASC "
									+ " LIMIT ?,10", uid, keyword, uid, (page-1)*10);
		List<Friend> friends = new ArrayList<Friend>();
		while(rs.next())
			friends.add(new Friend(rs.getInt("uid"), rs.getInt("sex"),rs.getString("nickname"), rs.getString("signature"), rs.getString("birthday"), rs.getInt("isFriend")==1));		
		return Data(friends);
	}
	
	private static class Friend{
	    public int uid;
	    public int sex;
	    public String nickname,signature;
	    public String birthday;
	    public boolean isFriend = false;
	    public Friend(int uid, int sex, String nickname, String signature, String birthday, boolean isFriend){
	        this.uid = uid;
	        this.sex = sex;
	        this.nickname = nickname;
	        this.signature = signature;
	        this.birthday = birthday;
	        this.isFriend = isFriend;
	    }
	}
	
	private static class Request{
		int rid,uid,status;
		String nickname;
		public Request(int rid, int uid, String nickname, int status) {
			this.rid = rid;
			this.uid = uid;
			this.nickname = nickname;
			this.status = status;
		}
	}
	
	private static class BookMark{
	    int mid, bid, uid;
	    String title, summary, content, time, isbn13, book_title, book_cover, nickname, signature;
	    public BookMark(int mid, String title, String summary, String content, String time, int bid, String isbn13, String book_title, String book_cover, int uid, String nickname, String signature) {
	        this.mid = mid;
	        this.title = title;
	        this.summary = summary;
	        this.content = content;
	        this.time = time;
	        this.bid = bid;
	        this.isbn13 = isbn13;
	        this.book_title = book_title;
	        this.book_cover = book_cover;
	        this.uid = uid;
	        this.nickname = nickname;
	        this.signature = signature;
	    }	
	}
	
}
