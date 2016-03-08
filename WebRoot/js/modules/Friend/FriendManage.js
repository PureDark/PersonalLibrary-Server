var currPage = 1;
$(document).ready(function(){
	$('.parallax img').attr("src","images/background10.jpg");
    $('.modal-trigger').leanModal();
	
    $('#requestWrapper').pushpin({ top: $('#MyFriendsCard').offset().top });
    $('ul.tabs').tabs();
	
	$(document).undelegate(".GetIn", "click");
	$(document).delegate(".GetIn", "click", function(e){
		$("#FriendDetailModal").openModal();
	});
	
	getFriendList(1);

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
							  '<li class="collection-item avatar">'+
								  '<img src="http://115.28.135.76/images/users/avatars/'+friend.uid+'.png" alt="" class="circle">'+
								  '<span class="title">'+friend.nickname+'</span>'+
								  '<p class="Blog">'+friend.signature+
								  '</p>'+
								  '<a class="secondary-content waves-effect waves-light btn GetIn">进入TA的主页</a>'+
							   ' </li>'	);		
				});
			},
			onFailure: function(apiError){
			var ErrorCode = apiError.getErrorCode();
			var ErrorMessage = apiError.getErrorMessage();
			alert(ErrorCode+":"+ErrorMessage);
			}
	});
}



