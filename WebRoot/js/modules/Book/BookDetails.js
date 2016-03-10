var bookid = 0;
var WriteMark = false;
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
				 .css({ background: data.color });
			 
			 
  		});
               
	
		// Run the A.B. plugin.
		//$.adaptiveBackground.run();
		
		$("#modifyMark").click(function() {
			if(bookid>0){
				if($(this).hasClass("disabled")){return;}
				if(WriteMark==false) {
					$(".noResult").css("display","none");
					$(".bookMarkContainer:eq(0)").css("display","block");
					$(".bookMarkContainer:eq(1)").css("display","none") ;
					
					$("#modifyMark .material-icons").html("done");
					$("#modifyMark").removeClass("red");
					$("#modifyMark").addClass("green");
					$(".valign-wrapper .writemark").html("提交");
					$("#input_mark_title").val("");
					$("#input_mark_content").val("");
					WriteMark=true;
				}else if(WriteMark==true) {
					
					var markTitle = $("#input_mark_title").val();
					var markContent = $("#input_mark_content").val();
					
					if(markTitle.length<5||markTitle.length>40){
						$("#input_mark_title").removeClass("valid");
						$("#input_mark_title").addClass("invalid");
						$("#input_mark_title").parent().children("label").attr("data-error",'标题长度应在5到40字之间！');
						return;
					}else{
						$("#input_mark_title").removeClass("invalid");
						$("#input_mark_title").addClass("valid");
					}
					if(markContent.length<20){
						$("#input_mark_content").removeClass("valid");
						$("#input_mark_content").addClass("invalid");
						$("#input_mark_content").parent().children("label").attr("data-error",'书评长度应大于20字！');
						return;
					}else{
						$("#input_mark_content").removeClass("invalid");
						$("#input_mark_content").addClass("valid");
					}
					$("#modifyMark").addClass("disabled");
					PLServerAPI.addBookMark(bookid, markTitle, markContent, {
						onSuccess: function(){
							getMarkList(bookid);
							$("#modifyMark").removeClass("disabled");
							$("#modifyMark .material-icons").html("mode_edit");
							$("#modifyMark").removeClass("green");
							$("#modifyMark").addClass("red");
							$(".valign-wrapper .writemark").html("写书评");
							WriteMark=false;
						},
						onFailure: function(apiError){
							Materialize.toast(apiError.getErrorMessage(), 4000);
							WriteMark=false;
						}
					});
					$("#input_mark_title").removeClass("valid");
					$("#input_mark_title").removeClass("invalid");
					$("#input_mark_content").removeClass("valid");
					$("#input_mark_content").removeClass("invalid");
				}
			}
        });
		
		$("#input_mark_title").focusout(function() {
				var markTitle = $(this).val();
				if(markTitle.length<5||markTitle.length>40){
					$(this).removeClass("valid");
					$(this).addClass("invalid");
					$(this).parent().children("label").attr("data-error",'标题长度应在5到40字之间！');
					return;
				}else if(markTitle.length===0){
					$(this).removeClass("valid");
					$(this).removeClass("invalid");
				}else{
					$(this).removeClass("invalid");
					$(this).addClass("valid");
				}
        }).focusin(function() {
				$(this).removeClass("valid");
				$(this).removeClass("invalid");
        });
		$("#input_mark_content").focusout(function() {
				var markContent = $(this).val();
				if(markContent.length<20){
					$(this).removeClass("valid");
					$(this).addClass("invalid");
					$(this).parent().children("label").attr("data-error",'书评长度应大于20字！');
					return;
				}else if(markContent.length===0){
					$(this).removeClass("valid");
					$(this).removeClass("invalid");
				}else{
					$(this).removeClass("invalid");
					$(this).addClass("valid");
				}
        }).focusin(function() {
				$(this).removeClass("valid");
				$(this).removeClass("invalid");
        });


	
  });

})(window, document, jQuery);

	function getBook(bid,isbn13){
			toTheBeginning();
			PLServerAPI.getBookDetails(isbn13,{
			   onSuccess: function(book){
					$(".inner img").attr("src",book.image);
					$(".inner div h5").html(book.title);
					$(".inner div ul li:eq(0)").html("作者："+book.author);
					$(".inner div ul li:eq(1)").html("出版年："+book.pubdate);
					$(".inner div ul li:eq(2)").html("出版社："+book.publisher);
					$(".inner div ul li:eq(3)").html("页数："+book.pages);
					$(".inner div ul li:eq(4)").html("定价："+book.price);
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
	}
	function getMarkList(bid){
		 PLServerAPI.getBookMarkList(bid,0,{
			 onSuccess: function(bookMarks){

				 var len = bookMarks.length;
				 if(len===0){
					 $(".noResult").css("display","block");
					 $(".bookMarkContainer").css("display","none");
				 }else{
					 $(".noResult").css("display","none");
					 $(".bookMarkContainer:eq(0)").css("display","none");
					 $(".bookMarkContainer:eq(1)").css("display","block");
					 $(".bookMarkContainer:eq(1)").empty();
				 }
				 $.each(bookMarks, function(i,bookMark){
					 var avatar = "http://115.28.135.76/images/users/avatars/"+bookMark.uid+".png";
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
					 );
				 });
			 },
			 onFailure: function(apiError){
				 Materialize.toast(apiError.getErrorMessage(), 4000);
			 }
			 
		 });

	}
	
	function toTheBeginning(){
		$(".image-wrapper").css("background","");
		$(".inner img").removeAttr("src");
		$(".inner div h5").html("......");
		$(".inner div ul li:eq(0)").html("作者：.....");
		$(".inner div ul li:eq(1)").html("出版年：.....");
		$(".inner div ul li:eq(2)").html("出版社：.....");
		$(".inner div ul li:eq(3)").html("页数：.....");
		$(".inner div ul li:eq(4)").html("定价：.....");
		$(".bookDescContainer blockquote:eq(1)").html(".....");
		
		$(".bookMarkContainer:eq(1)").empty();
		$("#modifyMark .material-icons").html("mode_edit");
		$("#modifyMark").removeClass("green");
		$("#modifyMark").addClass("red");
		$(".valign-wrapper .writemark").html("写书评");
		
		$("#input_mark_title").val("");
		$("#input_mark_content").val("");
		
		$("#input_mark_title").removeClass("valid");
		$("#input_mark_title").removeClass("invalid");
		$("#input_mark_content").removeClass("valid");
		$("#input_mark_content").removeClass("invalid");
		WriteMark=false;
	}
