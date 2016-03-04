$(document).ready(function(){
	$('.parallax').parallax();	
	
	$(document).delegate(".BookCard", "click", function(e){
		$("#bookDetailModal").openModal();
		var id = $(this).parent("li").attr("id");
		 window.BookDetailPage.getBook(id);
	});
});