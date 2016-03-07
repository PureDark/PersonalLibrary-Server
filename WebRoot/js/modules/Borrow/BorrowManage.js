$(document).ready(function(e) {
		
	$('.parallax img').attr("src","images/background2.jpg");
		
	$("#BorrowIn .collapsible-header").click(function(){
		$("#TabBorrowIn").children("a").click();
	});
	
	$("#BorrowOut .collapsible-header").click(function(){
		$("#TabBorrowOut").children("a").click();
	});
	
	
});