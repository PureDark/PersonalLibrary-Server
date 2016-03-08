$(document).ready(function(e) {
		
	$('.parallax img').attr("src","images/background2.jpg");
		
	$("#BorrowIn .collapsible-header").click(function(){
		$("#TabBorrowIn").children("a").click();
	});
	
	$("#BorrowOut .collapsible-header").click(function(){
		$("#TabBorrowOut").children("a").click();
	});
	
	
	PLServerAPI.getBorrowedBookRecordList(0, {
		onSucess: function(borrowRecords){
			$("#Borrow").empty();
			var sstatus;
			$.each(borrowRecords, function(i, borrowRecord){
				if(borrowRecord.status==1){
					sstatus="等待处理";
				}else if(borrowRecord.status==2){
					sstatus="已同意";
				}else if(borrowRecord.status==3){
					sstatus="被拒绝";
				}else if(borrowRecord.staus==4){
					sstatus="已归还";
				}else{
					sstatus="";
				}
				var time = borrowRecord.borrow_time;
				var stime= time.splite(" ");
				
				$("#Borrow").append(
					'<li id="BorrowIn1" class="row">'+
					'<time class="cbp_tmtime col m2 l3 offset-l6 hide-on-small-only" datetime='+borrowRecord.borrow_time+'>'+
					'<span>'+stime[0]+'</span>'+
					'<span>'+stime[1]+'</span>'+
					'</time>'+
					'<div class="cbp_tmicon cbp_tmicon-phone hide-on-med-and-down"></div>'+
					'<div class="col s12 m10 l5 offset-l0">'+
					'<div class="card white darken-1 hoverable borrowcard">'+
					'<div class="BookDetail">'+
					'<div class="card-content black-text" style="height: 100%">'+
					'<div style="overflow: auto;">'+
					'<div class="chips">'+
					''
					
				
				)
			});
		}
		
	});
	
});