package com.hlwzd.personallibrary.modules;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.JsonObject;
import com.hlwzd.personallibrary.DBHelper;
import com.hlwzd.personallibrary.Manager.Module;
import com.hlwzd.personallibrary.Manager.User;

public class UserModule extends Module {

	public UserModule(DBHelper db, User user) {
		super(db, user);
	}

	@Override
	public JsonObject action(HttpServletRequest request) {
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
			if(action.equals("login")){//登陆
				String cellphone = request.getParameter("cellphone");
				String password = request.getParameter("password");
				if((cellphone==null)||password==null)
					return Error(1001);
				
				return login(cellphone, password);
			}
			else if(action.equals("logout")){//注销
				User.logout();
				return Success();
			}
			else if(action.equals("verifyCellphoneUnused")){//手机号有没有注册过
				String cellphone = request.getParameter("cellphone");
				if(cellphone==null)
					return Error(1001);
				return verifyCellphoneUnused(cellphone);
			}
			else if(action.equals("sendCaptcha")){ //给手机发验证码
				String cellphone = request.getParameter("cellphone");
				if(cellphone==null)
					return Error(1001);
				return sendCaptcha(cellphone);
			}
			else if(action.equals("register")){		//注册
				String cellphone = request.getParameter("cellphone");
				String password = request.getParameter("password");
				String captcha = request.getParameter("captcha");
				if(cellphone==null||password==null||captcha==null)
					return Error(1001);
				//if(!captcha.equals(User.getCaptcha()))return Error(1034);
				return register(cellphone,password);
			}
			else if(action.equals("changePassword")){//改密码
				if(!User.isLogedIn())return Error(1002);
				String oldpass = request.getParameter("oldpass");
				String newpass = request.getParameter("newpass");
				if(oldpass==null||newpass==null)return Error(1001);
				return changePassword(User.getUid(), oldpass, newpass);
			}
			else if(action.equals("resetPassword")){
				String cellphone = request.getParameter("cellphone");
				String captcha = request.getParameter("captcha");
				String password = request.getParameter("password");
				if(cellphone==null||captcha==null||password==null)
					return Error(1001);
				/*if(User.getCaptcha(cellphone)==null&&!captcha.equals(User.getCaptcha(cellphone)))
					return Error(1034);*/
				User.setCaptcha(cellphone, null);
				return resetPassword(cellphone, password);
			}
    		else if(action.equals("modifyUserInfo")){//改用户信息
				if(!User.isLogedIn())return Error(1002);
				int sex =Integer.parseInt(request.getParameter("sex"));
				String signature = request.getParameter("signature");
				String nickname = request.getParameter("nickname");
				String birthday = request.getParameter("birthday");
				if(sex==0)return Error(1001);
		        return modifyUserInfo(User.getUid(),sex,signature,nickname,birthday);
			}
			else if(action.equals("getUserinfo")){	//获取用户个人信息
				return getUserInfo(User.getUid());
			}
			else if(action.equals("getUidByCellphone")){ //给手机发验证码
				String cellphone = request.getParameter("cellphone");
				if(cellphone==null)
					return Error(1001);
				return getUidByCellphone(cellphone);
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

	private JsonObject login(String cellphone, String password) throws SQLException{//登陆
		String sql="SELECT `users`.*,`cellphone`,`sex`,`nickname`,`signature`,`birthday` FROM `users` "+
					"LEFT JOIN `userinfo` ON `userinfo`.`uid` = `users`.`uid` "+
					"WHERE `cellphone` = ? ";
		ResultSet rs = DB.executeQuery(sql, cellphone);
		if(!rs.next())return Error(1012);
		String truepass = rs.getString("password");
		if(password==null||!password.equals(truepass))return Error(1011);
		String lastlogin = rs.getString("lastlogin");
		lastlogin = (lastlogin==null)?null:lastlogin.substring(0, 19);
		User.login(rs.getInt("uid"),rs.getString("cellphone"),rs.getString("nickname"),lastlogin);
		DB.executeNonQuery("UPDATE `users` SET `lastlogin`=NOW() WHERE `uid` = ?", User.getUid());
		UserInfo user = new UserInfo(User.getUid(), rs.getInt("sex"), User.getNickname(), rs.getString("signature"), rs.getString("birthday"), User.getSessionId());
		return Data(user);
	}

	private JsonObject verifyCellphoneUnused(String cellphone) throws SQLException{//手机号有没有注册过
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `users` WHERE `cellphone` = ?", cellphone);
		if(rs.next())return Error(1032);
		return Success();
	}

	private JsonObject sendCaptcha(String cellphone) throws SQLException{//给手机发送验证码
		char[] codeSequence = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };
		String captcha = "";
		Random random = new Random();
		for(int i=0;i<6;i++)
			captcha += codeSequence[random.nextInt(10)];
		// TODO 通过短信发送验证码到指定手机号上
		User.setCaptcha(cellphone, captcha);
		JsonObject data = new JsonObject();
		data.addProperty("sessionid",User.getSessionId());
		return Data(data);
	}

	private JsonObject register(String cellphone, String password) throws SQLException{//注册
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `users` WHERE `cellphone` = ?", cellphone);
		if(rs.next())return Error(1032);
		DB.executeNonQuery("INSERT INTO `users`(`cellphone`,`password`,`regdate`,`lastlogin`) VALUES(?,?,NOW(),NOW())", 
												cellphone, password);
		DB.executeNonQuery("INSERT INTO `userinfo`(`uid`) VALUES(?)", DB.getLastInsertId());
		
		return Success();
	}

	private JsonObject changePassword(int uid, String oldpass, String newpass) throws SQLException{//改密码
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `users` WHERE `uid` = ? AND `password` = ?", uid, oldpass);
		if(!rs.next())return Error(1011);
		DB.executeNonQuery("UPDATE `users` SET `password` = ? WHERE `uid` = ?", newpass, User.getUid());
		return Success();
	}

	private JsonObject resetPassword(String cellphone, String newpass) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT 1 FROM `users` WHERE `cellphone` = ?", cellphone);
		if(!rs.next())return Error(1012);
		DB.executeNonQuery("UPDATE `users` SET `password` = ? WHERE `cellphone` = ?", newpass, cellphone);
		return Success();
	}

	
	private JsonObject modifyUserInfo(int uid,int sex,String signature,String nickname,String birthday) throws IOException, SQLException{
		DB.executeNonQuery("UPDATE `userinfo` SET `sex`=? WHERE `uid`=?", sex, uid);
		if(signature!=null)DB.executeNonQuery("UPDATE `userinfo` SET `signature`=? WHERE `uid`=?", signature, uid);
		if(nickname!=null)DB.executeNonQuery("UPDATE `userinfo` SET `nickname`=? WHERE `uid`=?", nickname, uid);
		if(birthday!=null)DB.executeNonQuery("UPDATE `userinfo` SET `birthday`=? WHERE `uid`=?", birthday, uid);
		return Success();
	}
	

