var page = 1;
$(document).ready(function(e) {
	getCategoryList();
    getLessonList(1);
	

	
	$("#btn_addstuff").click(function(e){
		$("#InputName").val("");
		$("#InputSex").val(1);
		$("#InputPosition").val(1);
		$("#btn_submitstuff").attr("sid",0);
		$("#StuffFromModal").modal();
		$('#StuffFromModal .modal-title').html('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> 登记新员工');
	})

	$("#btn_submitstuff").click(function(e){
		var sid = $("#btn_submitstuff").attr("sid");
		var name = $("#InputName").val();
		var sex = $("#InputSex").val();
		var position = $("#InputPosition").val();
		modifyStuff(sid,name,sex,position);
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

	$('#StuffFromModal .modal-footer').popover({
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

function editStuff(sid,name,sex,pid){
	$("#InputName").val(name);
	$("#InputSex").val(sex);
	$("#InputPosition").val(pid);
	$("#btn_submitstuff").attr("sid",sid);
	$("#StuffFromModal").modal();
	$('#StuffFromModal .modal-title').html('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> 编辑员工信息');
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
											"<button type=\"button\" class=\"btn btn-info btn-xs\" onClick=\"editStuff("+lesson.lid+")\"> 编 辑 </button> "+
											"<button type=\"button\" class=\"btn btn-danger btn-xs\" onClick=\"deleteStuff("+lesson.lid+")\"> 删 除 </button> "+
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

function deleteStuff(sid){
		if(confirm("确定删除？"))
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "stuff",
					action: "deleteStuff",
					sid: sid
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
function modifyStuff(sid,name,sex,position){
		var action = (sid==0)?"addStuff":"updateStuff";
		$.ajax({
		     type: "POST",
		     url: "../../servlet/manager",
			 data: {
				 	module: "stuff",
					action: action,
					sid: sid,
					name: name,
					sex:sex,
					position: position
				 	},
		     dataType: "json",
		     success: function(result){
				 if(result['status']){
					getLessonList(1);
					$("#StuffFromModal").modal("hide");
				 }else{
					 var errorMessage;
					 switch(result.errorCode){
						 case 1001: errorMessage="参数不全！";break;
						 case 1002: errorMessage="尚未登录！";break;
						 case 1004: errorMessage="没有权限！";break;
						 case 1010: errorMessage="数据库错误！";break;
						 default: errorMessage="未知错误！";break;
					 }
					 $('#StuffFromModal .modal-footer').popover("show");
					 $(".popup").html(errorMessage);
					 setTimeout('$("#StuffFromModal .modal-footer").popover("hide");',2000);
				 }
		    },
			error:function(xhr){
					 $('#StuffFromModal .modal-footer').popover("show");
					 $(".popup").html("网络错误，请重试！");
					 setTimeout('$("#StuffFromModal .modal-footer").popover("hide");',2000);
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