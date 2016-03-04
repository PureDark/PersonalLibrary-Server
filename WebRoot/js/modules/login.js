var registercard=$("#RegisterCard");
registercard.addClass("tempRegister");

var currCard = $("#LoginCard");
var animating = false;

$(document).ready(function(e) {
	
	
    $("#RegisterCard").hide();
    $("#NewPasswordCard").hide();
	
	
	
    $("#Register").click(function(){
		if(animating)return;
		animating =true;
		$(currCard).fadeOut(200,function(){
			$("#RegisterCard").fadeIn(200, function(){animating =false;});
			$("#Wrapper_Login").removeClass("active");
			$("#Wrapper_Register").addClass("active");
			currCard = $("#RegisterCard");
		});
		
	});
	$("#NewPassword").click(function(){
		if(animating)return;
		animating =true;
		$(currCard).fadeOut(200,function(){
			$("#NewPasswordCard").fadeIn(200, function(){animating =false;});
			$("#Wrapper_Login").removeClass("active");
			$("#Wrapper_NewPassword").addClass("active");
			currCard = $("#NewPasswordCard");
		});
		
	});
	$("#Wrapper_NewPassword").click(function(){
		if(animating)return;
		animating =true;
		$(currCard).fadeOut(200,function(){
			$("#NewPasswordCard").fadeIn(200, function(){animating =false;});
			$("#Wrapper_Login,#Wrapper_Register").removeClass("active");
			$("#Wrapper_NewPassword").addClass("active");
			currCard = $("#NewPasswordCard");
		});
		
	});
	$("#Wrapper_Login").click(function(){
		if(animating)return;
		animating =true;
		$(currCard).fadeOut(200,function(){
			$("#LoginCard").fadeIn(200, function(){animating =false;});
			$("#Wrapper_Register,#Wrapper_NewPassword").removeClass("active");
			$("#Wrapper_Login").addClass("active");
			currCard = $("#LoginCard");
		});
		
	});
	$("#Wrapper_Register").click(function(){
		if(animating)return;
		animating =true;
		$(currCard).fadeOut(200,function(){
			$("#RegisterCard").fadeIn(200, function(){animating =false;});
			$("#Wrapper_NewPassword,#Wrapper_Login").removeClass("active");
			$("#Wrapper_Register").addClass("active");
			currCard = $("#RegisterCard");
		});
		
	});
});