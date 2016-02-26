<%@ page language="java" import="java.util.*,com.puredark.lessonlearning.Manager.User" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
User user = new User(request.getSession());
String username = user.getUsername();
String lastlogin = user.getLastLogin();
%>
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>延安干部培训学院课程管理后台</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
	<link class="bootstrap library" rel="stylesheet" type="text/css" href="../assets/css/bootstrap.min.css">
	<script class="bootstrap library" src="../assets/js/jquery-1.9.1.min.js" type="text/javascript"></script>
	<script class="bootstrap library" src="../assets/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="../assets/js/modules/index.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="../assets/css/modules/public.css">
  </head>
  <body>
  
  
    <div class="container-fluid">
    
    	<div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">欢迎使用</h3>
          </div>
          <div class="panel-body" style="font-family: '微软雅黑';">
            <h4><%=username%>，欢迎您使用延安干部培训学院课程管理后台</h4>
          	<h5>上一次登录时间：<%=(lastlogin==null)?"无":lastlogin%></h5>
          </div>
        </div>
        
    </div>
    
  <script type="text/javascript" src="../assets/js/bui-min.js"></script>
  <script type="text/javascript" src="../assets/js/config-min.js"></script>
  <script type="text/javascript">
    BUI.use('common/page');
  </script>
  </body>
</html>
