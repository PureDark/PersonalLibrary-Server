var page = 1;
	
//声明Video类
function Video(title, videolink, password){
	this.title = title;
	this.videolink= videolink;
	this.password= password;
}

$(document).ready(function(e) {
	getCategoryList();
    getLessonList(1);
	
	
	$("#btn_addstuff").click(function(e){
		$("#InputId").val(0);
		$("#InputTitle").val("");
		$("#InputShortDesc").val("");
		$("#InputDescription").val("");
		$("#InputCategory").val(1);
		$("#VideoList tr").eq(0).nextAll().remove();
		$("#btn_addvideo").removeAttr("disabled");
		$("#LessonFromModal").modal();
	})

	$("#btn_submitstuff").click(function(e){
		var lid = $("#InputId").val();
		var title = $("#InputTitle").val();
		var shortdesc = $("#InputShortDesc").val();
		var description = $("#InputDescription").val();
		var category = $("#InputCategory").val();
		if(lid!=0)
			modifyLesson(lid,title,shortdesc,description,category);
		else{
			var videos = [];
			$("#VideoList tr").eq(0).nextAll().each(function(index, videotr) {
                var videotitle = $(this).children().eq(0).html();
                var videodesc = $(this).children().eq(1).html();
                var videopass = $(this).children().eq(2).html();
				videos.push(new Video(videotitle, videodesc, videopass));
            });
			addLesson(title,shortdesc,description,category,videos);
		}
	})

	$("#btn_addvideo").click(function(e){
		var lid = $("#InputId").val();
		$("#VideoList").append(
					"<tr id='vid_new'>"+
                        "<td><input id='InputVideoTitle' type='text' class='form-control' placeholder='视频标题'/></td>"+
                        "<td><input id='InputVideoLink' type='text' class='form-control' placeholder='视频代码'/></td>"+
                        "<td><input id='InputVideoPassword' type='text' class='form-control' placeholder='密 码'/></td>"+
                        "<td><button id='btn_confirm' type='button' class='btn btn-info btn-xs' onclick='addVideo("+lid+")'> 确 定 </button></td>"+
                    "</tr>"
		);
		$("#btn_addvideo").attr("disabled","true");
	})
	
	$("#pagination li").eq(0).click(function(e) {
		if(page>1)page--;
        getLessonList(page);
    });
	$("#pagination li").eq(6).click(function(e) {
		page++;
        getLessonList(page);
    });
	


	$('#curr_pos').popover({
		html: true,
		content: "<div class=\"popup\">...</div>",
		placement: "top",
		trigger: "manual"
	});

	$('#LessonList').popover({
		html: true,
		content: "<div class=\"popup\">...</div>",
		placement: "top",
		trigger: "manual"
	});

	$('#LessonFromModal .modal-footer').popover({
		html: true,
		content: "<div class=\"popup\">...</div>",
		placement: "top",
		trigger: "manual"
	});
	
});



function selectCategory(str, type){
	str += " <span class='caret'></span>";
	$("#curr_pos").html(str);
	$("#curr_pos").attr("currpos",type);
    getLessonList(1);
}

function pagination(){
	if(page<4)
		for(var i =1;i<6;i++){
			var curr = $("#pagination li").eq(i);
			curr.attr("onClick","getLessonList("+i+");")
			curr.html("<a href=\"#\">"+i+"</a>");
			if(page == i)curr.addClass("active");
			else curr.removeClass("active");
		}
	else
		for(var i=page-2,j=1;i<page+3;i++,j++){
			var curr = $("#pagination li").eq(j);
			curr.attr("onClick","getLessonList("+i+");")
			curr.html("<a href=\"#\">"+i+"</a>");
			if(page == i)curr.addClass("active");
			else curr.removeClass("active");
		}
}

function editLesson(lid){
	$("#InputId").val(0);
	$("#InputTitle").val("");
	$("#InputShortDesc").val("");
	$("#InputDescription").val("");
	$("#InputCategory").val(1);
	$("#VideoList tr").eq(0).nextAll().remove();
	$("#btn_addvideo").removeAttr("disabled");
	$("#LessonFromModal").modal();
	getLessonDetails(lid);
}

function getCategoryList(){
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "lesson",
					action: "getCategoryList"
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result.status){
				 		$("#categories").empty();
				 		$("#InputCategory").empty();
					$.each(result.data,function(key, category){
						$.each(category.subcategories,function(key2, subcategory){
							$("#categories").append(
									"<li onClick=\"selectCategory('"+subcategory.title+"',"+subcategory.scid+")\"><a href=\"#\">"+subcategory.title+"</a></li>"
							);
							$("#InputCategory").append(
									"<option value='"+subcategory.scid+"' "+((key==0)?"selected='selected'":"")+">"+subcategory.title+"</option>"
							);
						});
					});
					$("#categories").append(
							"<li role=\"separator\" class=\"divider\"></li><li onClick=\"selectCategory('显示全部',0)\"><a href=\"#\">显示全部</a></li>"
					);
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#curr_pos').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#curr_pos").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#curr_pos').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#curr_pos").popover("hide");',2000);
			 }
		});
}
function getLessonList(p){
		page = p;
		pagination();
		var scid = $("#curr_pos").attr("currpos");
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "lesson",
					action: "getLessonList",
					scid: scid,
					page: page
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result.status){
				 	$("#LessonList tr").eq(0).nextAll().remove();
					 for(var i=0;i<10;i++){
						 var lesson = result['data'][i];
						 if(lesson!=null)
							$("#LessonList").append(
									"<tr>"+
										"<td>"+lesson.lid+"</td>"+
										"<td><img width='200' height='112' src='"+lesson.cover+"' /></td>"+
										"<td>"+lesson.title+"</td>"+
										"<td>"+lesson.description+"</td>"+
										"<td>"+
											"<button type=\"button\" class=\"btn btn-info btn-xs\" onClick=\"editLesson("+lesson.lid+")\"> 编 辑 </button> "+
											"<button type=\"button\" class=\"btn btn-danger btn-xs\" onClick=\"deleteLesson("+lesson.lid+")\"> 删 除 </button> "+
										"</td>"+
									"</tr>"
							);
						else 
							$("#LessonList").append(
								"<tr height='129px'><td></td><td></td><td></td><td></td><td></td></tr>"
							);
					 };
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonList').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonList").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#LessonList').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonList").popover("hide");',2000);
			 }
		});
}

