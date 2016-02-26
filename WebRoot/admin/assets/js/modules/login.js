$(document).ready(function(e) {
    
	$("#submit").click(function(e) {
        var username = $("#username").val();
        var password = $("#password").val();
		$.ajax({
		     type: "POST",
		     url: "./servlet/manager",
			 data: {
				 	module: "admin",
					action: "login",
					username: username,
					password: password
				 	},
		     dataType: "json",
		     success: function(result){
				 //如果status是true则 登陆 成功，跳转到管理面板
				 if(result['status']){
					 $("#alert-success").slideDown();
					 setTimeout("window.location.href=\"./\"",1000); 
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 case 1011: errorMessage="密码错误！";break;
						 case 1012: errorMessage="用户不存在！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $("#alert-error").html(errorMessage).slideDown();
				 }
		    },
			error:function(xhr){ alert("注销失败，请重试！");}
		});
    });
	$("#username,#password").focus(function(e) {
			$("#alert-error").slideUp();
    }).change(function(e) {
			$("#alert-error").slideUp();
    });
	$(".panel-body").keyup(function(e){
		var e = e || event,
		keycode = e.which || e.keyCode;
		if (keycode==13) 
			$("#submit").click();
	});
});