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
	//$.adaptiveBackground.run();
  })

})(window, document, jQuery)

function getUserInfo(uid,nickname,signature){
	$("#FriendBooks").empty();
	$("#bookMarksList").empty();
	getBack();
	$("#FriendInfo img").attr("src", "http://115.28.135.76/images/users/avatars/"+uid+".png");
	$.adaptiveBackground.run();
	if(nickname == undefined)nickname = "该用户暂未设置昵称";
	$("#FriendInfo h5").html(nickname);
	if(signature == undefined)signature = "该用户暂未设置签名";
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
			var len = bookMarks.length;
			if(len!=0){
				
				$("#pageNoResult").css("display","none");
				$("#bookMarksList").css("display","block");
			}else{
				
				$("#bookMarksList").css("display","none");
				$("#pageNoResult").css("display","block");
			}
			$.each(bookMarks,function(i,bookMark){
				var summary = bookMark.summary.replace(/\n/g, "<br />");
				$("#bookMarksList").append(
				'<div class="card white darken-1 hoverable BookCard" onClick="getMarkDetail('+bookMark.mid+');">'+
					'<div class="BookDetail">'  +
						'<img src='+bookMark.book_cover+' class="BookCover" style="float:right" />'+
						'<div class="card-content black-text" style="margin-right:145px">'+
							'<div style="overflow: auto;">'+
								'<h6 style="margin-top:0px">'+bookMark.title+'</h6>'+
			                    '<h6>'+bookMark.time+'</h6>'+
							'</div>'+
							'<hr size="1">  '+
							'<p class="BookDesc">'+summary+'...</p>'+
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

function getMarkDetail(mid){
	PLServerAPI.getBookMarkDetails(mid,{
		onSuccess:function(bookMark){
			$("#bookMark #markTitle").html(bookMark.title);
			var content = "<p>"+bookMark.content.replace(/\n/g, "</p><p>")+"</p>";
			$("#bookMark #markContent").html(content);
			$("#bookMark").css("display", "");
			$("#bookMarksList").css("display", "none");
		},
		onFailure:function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000);
		}
	});
}

function getBack(){
	$("#bookMark").css("display", "none");
	$("#bookMarksList").css("display", "");
	
}