package com.hlwzd.personallibrary.modules;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.JsonObject;
import com.hlwzd.personallibrary.DBHelper;
import com.hlwzd.personallibrary.Manager.Module;
import com.hlwzd.personallibrary.Manager.User;

public class DebugModule extends Module {

	public DebugModule(DBHelper db, User user) {
		super(db, user);
	}

	@Override
	public JsonObject action(HttpServletRequest request) {
		String action = request.getParameter("action");
		if(action==null)return Error(1001);
		try {
			if(action.equals("printPrams")){
				return Data(request.getParameterMap());
			}
			else
				return Error(1006);
			
		} catch (Exception e) {
			e.printStackTrace();
			return Error(1000);
		}
	}
}
