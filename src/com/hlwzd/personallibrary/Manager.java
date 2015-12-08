package com.hlwzd.personallibrary;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.google.gson.*;
import com.hlwzd.personallibrary.Manager.Module.CallBack;

/**
 * 加载不同模块进行请求派发 
 * @Author       梁雨聪 (PureDark)
 * @CreateDate   2015-07-10 
 * @Version      v1.0
 */

public class Manager {
	private DBHelper db;

	public Manager(){
		db = new DBHelper(DatabaseConfig.host,DatabaseConfig.user,DatabaseConfig.password,DatabaseConfig.database);		//实例化数据库帮助类
	}
	
	/**
	 * 加载指定名字的module
	 * @param module 加载的模块的别名，用于从数据库中提取module对应的类路径
	 * @param request 接收的http请求
	 * @return JsonObject 固定格式的Json对象，必定含有boolean status, 为false则包含int errorCode，根据API不同还可能包含JsonElement data.
	 */
	public JsonObject operate(String module, HttpServletRequest request){
		if(module == null)return Module.Error(1001);
		MySessionContext msc = MySessionContext.getInstance();
		String sessionid = request.getParameter("sessionid");
		HttpSession session = 
				(sessionid!=null&&msc.getSession(sessionid)!=null)
				?msc.getSession(sessionid)
				:request.getSession();
		msc.AddSession(session);
		//if(msc.getSessions()!=null)return Module.Data(msc.getSessions());
		User user = new User(session);
		try {
			ResultSet rs = db.executeQuery("SELECT `com` FROM `modules` WHERE `name` = ?", module);
			if(!rs.next())return Module.Error(1003);
			String com = rs.getString("com");
			//根据指定的模块名获取到对应的module并实例化
			Module mod = (Module)Class.forName(com).getConstructor(DBHelper.class, User.class).newInstance(db,user);
			//执行对应的module的操作
		    return mod.action(request);
		} catch (SQLException e) {
			e.printStackTrace();
			return Module.Error(1010);
		} catch (Exception e) {
			e.printStackTrace();
			return Module.Error(1000);
		}
	}
	
	/**
	 * Module父类，每一个模块类都继承自该类，并重写action()方法
	 */
	public abstract static class Module{
		protected DBHelper DB;
		protected User User;
		
		public Module(DBHelper db, User user){
			this.DB = db;
			this.User = user;
		}

		/**
		 * 子模块实现该方法，实现具体功能的业务逻辑
		 * @param request 接收的http请求
		 * @return JsonObject 固定格式的Json对象，必定含有boolean status, 为false则包含int errorCode，根据API不同还可能包含JsonElement data.
		 */
		public abstract JsonObject action(HttpServletRequest request);
		
		/**
		 * 带回调函数的action
		 * @param request 接收的http请求
		 * @param callback 实现CallBack的匿名内部类，在action()执行结束后执行onComputeEnd()方法
		 * @return JsonObject 固定格式的Json对象，必定含有boolean status, 为false则包含int errorCode，根据API不同还可能包含JsonElement data.
		 */
		public JsonObject action(HttpServletRequest request, CallBack callback) {
			return callback.onComputeEnd(action(request));
		}
		
		/**
		 * 用于返回包含成功信息的JsonObject
		 * @return JsonObject 固定格式的Json对象，包含boolean status = true.
		 */
		protected static JsonObject Success(){
			JsonObject result = new JsonObject();
			result.addProperty("status", true);
			return result;
		}
		
		/**
		 * 用于返回包含错误码的JsonObject
		 * @param errorcode 需要返回的错误码
		 * @return JsonObject 固定格式的Json对象，包含boolean status = false, int errorCode.
		 */
		protected static JsonObject Error(int errorcode){
			JsonObject result = new JsonObject();
			result.addProperty("status", false);
			result.addProperty("errorCode", errorcode);
			return result;
		}
		
		/**
		 * 用于返回包含错误信息的JsonObject
		 * @param error 需要返回的错误对象
		 * @return JsonObject 固定格式的Json对象，包含boolean status = false, int errorCode.
		 */
		protected static JsonObject Error(int errorcode, Object error){
			Gson gson = new Gson();
			JsonObject result = new JsonObject();
			result.addProperty("status", false);
			result.addProperty("errorCode", errorcode);
			result.add("errorMessage", gson.toJsonTree(error));
			return result;
		}
		
		/**
		 * 用于返回包含信息的JsonObject
		 * @param data 返回的数据，数据以一个对象的形式传输，转换为JsonElement存于返回的Json对象的data属性中
		 * @return JsonObject 固定格式的Json对象，包含boolean status = true, JsonElement data.
		 */
		protected static JsonObject Data(Object data){
			Gson gson = new Gson();
			JsonObject result = new JsonObject();
			result.addProperty("status", true);
			result.add("data", gson.toJsonTree(data));
			return result;
		}
		
		/**
		 * 回调接口
		 */
		public static interface CallBack{
			public JsonObject onComputeEnd(JsonObject result);
		}
	
	}
	
	/**
	 * 封装有从Session中获取登录用户各种信息的方法的用户类
	 */
	public static class User{
		public static int USERTYPE_STUTENT = 1;
		public static int USERTYPE_TEACHER = 2;
		private HttpSession session;
		
		public User(HttpSession session){
			this.session = session;
		}
		
		public boolean isLogedIn(){
			return session.getAttribute("uid")!=null;
		}
		
		public int getUid(){
			return isLogedIn()?(Integer)session.getAttribute("uid"):0;
		}
		
		public String getNickname(){
			return isLogedIn()?(String)session.getAttribute("nickname"):null;
		}
		
		public String getLastLogin(){
			return isLogedIn()?(String)session.getAttribute("lastlogin"):null;
		}
		
		public String getSessionId(){
			return session.getId();
		}
		
		public void setCaptcha(String cellphone, String captcha){
			session.setAttribute(cellphone, captcha);
		}
		
		public String getCaptcha(String cellphone){
			return (String) session.getAttribute(cellphone);
		}
		
		public void login(int uid, String cellphone, String nickname, String lastlogin){
			session.setAttribute("uid", uid);
			session.setAttribute("cellphone", cellphone);
			session.setAttribute("nickname", nickname);
			session.setAttribute("lastlogin", lastlogin);
		}
		
		public void logout(){
			session.removeAttribute("uid");
			session.removeAttribute("cellphone");
			session.removeAttribute("nickname");
			session.removeAttribute("lastlogin");
			session.removeAttribute("captcha");
		}
		
	}
	
}
