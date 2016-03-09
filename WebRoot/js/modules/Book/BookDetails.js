var bookid;
;(function(window, document, $){

  var WriteMarkOrNot = false;
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
  		
               
        $("#modifyMark").click(function(){
	        
	        if(WriteMarkOrNot==false) {
		        $(".bookMarkContainer:eq(1)").css("display","none") ;
				$(".bookMarkContainer:eq(0)").css("display","block");
				$("#modifyMark .material-icons").html("done");
				$("#modifyMark").removeClass("red");
				$("#modifyMark").addClass("green");
				$(".valign-wrapper .writemark").html("提交");
				//Materialize.toast("提交", 4000);
				WriteMarkOrNot=true;
	        }else if(WriteMarkOrNot==true) {
	            $(".bookMarkContainer:eq(0)").css("display","none") ;
				$(".bookMarkContainer:eq(1)").css("display","block");
				$("#modifyMark .material-icons").html("mode_edit");
				$("#modifyMark").removeClass("green");
				$("#modifyMark").addClass("red");
				$(".valign-wrapper .writemark").html("写书评");
				WriteMarkOrNot=false;
            }
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
		   });
		   bookid = bid;
		   getMarkList(bid);
		   
	};
	function getMarkList(bid){
		 PLServerAPI.getBookMarkList(bid,0,{
			 onSuccess: function(bookMarks){
				 $(".bookMarkContainer:eq(1)").empty();
				 $.each(bookMarks, function(i,bookMark){
					 var avatar = "images/users/avatars/"+bookMark.uid+".png";
					 $(".bookMarkContainer:eq(1)").append(
						 '<div class="card white darken-1 hoverable BookCard">'+
			                '<div class="BookDetail">'+ 
			                    '<div class="card-content black-text" style="height: 100%">'+
			                        '<div style="overflow: auto;">'+
			                         ' <div class="chips right">'+
			                                '<img src="'+avatar+'" alt="Contact Person">'+
			                                bookMark.nickname+
			                          '</div>'+
			                          '<h6 style="margin-top: 20px">'+bookMark.time+'</h6>'+
			                        '</div>'+
			                        '<hr size="1">'+  
			                        '<p class="BookDesc">'+bookMark.summary+'</p>'+
			                    '</div>'+
			                '</div>'+
			            '</div>'
					 )
				 })
			 },
			 onFailure: function(apiError){
				 Materialize.toast(apiError.getErrorMessage(), 4000);

			 }
			 
		 });

	};
