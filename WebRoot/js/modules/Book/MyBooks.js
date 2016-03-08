$(document).ready(function(){
	$('.parallax img').attr("src","images/background2.jpg");
	
	$( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
	
	$(document).undelegate(".BookCard", "click");
	$(document).delegate(".BookCard", "click", function(e){
		$("#bookDetailModal").openModal();
		var id = $(this).parent("li").attr("id");
		 window.BookDetailPage.getBook(id);
	});
	
	
	PLServerAPI.getBookList(0, null, null, {
		onSuccess: function(books){
			$("#sortable").empty();
			$.each(books, function(i,book){
				$("#sortable").append(
					
					   '<li id="book1" class="col s12 m6 l4">'+
		                  '<div class="card white darken-1 BookCard hoverable" >'+
		                    '<div class="BookCover">'+
		                      '<img src="'+book.cover+'" style="width: 150px; height: 222px">'+
		                    '</div>'+
		                    '<div class="BookDetail">'+  
		                        '<div class="card-content black-text" style="height: 100%">'+
		                           ' <div>'+
		                             ' <span class="card-title truncate" style="line-height:1">'+book.title+'</span>'+
		                              '<h6 class="right-align grey-text text-darken-1 truncate">'+book.author+'</h6>'+
		                           ' </div>'+
		                           '<hr size="1"> '+ 
		                            '<p class="BookDesc">'+book.summary+'</p>'+
		                        '</div>'+
		                    '</div>'+
		                  '</div>'+
	                   '</li>'     
				)
			})
		},
		onFailure: function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
	});
		
	
	
	
});

