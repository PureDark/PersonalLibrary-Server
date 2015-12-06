package com.hlwzd.personallibrary;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import com.mysql.jdbc.Driver;

/**
 * 类说明：mysql数据库帮助类
 * 
 * @author 梁雨聪 (PureDark)
 * @version 创建时间：2015-03-05
 */

public class DBHelper {
	private Connection con;
	private int insert_id = 0;
	
	/**
	 * 实例化时创建一条数据库链接
	 * @param host 数据库的host地址
	 * @param user 数据库用户名
	 * @param password 数据库密码
	 * @param database 要连接的数据库名
	 */
	public DBHelper(String host, String user, String password, String database){
		 con = getCon(host, user, password, database);
         try {
			this.executeNonQuery("set time_zone = '+8:00'");
		 }catch (SQLException e) {
			e.printStackTrace();
		 }
	}
	/**
	 * 是否连接上数据库
	 * @return boolean
	 */
	public boolean isConnected(){
		return con!=null;
	}
	private static Connection getCon(String host, String user, String password, String database) {
	      Connection con = null;
	      try {
	    	  	String driver = "com.mysql.jdbc.Driver";
	    		String url = "jdbc:mysql://"+host+"/"+database+"?useUnicode=true&characterEncoding=UTF-8";
	    		Class.forName(driver); //加载数据库驱动
	    		con = DriverManager.getConnection(url, user, password);
	       } catch (Exception e) {
	            e.printStackTrace();
	       }
	       return con;
	} 

	/**
	 * 执行查询语句
	 * @return ResultSet
	 * @throws SQLException - 语句执行出错或数据库关闭则抛出异常
	 */
	public ResultSet executeQuery(String sql) throws SQLException {
	       Statement stmt = con.createStatement();
	       ResultSet rs = stmt.executeQuery(sql);
	       return rs;
	}

	/**
	 * 用prepare方法执行查询语句
	 * @param sql 要执行的SQL语句，语句中使用?代替变量位置
	 * @param obj 按SQL语句中?的顺序将变量当成参数传给方法
	 * @return ResultSet
	 * @throws SQLException - 语句执行出错或数据库关闭则抛出异常
	 */
	public ResultSet executeQuery(String sql, Object... obj)   throws SQLException {
	     PreparedStatement pstmt = con.prepareStatement(sql);
	     for (int i = 0; i < obj.length; i++) {
	           pstmt.setObject(i + 1, obj[i]);
	     }
	     ResultSet rs = pstmt.executeQuery();
	     return rs;
	}
	/**
	 * 执行增删改语句
	 * @return int 影响行数
	 * @throws SQLException - 语句执行出错或数据库关闭则抛出异常
	 */
	public int executeNonQuery(String sql) throws SQLException {
	     Statement stmt = con.createStatement();
	     int affected = stmt.executeUpdate(sql,Statement.RETURN_GENERATED_KEYS);
	     ResultSet rs= stmt.getGeneratedKeys();
	     if(rs.next())insert_id = rs.getInt(1);
	     return affected;
	}

	/**
	 * 用prepare方法执行增删改语句
	 * @param sql 要执行的SQL语句，语句中使用?代替变量位置
	 * @param obj 按SQL语句中?的顺序将变量当成参数传给方法
	 * @return int 影响行数
	 * @throws SQLException - 语句执行出错或数据库关闭则抛出异常
	 */
	public int executeNonQuery(String sql, Object... obj) throws SQLException {
	     PreparedStatement pstmt = con.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
	     for (int i = 0; i < obj.length; i++) {
	          pstmt.setObject(i + 1, obj[i]);
	     }
	     int affected =  pstmt.executeUpdate();
	     ResultSet rs= pstmt.getGeneratedKeys();
	     if(rs.next())insert_id = rs.getInt(1);
	     return affected;
	}
	/**
	 * 获得最后插入项的id
	 * @return int 最后一次Insert产生的id，没有执行过则返回0
	 * @throws SQLException - 语句执行出错或数据库关闭则抛出异常
	 */
	public int getLastInsertId() throws SQLException {
	     return insert_id;
	}
}
