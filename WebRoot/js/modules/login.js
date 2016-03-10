
var currCard;
var animating = false;
var sending = false;

$(document).ready(function(e) {
	
	currCard = $("#LoginCard");
    $("#RegisterCard").hide();
    $("#NewPasswordCard").hide();
	
	SelectModuleFromUrl();
	if(window.history && window.history.pushState){
		$(window).on("popstate", function(){
			SelectModuleFromUrl();
		});
	}
	
	$("#input_cellphone_login").bind('input propertychange', function() {
        var cellphone = $("#input_cellphone_login").val();
		if(cellphone.length===11){
			PLServerAPI.getUidByCellphone(cellphone, {
				onSuccess: function(uid){
					$("#input_cellphone_login").removeClass("invalid");
					$("#avatar").attr("src","http://115.28.135.76/images/users/avatars/"+uid+".png");
				},
				onFailure: function(apiError){
					$("#avatar").attr("src","images/avater/a2.png");
					$("#input_cellphone_login").removeClass("valid");
					$("#input_cellphone_login").addClass("invalid");
					$("#input_cellphone_login").parent().children("label").attr("data-error",apiError.getErrorMessage());
				}
			});
		}else{
			$("#input_cellphone_login").removeClass("invalid");
			$("#input_cellphone_login").addClass("valid");
			$("#avatar").attr("src","images/avater/a2.png");
		}
	});
	
	$("#input_cellphone_register").bind('input propertychange', function() {
        var cellphone = $("#input_cellphone_register").val();
		if(cellphone.length===11){
			PLServerAPI.verifyCellphoneUnused(cellphone, {
				onSuccess: function(uid){
					$("#input_cellphone_register").removeClass("invalid");
					$("#input_cellphone_register").addClass("valid");
					$("#input_cellphone_register").parent().children("label").attr("data-success","手机号可以使用");
				},
				onFailure: function(apiError){
					$("#input_cellphone_register").removeClass("valid");
					$("#input_cellphone_register").addClass("invalid");
					$("#input_cellphone_register").parent().children("label").attr("data-error",apiError.getErrorMessage());
				}
			});
		}else{
			$("#input_cellphone_register").removeClass("valid");
			$("#input_cellphone_register").removeClass("invalid");
		}
	});
	
	$("#input_cellphone_login,#input_cellphone_register,#input_cellphone_forgetpassword").focusout(function(e) {
        var cellphone = $(this).val();
		if(cellphone.length!==11){
			$(this).removeClass("valid");
			$(this).addClass("invalid");
			$(this).parent().children("label").attr("data-error",'手机号码格式不正确！');
		}else{
			$(this).addClass("valid");
		}
    }).focusin(function(e) {
			$(this).removeClass("valid");
			$(this).removeClass("invalid");
	});
	
	$("#input_password_login,#input_password_register,#input_password_forgetpassword").focusout(function(e) {
        var password = $(this).val();
		if(password.length<6||password.length>20){
			$(this).removeClass("valid");
			$(this).addClass("invalid");
			$(this).parent().children("label").attr("data-error",'密码长度应在6到20位之间！');
		}else{
			$(this).addClass("valid");
		}
    }).focusin(function(e) {
			$(this).removeClass("valid");
			$(this).removeClass("invalid");
	});
	
	$("#input_repassword_register").focusout(function(e) {
        var password = $("#input_password_register").val();
        var repassword = $(this).val();
		if(password!=repassword){
			$(this).removeClass("valid");
			$(this).addClass("invalid");
			$(this).parent().children("label").attr("data-error",'两次输入的密码不一致！');
			return;
		}else{
			$(this).addClass("valid");
		}
    }).focusin(function(e) {
			$(this).removeClass("valid");
			$(this).removeClass("invalid");
	});


	$("#btnLogin").click(function(e) {
		if(sending){
			return;
		}
        var cellphone = $("#input_cellphone_login").val();
        var password = $("#input_password_login").val();
		if(cellphone.length!==11){
			$("#input_cellphone_login").removeClass("valid");
			$("#input_cellphone_login").addClass("invalid");
			$("#input_cellphone_login").parent().children("label").attr("data-error",'手机号码格式不正确！');
			return;
		}else if(password.length<6||password.length>20){
			$("#input_password_login").removeClass("valid");
			$("#input_password_login").addClass("invalid");
			$("#input_password_login").parent().children("label").attr("data-error",'密码长度应在6到20位之间！');
			return;
		}
		sending = true;
		PLServerAPI.login(cellphone, password, {
			onSuccess: function(user){
				sending = false;
				$.cookie("uid",user.uid);
				$.cookie("nickname",user.nickname);
				window.location.href = "index.html";
			},
			onFailure: function(apiError){
				sending = false;
				Materialize.toast(apiError.getErrorMessage(), 4000);
			}
		});
    });

	$("#btnRegister").click(function(e) {
		if(sending){
			return;
		}
        var cellphone = $("#input_cellphone_register").val();
        var password = $("#input_password_register").val();
        var repassword = $("#input_repassword_register").val();
        var captcha = $("#input_captcha_register").val();
		if(cellphone.length!==11){
			$("#input_cellphone_register").removeClass("valid");
			$("#input_cellphone_register").addClass("invalid");
			$("#input_cellphone_register").parent().children("label").attr("data-error",'手机号码格式不正确！');
			return;
		}else if(password.length<6||password.length>20){
			$("#input_password_register").removeClass("valid");
			$("#input_password_register").addClass("invalid");
			$("#input_password_register").parent().children("label").attr("data-error",'密码长度应在6到20位之间！');
			return;
		}else if(password!=repassword){
			$("#input_repassword_register").removeClass("valid");
			$("#input_repassword_register").addClass("invalid");
			$("#input_repassword_register").parent().children("label").attr("data-error",'两次输入的密码不一致！');
			return;
		}
		sending = true;
		PLServerAPI.register(cellphone, password, captcha, {
			onSuccess: function(){
				sending = false;
				Materialize.toast('注册成功！', 4000);
				SelectModule("Login");
			},
			onFailure: function(apiError){
				sending = false;
				Materialize.toast(apiError.getErrorMessage(), 4000);
			}
		});
    });

	$("#btnForgetPassword").click(function(e) {
		if(sending){
			return;
		}
        var cellphone = $("#input_cellphone_forgetpassword").val();
        var password = $("#input_password_forgetpassword").val();
        var captcha = $("#input_captcha_register").val();
		if(cellphone.length!==11){
			$("#input_cellphone_forgetpassword").removeClass("valid");
			$("#input_cellphone_forgetpassword").addClass("invalid");
			$("#input_cellphone_forgetpassword").parent().children("label").attr("data-error",'手机号码格式不正确！');
			return;
		}else if(password.length<6||password.length>20){
			$("#input_password_forgetpassword").removeClass("valid");
			$("#input_password_forgetpassword").addClass("invalid");
			$("#input_password_forgetpassword").parent().children("label").attr("data-error",'密码长度应在6到20位之间！');
			return;
		}else if(captcha.length===0){
			Materialize.toast('请输入验证码！', 4000)
			return;
		}
		sending = true;
		PLServerAPI.resetPassword(cellphone, password, captcha, {
			onSuccess: function(){
				sending = false;
				Materialize.toast('密码修改成功！', 4000)
				SelectModule("Login");
			},
			onFailure: function(apiError){
				sending = false;
				Materialize.toast(apiError.getErrorMessage(), 4000);
			}
		});
    });
	$("#btnSendCaptcha1,#btnSendCaptcha2").click(function(e) {
		if($(this).hasClass("disabled")){
			return;
		}
        $(this).html("已发送(60)");
		$(this).attr("disabled","true");
		$(this).addClass("disabled");
		currBtn = $(this);
		setTimeout("textCountDown(59)",1000);
    });
	
	
});

	
	var currBtn;
	
	function textCountDown(sec){
		$(currBtn).html("已发送("+sec+")");
		if((sec-1)===0){
			$(currBtn).html("发送验证码");
			$(currBtn).removeAttr("disabled");
			$(currBtn).removeClass("disabled");
		}else{
			setTimeout("textCountDown("+(sec-1)+")",1000);
		}
	}


