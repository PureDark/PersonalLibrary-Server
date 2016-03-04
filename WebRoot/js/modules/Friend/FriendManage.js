$(document).ready(function(){
	$('.parallax img').attr("src","images/background10.jpg");
    $('.modal-trigger').leanModal();
	
    $('#requestWrapper').pushpin({ top: $('#MyFriendsCard').offset().top });
    $('ul.tabs').tabs();
 });
 
 function accept(rid){
	 $(".tabs li:eq(1) a").click();
 }
