$(document).ready(function(){
	
	$('.parallax img').attr("src","images/background5.jpg");
	
	$(document).undelegate(".BookCard", "click");
	$(document).delegate(".BookCard", "click", function(e){
		$("#bookDetailModal").openModal();
		var id = $(this).parent("li").attr("id");
		 window.BookDetailPage.getBook(id);
	});
	
	
	PLServerAPI.getRecentBookMarks(0, {
		onSuccess: function(bookMarks){
			$("#BookMarkContainer").empty();
			
			$.each(bookMarks, function(i,bookMark){
				var avatar = "images/users/avatars/"+bookMark.uid+".png";
				var time = bookMark.time.split(" ");
				
				
				$("#BookMarkContainer").append(
					'<li id="book1" class="row">'+
				                '<time class="cbp_tmtime col m3 l3 hide-on-small-only"  datetime="'+time[0]+'">'+
				                	'<span>'+time[0]+'</span>'+
									'<span>'+time[1]+'</span>'+
								'</time>'+
				            
							   	'<div class="cbp_tmicon cbp_tmicon-phone hide-on-med-and-down"></div>'+
						              
				                '<div class="col s12 m9 l9 offset-l3">'+ 	              
					              '<div class="card white darken-1 hoverable BookCard " >'+
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
					                          '<h6 class="right grey-text text-darken-1 BookTitle">'+bookMark.book_title+'</h6>'+
						                    '</div>'+
						                    '<hr size="1"> '+ 
					                       ' <p class="BookDesc">'+bookMark_summary+'</p>'+
					                    '</div>'+
					                '</div>'+
					              '</div>'+
				               '</div> '+
				    '</li> '           
				                  

				)
			})
		},
	})
});