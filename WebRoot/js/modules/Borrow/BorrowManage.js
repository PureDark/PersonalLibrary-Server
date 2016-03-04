$(document).ready(function(e) {
		
	$('.parallax img').attr("src","images/background1.jpg");
		
	$("#BorrowIn .collapsible-header").click(function(){
		$("#TabBorrowIn").children("a").click();
	});
	
	$("#BorrowOut .collapsible-header").click(function(){
		$("#TabBorrowOut").children("a").click();
	});
	
	
});