function SelectModuleFromUrl(){
	var names = window.location.href.split("#");
	SelectModule(names[1]);
}

function SelectModule(name){
		if(animating)return;
		animating = true;
		$(".nav-wrapper ul li").removeClass("active");
	if(name=="Login"){
		$(".nav-wrapper ul:eq(0) li:eq(0)").addClass("active");
		$(".nav-wrapper ul:eq(1) li:eq(0)").addClass("active");
		$(currCard).fadeOut(200,function(){
			$("#LoginCard").fadeIn(200, function(){animating = false;});
			currCard = $("#LoginCard");
		});
	}else if(name=="Register"){
		$(".nav-wrapper ul:eq(0) li:eq(1)").addClass("active");
		$(".nav-wrapper ul:eq(1) li:eq(1)").addClass("active");
		$(currCard).fadeOut(200,function(){
			$("#RegisterCard").fadeIn(200, function(){animating = false;});
			currCard = $("#RegisterCard");
		});
	}else if(name=="ForgetPassword"){
		$(".nav-wrapper ul:eq(0) li:eq(2)").addClass("active");
		$(".nav-wrapper ul:eq(1) li:eq(2)").addClass("active");
		$(currCard).fadeOut(200,function(){
			$("#NewPasswordCard").fadeIn(200, function(){animating = false;});
			currCard = $("#NewPasswordCard");
		});
	}else{
		$(".nav-wrapper ul:eq(0) li:eq(0)").addClass("active");
		$(".nav-wrapper ul:eq(1) li:eq(0)").addClass("active");
		$(currCard).fadeOut(200,function(){
			$("#LoginCard").fadeIn(200, function(){animating = false;});
			currCard = $("#LoginCard");
		});
	}
}