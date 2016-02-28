$(document).ready(function(e) {
    
	$("#submit").click(function(e) {
        var oldpass = $("#oldpass").val();
        var newpass = $("#newpass").val();
        var renewpass = $("#renewpass").val();
		if(oldpass==""||newpass==""||renewpass=="")
			$("#alert-error").html("密码不能为空！").slideDown();
		else if(newpass!=renewpass)
			$("#alert-error").html("两次输入的密码不一致 ！").slideDown();
		else
			$.ajax({
				 type: "POST",
				 url: "../../servlet/manager",
				 data: {
						module: "system",
						action: "changePassword",
						oldpass: oldpass,
						newpass: newpass
						},
				 dataType: "json",
				 success: function(result){
					 if(result['status']){
						 $("#alert-success").slideDown();
					 }else{
						 var errorMessage;
						 switch(result.errorCode){
							 case 1001: errorMessage="参数不全！";break;
							 case 1011: errorMessage="密码错误！";break;
							 case 1012: errorMessage="用户不存在！";break;
						 }
						 $("#alert-error").html(errorMessage).slideDown();
					 }
				},
				error:function(xhr){ alert("网络错误，请重试！");}
			});
    });
	$("input").focus(function(e) {
			$("#alert-success").slideUp();
			$("#alert-error").slideUp();
    });
	$("#renewpass").blur(function(e) {
        var newpass = $("#newpass").val();
        var renewpass = $("#renewpass").val();
		if(newpass!=renewpass)
			$("#alert-error").html("两次输入的密码不一致 ！").slideDown();
    });;
	$(".panel-body").keyup(function(e){
		var e = e || event,
		keycode = e.which || e.keyCode;
		if (keycode==13) 
			$("#submit").click();
	});
});