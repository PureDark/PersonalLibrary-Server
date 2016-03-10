$(document).ready(function(){
	$('.parallax img').attr("src","images/background/background2.jpg");
	
	$( "#sortable" ).sortable({ 
		update: function(event, ui) {
			var orders = [];
			$("#sortable li").each(function(i, element) {
				var bid = $(element).attr("bid");
				var order = {bid: bid, order: i};
                orders[i] = order;
            });
			PLServerAPI.reorderBooks(orders, {
				onSuccess: function(){
				},
				onFailure: function(apiError){
					Materialize.toast(apiError.getErrorMessage(), 4000);
				}
			});
		} 
	}); 
    $( "#sortable" ).disableSelection();
	
	$(document).undelegate(".BookCard", "click");
	$(document).delegate(".BookCard", "click", function(e){
		$("#bookDetailModal").openModal();
		var bid = $(this).parent("li").attr("bid");
		var isbn13 = $(this).parent("li").attr("isbn");
		window.BookDetailPage.getBook(bid,isbn13);
	});
	
	
	PLServerAPI.getBookList(null, null, null, {
		onSuccess: function(books){
			$("#sortable").empty();
			var len = books.length;
			if(len!=0){
				$(".noResult").css("display","none");
			}else{
				$(".noResult").css("display","block");
			}
			$.each(books, function(i,book){
				$("#sortable").append(
					
					   '<li bid="'+book.bid+'" isbn="'+book.isbn13+'" class="col s12 m6 l4">'+
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

