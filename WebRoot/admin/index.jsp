<%@ page language="java" import="java.util.*,com.puredark.lessonlearning.Manager.User" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
User user = new User(request.getSession());
if(!user.isAdmin())response.sendRedirect("login.html");
%>

<!DOCTYPE HTML>
<html>
 <head>
  <title>延安干部培训学院课程管理</title>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <meta name="renderer" content="webkit">
   <link href="assets/css/dpl-min.css" rel="stylesheet" type="text/css" />
  <link href="assets/css/bui-min.css" rel="stylesheet" type="text/css" />
   <link href="assets/css/main-min.css" rel="stylesheet" type="text/css" />
   <style>
   .dl-second-nav {
	  background-color: #E4EDF0;
	}
   </style>
 </head>
 <body>

  <div class="header">
    
      <div class="dl-title">
          <span class="dl-title-text">延安干部培训学院课程管理</span>
      </div>

    <div class="dl-log">欢迎您，<span class="dl-log-user"><%=user.getUsername()%></span><a href="###" title="退出系统" class="dl-log-quit" onClick="logout()">[退出]</a>
    </div>
  </div>
   <div class="content">
    <div class="dl-main-nav">
      <ul id="J_Nav"  class="nav-list ks-clear">
      </ul>
    </div>
    <ul id="J_NavContent" class="dl-tab-conten">

    </ul>
   </div>
  <script type="text/javascript" src="assets/js/jquery-1.8.1.min.js"></script>
  <script type="text/javascript" src="./assets/js/bui.js"></script>
  <script type="text/javascript" src="./assets/js/config.js"></script>

  <script>
    BUI.use('common/main',function(){
			$.getJSON("data/admin.json", function(config) {
				new PageUtil.MainPage({
					modulesConfig : config
				});
				$("li[data-id='exit']").click(function(e) {
					logout();
    			});
			});
    });
	function logout(){
			$.ajax({
				 type: "POST",
				 url: "./servlet/manager",
				 data: {
						module: "system",
						action: "logout"
						},
				 dataType: "json",
				 success: function(result){
					 //如果status是true则 退出 成功，跳转到登录界面
					 window.location.href="./";
				},
				error:function(xhr){ window.location.href="./";}
			});
	}
  </script>
 </body>
</html>
