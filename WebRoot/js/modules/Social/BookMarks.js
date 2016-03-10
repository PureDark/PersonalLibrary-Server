$(document).ready(function(){
	
	$('.parallax img').attr("src","images/background/background5.jpg");
	
	$(document).undelegate(".BookCard", "click");
	$(document).delegate(".BookCard", "click", function(){
		$("#bookDetailModal").openModal();
		var bid = $(this).parent("li").attr("bid");
		var mid = $(this).parent("li").attr("mid");
		var isbn = $(this).parent("li").attr("isbn");
		 window.BookDetailPage.getBook(bid,isbn);
		 window.BookDetailPage.getMarkDetail(mid,false);
	});
	
	
	PLServerAPI.getRecentBookMarks(null,1, {
		onSuccess: function(bookMarks){
			$("#BookMarkContainer").empty();
			var len = bookMarks.length;
			if(len!=0){
				$(".noResult").css("display","none");
			}else{
				$(".noResult").css("display","block");
			}
			$.each(bookMarks, function(i,bookMark){
				var avatar = "http://115.28.135.76/images/users/avatars/"+bookMark.uid+".png";
				var time = bookMark.time.split(" ");
				time[1] = time[1].split(":");
				
				$("#BookMarkContainer").append(
					'<li bid="'+bookMark.bid+'" mid="'+bookMark.mid+'" isbn="'+bookMark.isbn13+'" class="row">'+
				                '<time class="cbp_tmtime col m3 l3 hide-on-small-only"  datetime="'+time[0]+'">'+
				                	'<span>'+time[0]+'</span>'+
									'<span>'+time[1][0]+":"+time[1][1]+'</span>'+
								'</time>'+
				            
							   	'<div class="cbp_tmicon cbp_tmicon-phone hide-on-med-and-down"></div>'+
						              
				                '<div class="col s12 m9 l9 offset-l3 BookCard">'+ 	              
					              '<div class="card white darken-1 hoverable" >'+
					                '<div class="BookCover right">'+
					                  '<img src="'+bookMark.book_cover+'" class="BookCover">'+
					                '</div>'+
					                '<div class="BookDetail">'+  
					                    '<div class="card-content black-text" style="height: 100%">'+
						                    '<div style="overflow: auto;">'+
					                         ' <div class="chips left">'+
											  		'<img src="'+avatar+'" alt="Contact Person">'+
											  		bookMark.nickname+
											  '</div>'+
					                          '<h6 class="right grey-text text-darken-1 BookTitle">'+bookMark.title+'</h6>'+
						                    '</div>'+
						                    '<hr size="1"> '+ 
					                       ' <p class="BookDesc">'+bookMark.summary+'</p>'+
					                    '</div>'+
					                '</div>'+
					              '</div>'+
				               '</div> '+
				    '</li> '           
				                  

				);
			});
		},
		onFailure: function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000)
		}
	});
});