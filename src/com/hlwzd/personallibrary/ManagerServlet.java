package com.hlwzd.personallibrary;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * 接收HTTP请求的Servlet
 * @Author       梁雨聪 (PureDark)
 * @CreateDate   2015-07-10 
 * @Version      v1.0
 */

@MultipartConfig()
public class ManagerServlet extends HttpServlet {

	public ManagerServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();										//实例化Google的JSON工具类
		Manager manager = new Manager();							//Manager类根据module进行请求派发
		String module = request.getParameter("module");
		JsonObject result = manager.operate(module, request);		//返回一个JsonObject
		out.print(gson.toJson(result));								//将JsonObject转化为JSON字符串输出
//		out.print(gson.toJson(request.getParameterMap()));	
		out.flush();
		out.close();
	}

}
