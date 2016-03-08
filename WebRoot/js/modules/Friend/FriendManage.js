$(document).ready(function(){
	$('.parallax img').attr("src","images/background10.jpg");
    $('.modal-trigger').leanModal();
	
    $('#requestWrapper').pushpin({ top: $('#MyFriendsCard').offset().top });
    $('ul.tabs').tabs();
	

 });
 
 function accept(rid){
	 $(".tabs li:eq(1) a").click();
 }

PLServerAPI.searchUser($("#FriendName").val(), {
		onSuccess: function(friends){
			
		},
		onFailure: function(apiError){
		}
	});
	
PLServerAPI.getFriendList("1",{
		onSuccess: function(friends){
			'<li class="collection-item avatar">'+
                              '<img src="'+ +'" alt="" class="circle">'+
                              '<span class="title">Title</span>'+
                              '<p class="Blog">First Line '+
                                ' Second Line'+
                             ' </p>'+
                              '<a href="#!" class="secondary-content waves-effect waves-light btn">进入TA的主页</a>'+
                           ' </li>'
		},
		onFailure: function(apiError){
		}
});