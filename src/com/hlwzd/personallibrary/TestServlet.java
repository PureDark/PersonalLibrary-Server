package com.hlwzd.personallibrary;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * 接收HTTP请求的Servlet
 * @Author       梁雨聪 (PureDark)
 * @CreateDate   2015-07-10 
 * @Version      v1.1
 */

@MultipartConfig()
public class TestServlet extends HttpServlet {

	public TestServlet() {
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
		response.setContentType("text/plain");
		PrintWriter out = response.getWriter();
		String output = "";
	    Enumeration e =request.getHeaderNames(); 
	    while(e.hasMoreElements()){
	        String name=(String)e.nextElement();
	        String value=request.getHeader(name);
	        output += name+"="+value+"\n";
	    }
	    out.println("content-length="+request.getContentLength()+"\n");
	    
	    e = request.getParameterNames();
	    while(e.hasMoreElements()){       
	        String name=(String)e.nextElement();
	        String value = (String) request.getParameter(name);
	        output += name+"="+value+"\n";
	    }

		String contentType = request.getContentType();
		output += "ContentType="+contentType+"\n";
		if(contentType!=null&&contentType.contains("multipart/form-data")){
			Collection<Part> parts = request.getParts();
			for(Part part:parts){
				Collection<String> names = part.getHeaderNames();
				for(String name:names)
					output += name+"="+part.getHeader(name)+"\n";
			}
		}
		System.out.print(output);
		out.print(output);
		out.flush();
		out.close();
	}

}
