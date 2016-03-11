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
	
	
	getBookList();
	
});

function getBookDetail(bid, isbn13){
		$("#bookDetailModal").openModal();
		window.BookDetailPage.getBook(bid,isbn13);
		window.BookDetailPage.getMarkList(bid);
}

function getBookList(){
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
		                  '<div class="card white darken-1 BookCard hoverable" onClick="getBookDetail('+book.bid+',\''+book.isbn13+'\');">'+
		                    '<div class="BookCover">'+
		                      '<img src="'+book.cover+'" style="width: 150px; height: 222px">'+
		                    '</div>'+
		                    '<div class="BookDetail">'+  
		                        '<div class="card-content black-text" style="height: 100%">'+
		                           ' <div>'+
		                             ' <span class="card-title truncate" style="line-height:1">'+book.title+'</span>'+
		                              '<h6 class="right-align grey-text text-darken-1 truncate">'+book.author+'</h6>'+
									  '<i class="material-icons grey-text" style="position: absolute;top: 6px;right: 6px;font-size: 1.5em;" onClick="deleteBook('+book.bid+');">clear</i>'+
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
}

function deleteBook(bid){
	PLServerAPI.deleteBook(bid, {
		onSuccess: function(){
			$("#sortable li").each(function(index, element) {
                var thisbid = $(element).attr("bid");
				if(bid == thisbid){
					$(element).remove();
				}
            });
		},
		onFailure: function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
	});
	stopPropagation();
}

function stopPropagation(e){
	e = e || window.event;
	if(e.stopPropagation){
		e.stopPropagation();
	}else{
		e.cancelBubble = true;
	}
}

