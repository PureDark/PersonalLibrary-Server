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
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
		    if(action.equals("addRequest")){
		    	String f = request.getParameter("fid");
		    	int fid;
		    	if(f==null)return Error(1001);		    	
				fid = Integer.parseInt(f);
				return addRequest(fid);
			}
		    else if(action.equals("getRequestList")){
		    	String p = request.getParameter("page");
		    	int page;
		    	if(p==null) page=1;
		    	else page=Integer.parseInt(p);
		    	return getRequestList(page);
		    }
			else if(action.equals("responseRequest")){
				String rrid = request.getParameter("rrid");
				String acceptStr = request.getParameter("accept");
				if(rrid==null||acceptStr==null)return Error(1001);
				boolean accept = (Integer.parseInt(acceptStr)==1);
				return responseRequest(Integer.parseInt(rrid),accept);			
			}
			else if(action.equals("deleteFriend")){
				String fid = request.getParameter("fid");
				if(fid==null)return Error(1001);
				return deleteFriend(Integer.parseInt(fid));
			}
			else if(action.equals("getFriendList")){
				String p = request.getParameter("page");
				int page;
				if(p==null) page=1;
				else page=Integer.parseInt(p);
				return getFriendList(page);
			}
			else if(action.equals("addMark")){
				String bid = request.getParameter("bid");
				String content = request.getParameter("content");
				if(bid==null||content==null)return Error(1001);
				return addMark(Integer.parseInt(bid),content);
			}
			else if(action.equals("getMarks")){
				String b = request.getParameter("bid");
				String p = request.getParameter("page");
				int bid,page;
				if(b==null) return Error(1001);
				else bid=Integer.parseInt(b);
				if(p==null) page=1;
				else page=Integer.parseInt(p);
				return getMarks(bid,page);
			}
			else if(action.equals("deleteMark")){
				String mid = request.getParameter("mid");
				if(mid==null)return Error(1001);
				return deleteMark(Integer.parseInt(mid));
			}
			else if(action.equals("getMoments")){
				String p = request.getParameter("page");
				String u = request.getParameter("uid");
				int page,uid;
				if(u==null) uid=0;
				else uid=Integer.parseInt(u);
				if(p==null) page=1;
				else page=Integer.parseInt(p);			
				return getMoments(uid,page);
			}
			else if(action.equals("getMarkDetails")){
				String m = request.getParameter("mid");
				int mid;
				if(m==null) return Error(1001);
				else mid=Integer.parseInt(m);
				return getMarkDetails(mid);
			}
			else if(action.equals("searchUser")){
				String keyword = request.getParameter("keyword");
				String p = request.getParameter("page");
				int page;
				if(keyword==null) return Error(1001);			
				if(p==null) page=1;
				else page=Integer.parseInt(p);
				return searchUser(keyword,page);
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

	private JsonObject searchUser(String keyword, int page) throws SQLException {
		keyword = "%"+keyword+"%";
		ResultSet rs = DB.executeQuery("SELECT * FROM `userinfo` WHERE `nickname` LIKE ? LIMIT ?,10",keyword,(page-1)*10);
		List<UserInfo> userInfos = new ArrayList<UserInfo>();
		while(rs.next())
			userInfos.add(new UserInfo(rs.getInt("uid"),rs.getString("nickname"),rs.getString("signature")));		
		return Data(userInfos);
	}



	private JsonObject getMoments(int uid, int page) throws SQLException {
		String sql1 ="SELECT `userinfo`.uid,`userinfo`.nickname,`marks`.mid,`marks`.bid,`marks`.summary,`marks`.time FROM `marks`"
				+ "INNER JOIN `userinfo` ON `userinfo`.`uid`=`marks`.`uid` "
				+ "WHERE `marks`.`uid` IN (SELECT `fid` FROM `friend_list` WHERE `uid` = ?) OR `marks`.uid = ? "
				+ "ORDER BY `marks`.time DESC  LIMIT ?,10 ";
		
		String sql2 = "SELECT `userinfo`.uid,`userinfo`.nickname,`marks`.mid,`marks`.bid,`marks`.summary,`marks`.time FROM `marks`"
				+ "INNER JOIN `userinfo` ON `userinfo`.`uid`=`marks`.`uid` "
				+ "WHERE `marks`.`uid` = ? "
				+ "ORDER BY `marks`.time DESC  LIMIT ?,10 ";
		ResultSet rs;
		if(uid==0) 
			rs = DB.executeQuery(sql1,User.getUid(),User.getUid(),(page-1)*10);
		else 
			rs = DB.executeQuery(sql2,uid,(page-1)*10);
		List<Moment> moments = new ArrayList<Moment>();
		while(rs.next()){
			Moment moment = new Moment(rs.getInt("uid"),rs.getInt("bid"),rs.getInt("mid")
					                     ,rs.getString("nickname"),rs.getString("summary"),rs.getString("time"));
			moments.add(moment);
		}
		return Data(moments);
	}

	private JsonObject getMarkDetails(int mid) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT * FROM `marks` WHERE `mid`=?",mid);
		MarkDetail markDetail = null;
		while(rs.next()){
			markDetail = new MarkDetail(rs.getInt("mid"),rs.getString("summary"),rs.getString("time"),rs.getString("content"));
		}	
		return Data(markDetail);
	}

	private JsonObject getMarks(int bid, int page) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT `mid`,`summary`,`time` FROM marks "
										+ "WHERE `bid`=? ORDER BY `time` DESC LIMIT ?,10 ", bid,(page-1)*10);
		List<Mark> marks = new ArrayList<Mark>();
		while(rs.next()){
			Mark mark = new Mark(rs.getInt("mid"),rs.getString("summary"),rs.getString("time"));
			marks.add(mark);
		}
		return Data(marks);
	}


	private JsonObject deleteMark(int mid) throws SQLException {
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `marks` WHERE `mid`=? AND `uid` = ?", mid,User.getUid());
		if(!rs.next()) return Error(1012);
		DB.executeNonQuery("DELETE FROM marks WHERE mid=?",mid);
		return Success();
	}

	private JsonObject addMark(int bid,String content) throws SQLException {
		int uid = User.getUid();
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `books` WHERE `bid`=?", bid);
		if(!rs.next()) return Error(1012);
		String summary;
		if(content.length()>100)
			summary = content.substring(0,99);
		else 
			summary = content;
		DB.executeNonQuery("INSERT INTO marks (content,time,bid,uid,summary) VALUES (?,NOW(),?,?,?)",content,bid,uid,summary);
		return Success();
	}

	private JsonObject getFriendList(int page) throws SQLException {
		int uid = User.getUid();
		ResultSet rs = DB.executeQuery("SELECT `friend_list`.fid,`userinfo`.signature, `userinfo`.nickname FROM `friend_list`"
				+ " INNER JOIN `userinfo` ON `friend_list`.fid=`userinfo`.uid WHERE `friend_list`.uid=?", uid);
		List<UserInfo> friendInfos = new ArrayList<UserInfo>();
		while(rs.next()){
			UserInfo friendInfo = new UserInfo(rs.getInt("fid"),rs.getString("nickname"),rs.getString("signature"));
			friendInfos.add(friendInfo);
		}
		return Data(friendInfos);
	}

	private JsonObject deleteFriend(int fid) throws SQLException {
		int uid = User.getUid();
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `users` WHERE `uid`=?", fid);
		if(!rs.next()) return Error(1012);
		DB.executeNonQuery("DELETE FROM friend_list WHERE uid=? AND fid=?", uid,fid);
		DB.executeNonQuery("DELETE FROM friend_list WHERE uid=? AND fid=?", fid,uid);
		return Success();
	}


	private JsonObject addRequest(int fid) throws SQLException {
		int uid = User.getUid();
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `requests_record` WHERE `uid`=? AND `fid`=? AND `status` =0",uid,fid);
		if(rs.next()) return Error(1030);
		DB.executeNonQuery("INSERT INTO requests_record (uid,fid,date,status) VALUES (?,?,NOW(),0)",uid,fid);
		return Success();
	}

	private JsonObject getRequestList(int page) throws SQLException {
		int uid = User.getUid();
		ResultSet rs = DB.executeQuery("SELECT * FROM `requests_record` "
				+ "INNER JOIN `userinfo` ON `userinfo`.uid = `requests_record`.uid "
				+ "WHERE fid=? AND `status`=0 LIMIT ?,10",User.getUid(),(page-1)*10);
		List<RequestInfo> requestInfos = new ArrayList<RequestInfo>();
		while(rs.next()){
			RequestInfo requestInfo = new RequestInfo(rs.getInt("uid"),rs.getString("nickname"),rs.getString("signature"),rs.getInt("rrid"));
			requestInfos.add(requestInfo);
		}
		return Data(requestInfos);
	}

	private JsonObject responseRequest(int rrid, boolean accept) throws SQLException{
		int uid = User.getUid();
		ResultSet rs = DB.executeQuery("SELECT `uid` FROM `requests_record` WHERE `rrid`=? AND `status` = 0", rrid);
		if(!rs.next()) return Error(1012);
		if(accept==true){
			DB.executeNonQuery("UPDATE requests_record SET `status`=1 WHERE `rrid`=?",rrid);
			DB.executeNonQuery("INSERT INTO friend_list (uid,fid) VALUES (?,?)", uid,rs.getInt("uid"));	
			DB.executeNonQuery("INSERT INTO friend_list (uid,fid) VALUES (?,?)", rs.getInt("uid"),uid);			
		}
		else
			DB.executeNonQuery("UPDATE requests_record SET `status`=2 WHERE `rrid`=?",rrid);
		return Success();
	}
	
	
	
	private static class UserInfo{
		int uid;
		String name,signature;
		public UserInfo(int uid, String name, String signature) {
			this.uid = uid;
			this.name = name;
			this.signature = signature;
		}
	}
	
	private static class RequestInfo extends UserInfo{
		int rrid;
		public RequestInfo(int uid, String name, String signature, int rrid) {
			super(uid, name, signature);
			this.rrid = rrid;
		}
	}
	
	private static class Mark{
		int mid;
		String summary,time;
		public Mark(int mid, String summary,String time) {
			super();
			this.mid = mid;
			this.summary = summary;
			this.time = time;
		}		
	}
	
	private static class MarkDetail extends Mark{
		String content;
		public MarkDetail(int mid, String summary, String time,String content) {
			super(mid, summary,time);
			this.content = content;
		}	
	}

	private static class Moment{
		int uid,bid,mid;
		String name,summary,time;
		public Moment(int uid, int bid, int mid, String name, String summary,String time) {
			this.uid = uid;
			this.bid = bid;
			this.mid = mid;
			this.name = name;
			this.summary = summary;
			this.time = time;
		}
	}
	
	
	
}
