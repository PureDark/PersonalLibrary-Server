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


PLServerAPI.getUserInfo({
	OnSuccess: function(userInfo){
		Info = userInfo;
		$("#FriendInfo").append(
		'<img src="http://115.28.135.76/images/users/avatars/'+userInfo.uid+'.png" alt="" class="circle" style="height:130px; margin-top:18px" data-adaptive-background="1">'+
		'<ul style="margin-left: 40px ">'+
			'<li class="flow-text" style="width: 150px">'+
				'<h5 class="truncate" style="margin-left:10px ; margin-top:30px">'+userInfo.nickname+'</h5>'+
			'</li>'+
			'<li class="chip booktab" style="margin-top: 15px"><span class="truncate" style="width: 300px">'+userInfo.signature+'</span>'	+
			'</li>'+
		'</ul>'
		);
	},
	onFailure: function(apiError){
		var ErrorCode = apiError.getErrorCode();
		var ErrorMessage = apiError.getErrorMessage();
		alert(ErrorCode+":"+ErrorMessage);
	}
});
/*PLServerAPI.getBookList(Info.uid,null,null,{
	OnSuccess :function(books){
		$.each(books, function(i,book){
			$("#FriendBooks").append(
				'<li class="card hoverable BookCover BookShow">'+
                    '<img src='+book.cover+' class="BookCover">'+
                '</li>'
			);
		})
	},
	onFailure:function(apiError){
		
	}
});*/
