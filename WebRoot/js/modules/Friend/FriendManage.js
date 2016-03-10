var currPage = 1;
$(document).ready(function(){
	$('.parallax img').attr("src","images/background10.jpg");
    $('.modal-trigger').leanModal();
	
    $('#requestWrapper').pushpin({ top: $('#MyFriendsCard').offset().top });
    $('ul.tabs').tabs();
	
	$(document).undelegate(".GetIn", "click");
	$(document).delegate(".GetIn", "click", function(e){
		$("#FriendDetailModal").openModal();
		var uid = $(this).parent("li").attr("uid");
		var nickname = $(this).parent("li").attr("nickname");
		var signature = $(this).parent("li").attr("signature");
		window.FriendDetailPage.getUserInfo(uid,nickname,signature);
	});
	
	getFriendList(1);
	getRequestList(1);
 });
 
 function accept(rid){
	 $(".tabs li:eq(1) a").click();
 }


function getFriendList(page){
	$(".pagination").empty();
	$("#FriendList").empty();
	if(page<=3){
		for(var i=1;i<6;i++){
			$(".pagination").append('<li class="waves-effect"><a onClick="getFriendList('+i+')">'+i+'</a></li>');
		}
		$(".pagination li:eq("+(page-1)+")").addClass("active");
	}else{
		for(var i=page-2;i<page+3;i++){
			$(".pagination").append('<li class="waves-effect"><a onClick="getFriendList('+i+')">'+i+'</a></li>');
		}
		$(".pagination li:eq(2)").addClass("active");
	}
	currPage = page;
	PLServerAPI.getFriendList(currPage,{
			onSuccess: function(friends){
				$.each(friends, function(i, friend){
						
						$("#FriendList").append(
							  '<li uid='+friend.uid+' nickname='+friend.nickname+' signature='+friend.signature+' class="collection-item avatar">'+
								  '<img src="http://115.28.135.76/images/users/avatars/'+friend.uid+'.png" alt="" class="circle">'+
								  '<span class="title">'+friend.nickname+'</span>'+
								  '<p class="Blog">'+friend.signature+
								  '</p>'+
								  '<a class="secondary-content waves-effect waves-light btn GetIn">进入TA的主页</a>'+
							   ' </li>'	);		
				});
			},
			onFailure: function(apiError){
				Materialize.toast(apiError.getErrorMessage(), 4000);
			}
	});
}

function getRequestList(page){
	PLServerAPI.getRequestList(page,{
		onSuccess:function(requests){
			var num = 0;
			$("#untreated").empty();
			$("#treated").empty();
			$.each(requests,function(i,request){
				if(request.nickname == "") request.nickname="该用户暂未设置昵称";
				
				if(request.status == 0){
					num++;
					$("#untreated").append(
					'<li class="collection-item avatar">'+
						 '<img src="http://115.28.135.76/images/users/avatars/'+request.uid+'.png" alt="" class="circle">'+
						 '<span class="title">'+request.nickname+'</span>'+
						 '<p class="RequestVerification">对方请求添加您为书友</p>'+
						 '<a onclick="accept(true,'+request.rid+');" class="secondary-content waves-effect waves-dark btn-flat Pinnedagree">同意</a>'+
						 '<a onclick="accept(false,'+request.rid+');" class="secondary-content waves-effect waves-dark btn-flat Pinnedreject">拒绝</a>'+
					'</li>'
					);
					
				}else if(request.status == 1){
					$("#treated").append(
					'<li class="collection-item avatar">'+
                         '<img src="http://115.28.135.76/images/users/avatars/'+request.uid+'.png" alt="" class="circle">'+
                         '<span class="title">'+request.nickname+'</span>'+
                         '<p class="RequestVerification">对方请求添加您为书友</p>'+
                         '<p class="secondary-content result">已同意</p>'+
                    '</li>'
					);
				}else{
					$("#treated").append(
					'<li class="collection-item avatar">'+
                         '<img src="http://115.28.135.76/images/users/avatars/'+request.uid+'.png" alt="" class="circle">'+
                         '<span class="title">'+request.nickname+'</span>'+
                         '<p class="RequestVerification">对方请求添加您为书友</p>'+
                         '<p class="secondary-content result">已拒绝</p>'+
                    '</li>'
					)
				}
			});
			if(num == 0){
					$("#untreated").append(
					'<li class="collection-item avatar">'+
						 '<p class="RequestVerification" style="margin-left: 65px;margin-top: 20px;">暂无新消息</p>'+
					'</li>'
					);
				}
		},
		onFailure:function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
	});
}

function accept(accept, rid){
	PLServerAPI.responseRequest(rid, accept, {
		onSuccess: function(){
			$("#untreated").empty();
			$("#treated").empty();
			getRequestList(1);
			getFriendList(1);
		},
		onFailure: function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
	});
};




