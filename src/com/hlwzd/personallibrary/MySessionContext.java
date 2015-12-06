package com.hlwzd.personallibrary;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpSession;

public class MySessionContext {
	private static MySessionContext instance;
	private HashMap<String, HttpSession> mymap;
	
	private MySessionContext(){
		mymap = new HashMap<String, HttpSession>();
	}
	
	public static MySessionContext getInstance(){
		if(instance==null)
			instance = new MySessionContext();
		return instance;
	}
	
	public synchronized void AddSession(HttpSession session){
		if(session!=null)
			mymap.put(session.getId(), session);
	}
	
	public synchronized void DelSession(HttpSession session){
		if(session!=null)
			mymap.remove(session.getId());
	}
	
	public synchronized HttpSession getSession(String session_id){
		if(session_id==null)return null;
		return (HttpSession)mymap.get(session_id);
	}
	
	public synchronized ArrayList<String> getSessions(){
		ArrayList<String> sessions = new ArrayList<String>();
		Iterator iter = mymap.entrySet().iterator();
		while (iter.hasNext()) {
			Map.Entry entry = (Map.Entry) iter.next();
			String key = (String) entry.getKey();
			sessions.add(key);
		}
		return sessions;
	}
}