	private JsonObject getUserInfo(int uid) throws SQLException{
		String sql="SELECT `sex`,`nickname`,`signature`,`birthday` FROM `users` "+
				"LEFT JOIN `userinfo` ON `userinfo`.`uid` = `users`.`uid` "+
				"WHERE `uid` = ? ";
		ResultSet rs = DB.executeQuery(sql, uid);
		if(!rs.next())return Error(1012);
		
		UserInfo user = new UserInfo(uid, rs.getInt("sex"), rs.getString("nickname"), rs.getString("signture"), rs.getString("birthday"), User.getSessionId());
		return Data(user);
	}
	
	private JsonObject getUidByCellphone(String cellphone) throws SQLException{
		ResultSet rs = DB.executeQuery("SELECT `uid` FROM `users` WHERE `cellphone` = ?", cellphone);
		if(!rs.next())return Error(1012);
		JsonObject data = new JsonObject();
		data.addProperty("uid", rs.getInt("uid"));
		return Data(data);
	}
	
	public class UserInfo{
		int uid, sex;
		String nickname,signature,birthday;
		String sessionid;
		public UserInfo(int uid, int sex, String nickname, String signature, String birthday, String sessionid){
			this.uid = uid;
			this.sex = sex;
			this.nickname = nickname;
			this.signature = signature;
			this.birthday = birthday;
			this.sessionid = sessionid;
		}
	}
	
}

