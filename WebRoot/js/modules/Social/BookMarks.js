$(document).ready(function(){
	
	$('.parallax img').attr("src","images/background5.jpg");
	
	$(document).undelegate(".BookCard", "click");
	$(document).delegate(".BookCard", "click", function(e){
		$("#bookDetailModal").openModal();
		var id = $(this).parent("li").attr("id");
		 window.BookDetailPage.getBook(id);
	});
});