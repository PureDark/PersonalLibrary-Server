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
	//$.adaptiveBackground.run({ parent: "1" });


	
  });

})(window, document, jQuery);


	function getBook(bid,isbn13){ 
		   PLServerAPI.getBookDetails(isbn13,{
			   onSuccess: function(book){
				   $(".inner img").attr("src",book.image);
				   $(".inner div h5").html(book.title);
				   $(".inner div ul li:eq(0)").html("作者："+book.author);
				   $(".inner div ul li:eq(1)").html("出版年:"+book.pubdate);
	               $(".inner div ul li:eq(2)").html("出版社:"+book.publisher);
	               $(".inner div ul li:eq(3)").html("页数:"+book.pages);
	               $(".inner div ul li:eq(4)").html("定价:"+book.price);
	               var summary = book.summary.replace(/\n/g, "<br />");
	               $(".bookDescContainer blockquote:eq(1)").html(summary);
					// Run the A.B. plugin.
					$.adaptiveBackground.run();
			   },
			   onFailure: function(apiError){
					Materialize.toast(apiError.getErrorMessage(), 4000);
			   }
		   })
	}
