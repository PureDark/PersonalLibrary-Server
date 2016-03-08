$(document).ready(function(e) {
	$("#Borrow").empty();
	$('.parallax img').attr("src","images/background2.jpg");
		
	$("#BorrowIn .collapsible-header").click(function(){
		$("#TabBorrowIn").children("a").click();
	});
	
	$("#BorrowOut .collapsible-header").click(function(){
		$("#TabBorrowOut").children("a").click();
	});
	PLServerAPI.getBorrowedBookRecordList(0, {
		onSuccess:function(borrowRecords){
			borrowtime=borrowRecords.borrow_time;
			PLServerAPI.getloanedBookRecordList(0, {
				onSuccess:function(loanedRecords){
					var records = borrowRecords.concat(loanedRecords);
					$.each(records, function(i, record){
						var date = record.borrow_time;
						date = date.substring(0,19);    
						date = date.replace(/-/g,'/'); 
						var timestamp = new Date(date).getTime();
						record.timestamp = timestamp;
					});
					$.each(records, function(i, record){
						record.timestamp
					});
				},
				onFailure: function(apiError){
					Materialize.toast(apiError.getErrorMessage(), 4000)
				}
			
			});
			
		},
		onFailure: function(apiError){
			Materialize.toast(apiError.getErrorMessage(), 4000)
		}
	
	});
	
	
	//var borrowtime = borrowRecord.borrow_time;
	//var loanedtime=loanedRecord._time
	//var stime= time.split(" ");
	
	PLServerAPI.getBorrowedBookRecordList(0, {
		onSuccess: function(borrowRecords){
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
													'<img src="http://115.28.135.76/images/users/avatars/'+borrowRecord.loan_uid+'.png" alt="Contact Person">'+
													borrowRecord.nickname+
												'</div>'+
												'<div>'+
												'<h6 class="left  text-darken-1  BookTitle">'+'向TA借阅'+'&nbsp;&nbsp;&nbsp;</h6>'+
												'<h6 class="left  text-darken-1 BookTitle"><b>《'+borrowRecord.book_name+'》</b></h6>'+
												'</div>'+
											'</div>'+
											'<div class="status center">'+
												'<span  style="color:#807e7e"><br>'+sstatus+'</span>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
						'</div>'+
					'</li>'
                       
				)
			});
		}
		
	});
	
	PLServerAPI.getLoanedBookRecordList(0, {
		onSuccess: function(loanedRecords){
			
			var sstatus;
			$.each(loanedRecords, function(i, loanRecord){
				if(loanedRecord.status==1){
					sstatus="等待处理";
				}else if(borrowRecord.status==2){
					sstatus="已同意";
				}else if(loanedRecord.status==3){
					sstatus="被拒绝";
				}else if(loanedRecord.staus==4){
					sstatus="已归还";
				}else{
					sstatus="";
				}
			
				
				$("#Borrow").append(
					'<li id="BorrowIn1" class="row">'+
						'<time class="cbp_tmtime col m2 l3 offset-l3 hide-on-small-only" datetime='+loanedRecord.borrow_time+'>'+
							'<span>'+stime[0]+'</span>'+
							'<span>'+stime[1]+'</span>'+
						'</time>'+
						'<div class="cbp_tmicon cbp_tmicon-phone hide-on-med-and-down"></div>'+
							'<div class="col s12 m10 l5 offset-l7">'+
								'<div class="card white darken-1 hoverable borrowcard">'+
									'<div class="BookDetail">'+
										'<div class="card-content black-text" style="height: 100%">'+
											'<div style="overflow: auto;">'+
												'<div class="chips">'+
													'<img src="http://115.28.135.76/images/users/avatars/'+loanedRecord.borrow_uid+'.png" alt="Contact Person">'+
													loanedRecord.nickname+
												'</div>'+
												'<div>'+
												'<h6 class="left  text-darken-1  BookTitle">'+'向TA借阅'+'&nbsp;&nbsp;&nbsp;</h6>'+
												'<h6 class="left  text-darken-1 BookTitle"><b>《'+loanedRecord.book_name+'》</b></h6>'+
												'</div>'+
											'</div>'+
											'<div class="status center">'+
												'<span  style="color:#807e7e"><br>'+sstatus+'</span>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
						'</div>'+
					'</li>'
                       
				)
			});
		}
		
	});
	
});