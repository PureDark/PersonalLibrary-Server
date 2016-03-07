$(document).ready(function() {
	$('.parallax').parallax();
	
	/*$.post("servlet/manager",
		{
			module: "user",
			action: "checkIfLogedIn"
		}, 
		function(result){
			SelectModileFromUrl();
		},
		"json"
	);*/
	
	SelectModileFromUrl();
	
	if(window.history && window.history.pushState){
		$(window).on("popstate", function(){
			SelectModileFromUrl();
		});
	}
	
	
});

function SelectModileFromUrl(){
	var names = window.location.href.split("#");
	SelectModule(names[1]);
}

function SelectModule(name){
		$(".nav-wrapper ul li").removeClass("active");
	if(name=="Book"){
		$(".nav-wrapper ul li:eq(0)").addClass("active");
		LoadPage("Book/MyBooks.html");
	}else if(name=="Borrow"){
		$(".nav-wrapper ul li:eq(1)").addClass("active");
		LoadPage("Borrow/BorrowManage.html");
	}else if(name=="Friend"){
		$(".nav-wrapper ul li:eq(2)").addClass("active");
		LoadPage("Friend/FriendManage.html");
	}else if(name=="Social"){
		$(".nav-wrapper ul li:eq(3)").addClass("active");
		LoadPage("Social/BookMarks.html");
	}else{
		$(".nav-wrapper ul li:eq(0)").addClass("active");
		LoadPage("Book/MyBooks.html");
	}
}

function LoadPage(path){
	$("#PageContainer").load("modules/"+path);
}

function API_Login(username, password, onSuccess, onFailure){
	$.ajax({
		 type: "POST",
		 url: "./servlet/manager",
		 data: {
				module: "user",
				action: "login",
				username: username,
				password: password
				},
		 dataType: "json",
		 success: function(result){
			 if(result['status']){
				 onSuccess(result.data);
			 }else{
				 onFailure(getAPIError(result.errorCode));
			 }
		},
		error:function(xhr){
			 onFailure(getAPIError(1009));
		}
	});
}

function getAPIError(errorCode){
		 var errorString;
		 switch(errorCode){
                case 1000:errorString="未知错误";break;
                case 1001:errorString="参数不全";break;
                case 1002:errorString="尚未登录";break;
                case 1003:errorString="模块不存在";break;
                case 1004:errorString="没有权限";break;
                case 1005:errorString="json解析错误";break;
                case 1006:errorString="无此接口";break;
                case 1009:errorString="网络错误，请重试";break;
                case 1010:errorString="数据库错误";break;
                case 1011:errorString="密码错误";break;
                case 1012:errorString="用户不存在";break;
                case 1021:errorString="用户无此书";break;
                case 1022:errorString="书籍不存在";break;
                case 1023:errorString="Tag不存在";break;
                case 1032:errorString="手机号已被使用";break;
                case 1051:errorString="书评不属于该用户";break;
                case 1061:errorString="对方不拥有该书籍";break;
                case 1062:errorString="书籍已借出";break;
                case 1063:errorString="已经发送过借该书的请求";break;
                case 1064:errorString="无效的借书请求";break;
                default:errorString="未定义的错误码";break;
            }
		 return {"errorCode" : errorCode, "errorString" : errorString};
}