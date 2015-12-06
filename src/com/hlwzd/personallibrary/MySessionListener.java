package com.hlwzd.personallibrary;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * 类说明：Session监听器，用来根据指定的session id获取session
 */
public class MySessionListener implements HttpSessionListener {
	public static Map<String, HttpSession> userMap = new HashMap<String, HttpSession>();
	private MySessionContext msc= MySessionContext.getInstance();

	@Override
	public void sessionCreated(HttpSessionEvent event){
		System.out.println("sessionCreated: "+event.getSession().getId());
		msc.AddSession(event.getSession());
	}
	
	@Override
	public void sessionDestroyed(HttpSessionEvent event){
		System.out.println("sessionDestroyed: "+event.getSession().getId());
		msc.DelSession(event.getSession());
	}
}