function getLessonDetails(lid){
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "lesson",
					action: "getLesson",
					lid: lid
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result.status){
				 	lesson = result.data.lesson;
					$("#InputId").val(lesson.lid);
					$("#InputTitle").val(lesson.title);
					$("#InputShortDesc").val(lesson.shortdesc);
					$("#InputDescription").val(lesson.description);
					$("#InputCategory").val(lesson.scid);
					$("#VideoList tr").eq(0).nextAll().remove();
					$.each(result.data.videos,function(i,video){
						if(typeof(video.password)=='undefined')
							video.password = "";
						$("#VideoList").append(
							"<tr id='vid_"+video.vid+"'>"+
								"<td>"+video.title+"</td>"+
								"<td>"+video.videolink+"</td>"+
								"<td>"+video.password+"</td>"+
								"<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"deleteVideo("+video.vid+")\"> 删 除 </button></td>"+
							"</tr>"
						);
					});
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 case 1031: errorMessage="无此课程！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonList").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonList").popover("hide");',2000);
			 }
		});
}

function deleteLesson(lid){
		if(confirm("确定删除？"))
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "admin",
					action: "deleteLesson",
					lid: lid
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result['status']){
					getLessonList(page);
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1004: errorMessage="没有权限！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 case 1031: errorMessage="课程不存在！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonList').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonList").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#LessonList').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonList").popover("hide");',2000);
			 }
		});
}

function deleteVideo(vid){
		if(confirm("确定删除？"))
		if(vid<0){
			$("#vid_"+vid).remove();
		}else
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "admin",
					action: "deleteVideo",
					vid: vid
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result['status']){
					$("#vid_"+vid).remove();
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1004: errorMessage="没有权限！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 case 1032: errorMessage="视频不存在！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
			 }
		});
}


function modifyLesson(lid,title,shortdesc,description,category){
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "admin",
					action: "modifyLesson",
					lid: lid,
					title: title,
					shortdesc:shortdesc,
					description: description,
					scid:category
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result['status']){
					getLessonList(1);
					$("#LessonFromModal").modal("hide");
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1004: errorMessage="没有权限！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
			 }
		});
}

function addLesson(title,shortdesc,description,category,videos){
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "admin",
					action: "addLesson",
					title: title,
					shortdesc:shortdesc,
					description: description,
					scid:category,
					videos: JSON.stringify(videos)
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result['status']){
					getLessonList(1);
					$("#LessonFromModal").modal("hide");
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1004: errorMessage="没有权限！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
				 }
				 $("#btn_addvideo").attr("disabled","true")
		     },
			 error:function(xhr){
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
			 }
		});
}

var newVideoCount = 0;
function addVideo(lid){
	$("#btn_confirm").attr("disabled","true");
	var title = $("#InputVideoTitle").val();
	var videolink = $("#InputVideoLink").val();
	var password = $("#InputVideoPassword").val();
	var video = new Video(title,videolink,password);
	if(lid==0){
		$("#vid_new").remove();
		$("#VideoList").append(
			"<tr id='vid_"+newVideoCount+"'>"+
				"<td>"+video.title+"</td>"+
				"<td>"+video.videolink+"</td>"+
				"<td>"+video.password+"</td>"+
				"<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"deleteVideo("+newVideoCount+")\"> 删 除 </button></td>"+
			"</tr>"
		);
		$("#btn_addvideo").removeAttr("disabled");
		newVideoCount--;
	}else
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "admin",
					action: "addVideo",
					lid: lid,
					video: JSON.stringify(video)
				   },
		     dataType: "json",
		     success: function(result){
				 if(result['status']){
					getLessonDetails(lid);
					$("#btn_addvideo").removeAttr("disabled");
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1004: errorMessage="没有权限！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
				 }
		     },
			 error:function(xhr){
					 $('#LessonFromModal .modal-footer').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#LessonFromModal .modal-footer").popover("hide");',2000);
			 }
		});
}

//编码
function ToHTML(str)
{
  if (str.length == 0) return "";
  str = "<p>"+str+"</p>";
  s = str.replace(/\r\n/g, "<br/>");
  s = s.replace(/\r/g, "<br/>");
  s = s.replace(/\n/g, "<br/>");
  s = s.replace(/\t/g, "    ");
  s = s.replace(/ /g, "&nbsp;");
  return s;
}