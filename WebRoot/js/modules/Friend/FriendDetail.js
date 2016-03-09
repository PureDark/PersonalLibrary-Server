var Info;
;(function(window, document, $){

  $(document).ready(function(){

	// Make some selections.
	var $window       = $(window);
	var $imgWrapper   = $('.image-wrapper');
	var $imgs         = $imgWrapper.find("img");

	$imgs.on('ab-color-found', function(e, data){
	  $(this).parents('.image-wrapper')
			 .attr('data-color', data.color);

	  $(this).css({ 
		border: "1px solid " + data.palette[0].replace(')', ",0.25)").replace('rgb', "rgba") 
	  });

	  $(this).parents('.image-wrapper')
			 .css({ background: data.color })
	});

	// Run the A.B. plugin.
	$.adaptiveBackground.run({ parent: "1" });
  })

})(window, document, jQuery)

function getUserInfo(uid,nickname,signature){
	$("#FriendBooks").empty();
	$("#bookMarksList").empty();
	$("#FriendInfo img").attr("src", "http://115.28.135.76/images/users/avatars/"+uid+".png");
	$("#FriendInfo h5").html(nickname);
	$("#FriendInfo span").html(signature);
	PLServerAPI.getBookList(uid,null,null,{
		onSuccess :function(books){
			$.each(books, function(i,book){
				$("#FriendBooks").append(
					'<li class="card hoverable BookCover BookShow">'+
						'<img src='+book.cover+' class="BookCover">'+
					'</li>'
				);
			});
		},
		onFailure:function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
	});
	PLServerAPI.getBookMarkList(null,uid,{
		onSuccess:function(bookMarks){
			$.each(bookMarks,function(i,bookMark){
				
				$("#bookMarksList").append(
				'<div class="card white darken-1 hoverable BookCard" >'+
					'<div class="BookDetail">'  +
						'<img src='+bookMark.book_cover+' class="BookCover" style="float:right">'+
						'<div class="card-content black-text" style="margin-right:145px">'+
							'<div style="overflow: auto;">'+
								'<h6 style="margin-top: 20px">'+bookMark.time+'</h6>'+
							'</div>'+
							'<hr size="1">  '+
							'<p class="BookDesc">'+bookMark.summary+'</p>'+
						'</div>'+
					'</div>'+
				'</div>'
				);
			});
		},
		onFailure:function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
});
	
}