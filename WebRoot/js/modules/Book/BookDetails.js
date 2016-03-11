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
					$(".rightContent").css("display","none");
					$("#pageWriteMark").css("display","block");
					
					$("#modifyMark .material-icons").html("done");
					$("#modifyMark").removeClass("red");
					$("#modifyMark").addClass("green");
					$("#markButton").html("提交");
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
							$("#markButton").html("写书评");
							
							$("#pageWriteMark .row").html(
					                        '<div class="input-field col s12">'+
												'<input id="input_mark_title" type="text">'+
												'<label for="input_mark_title">书评标题</label>'+
					                        '</div>'+
					                        '<br />'+
								      
					                        '<div class="input-field col s12">'+
					                          '<textarea id="input_mark_content" class="materialize-textarea"></textarea>'+
					                          '<label for="input_mark_content">书评内容</label>'+
					                        '</div>'			
							);
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
		
		$(document).delegate("#input_mark_title","focusout",function() {
				var markTitle = $(this).val();
				if(markTitle.length===0){
					$(this).removeClass("valid");
					$(this).removeClass("invalid");
				}else if(markTitle.length<5||markTitle.length>40){
					$(this).removeClass("valid");
					$(this).addClass("invalid");
					$(this).parent().children("label").attr("data-error",'标题长度应在5到40字之间！');
					return;
				}else{
					$(this).removeClass("invalid");
					$(this).addClass("valid");
				}
        }).delegate("#input_mark_title","focusin",function() {
				$(this).removeClass("valid");
				$(this).removeClass("invalid");
        });
		$(document).delegate("#input_mark_content","focusout",function() {
				var markContent = $(this).val();
				if(markContent.length===0){
					$(this).removeClass("valid");
					$(this).removeClass("invalid");
				}else if(markContent.length<20){
					$(this).removeClass("valid");
					$(this).addClass("invalid");
					$(this).parent().children("label").attr("data-error",'书评长度应大于20字！');
					return;
				}else{
					$(this).removeClass("invalid");
					$(this).addClass("valid");
				}
        }).delegate("#input_mark_content","focusin",function() {
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
	}
	function getMarkList(bid){
		 PLServerAPI.getBookMarkList(bid,0,{
			 onSuccess: function(bookMarks){

				 var len = bookMarks.length;
				 if(len===0){
					 $(".rightContent").css("display","none");
					 $("#pageNoResult").css("display","block");
				 }else{
					 $(".rightContent").css("display","none");
					 $("#pageBookMarkList").css("display","block");
					 $("#pageBookMarkList").empty();
				 }
				 $.each(bookMarks, function(i,bookMark){
					 var avatar = "http://115.28.135.76/images/users/avatars/"+bookMark.uid+".png";
					 var summary = bookMark.summary.replace(/\n/g, "<br />");
					 $("#pageBookMarkList").append(
						 '<div class="card white darken-1 hoverable BookCard" onClick="getMarkDetail('+bookMark.mid+', true);">'+
			                '<div class="BookDetail">'+ 
			                    '<div class="card-content black-text" style="height: 100%">'+
			                        '<div style="overflow: auto;">'+
			                         ' <div class="chips right">'+
			                                '<img src="'+avatar+'" onError="javascript:this.src=\'images/avater/a2.png\'"/>'+
			                                bookMark.nickname+
			                          '</div>'+
			                          '<h6 style="margin-top:0px">'+bookMark.title+'</h6>'+
			                          '<h6>'+bookMark.time+'</h6>'+
			                        '</div>'+
			                        '<hr size="1">'+  
			                        '<p class="BookDesc">'+summary+'</p>'+
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
		
		$("#pageBookMarkList").empty();
		$("#modifyMark .material-icons").html("mode_edit");
		$("#modifyMark").removeClass("green");
		$("#modifyMark").addClass("red");
		$("#markButton").html("写书评");
		
		$("#pageWriteMark .row").html(
                        '<div class="input-field col s12">'+
							'<input id="input_mark_title" type="text">'+
							'<label for="input_mark_title">书评标题</label>'+
                        '</div>'+
                        '<br />'+
			      
                        '<div class="input-field col s12">'+
                          '<textarea id="input_mark_content" class="materialize-textarea"></textarea>'+
                          '<label for="input_mark_content">书评内容</label>'+
                        '</div>'			
		)
		
		$("#input_mark_title").removeClass("valid");
		$("#input_mark_title").removeClass("invalid");
		$("#input_mark_content").removeClass("valid");
		$("#input_mark_content").removeClass("invalid");
		
		$(".rightContent").css("display","none");
		$("#pageNoResult").css("display","block");
		
		WriteMark=false;
	}
	
	function getMarkDetail(mid, showBtn){
		$(".rightContent").css("display","none");
		$("#pageBookMarkDetail").css("display","block");
		if(showBtn){
			$(".btn-floating").show();
		}else{
			$(".btn-floating").hide();
		}
		$("#pageBookMarkDetail #markContent").empty();
		PLServerAPI.getBookMarkDetails(mid,{
			onSuccess:function(bookMark){
				$("#pageBookMarkDetail #markTitle").html(bookMark.title);
				var content = "<p>"+bookMark.content.replace(/\n/g, "</p><p>")+"</p>";
				
				$("#pageBookMarkDetail #markContent").html(content);
			},
			onFailure:function(apiError){
				Materialize.toast(apiError.getErrorMessage(), 4000);
			}
		});
	}
	
	function getBack(){
			$(".rightContent").css("display","none");
			$("#pageBookMarkList").css("display","block");
    }
