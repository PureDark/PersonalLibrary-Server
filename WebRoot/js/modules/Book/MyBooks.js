$(document).ready(function(){
	$('.parallax img').attr("src","images/background2.jpg");
	
	$( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
	
	
	$(document).delegate(".BookCard", "click", function(e){
		$("#bookDetailModal").openModal();
		var id = $(this).parent("li").attr("id");
		 window.BookDetailPage.getBook(id);
	});
});
