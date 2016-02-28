$(document).ready(function(e) {
    $("#BorrowIn").click(function(){
		$("#TabBorrowIn").addClass("active");
		$("#TabBorrowOut").removeClass("active");
	});
	$("#BorrowOut").click(function(){
		$("#TabBorrowOut").addClass("active");
		$("#TabBorrowIn").removeClass("active");
	});
});