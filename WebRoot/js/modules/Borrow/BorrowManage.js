$(document).ready(function(e) {
	$('.parallax img').attr("src","images/background2.jpg");
		
	$("#BorrowIn .collapsible-header").click(function(){
		$("#TabBorrowIn").children("a").click();
	});
	
	$("#BorrowOut .collapsible-header").click(function(){
		$("#TabBorrowOut").children("a").click();
	});
	
	getRecords();
	
});

	function getRecords(){
		PLServerAPI.getBorrowedBookRecordList(0, {
			onSuccess:function(borrowRecords){
				borrowtime=borrowRecords.borrow_time;
				PLServerAPI.getLoanedBookRecordList(0, {
					onSuccess:function(loanedRecords){
						$("#Borrow").empty();
						var records = borrowRecords.concat(loanedRecords);
						$.each(records, function(i, record){
							var date = record.borrow_time;
							date = date.substring(0,19);    
							date = date.replace(/-/g,'/'); 
							var timestamp = new Date(date).getTime();
							record.timestamp = timestamp;
						});
						for(var i=0;i<records.length-1;i++){
							for(var j=0;j<records.length-i-1;j++){
								if(records[j].timestamp<records[j+1].timestamp){
									var swap=records[j];
									records[j]=records[j+1];
									records[j+1]=swap;
								 }
							 }
						 }
						$.each(records, function(i, record){
							if(record.isBorrowed)
								insertBorrowRecord(record);
							else
								insertLoanRecord(record);
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
	}
	
	function insertBorrowRecord(record){
		var status;
		if(record.status==1){
			status='<span  style="color:#807e7e"><br>等待处理</span>';
		}else if(record.status==2){
			status='<span  style="color:#807e7e"><br>已同意</span>';
		}else if(record.status==3){
			status='<span  style="color:#807e7e"><br>被拒绝</span>';
		}else if(record.status==4){
			status='<span  style="color:#807e7e"><br>已归还</span>';
		}else{
			status="";
		}	
		
		var stime= record.borrow_time.split(" ");
		stime[1] = stime[1].split(":");
				
		$("#Borrow").append(
			'<li id="BorrowIn1" class="row">'+
				'<time class="cbp_tmtime col m2 l3 offset-l6 hide-on-small-only" datetime='+record.borrow_time+'>'+
					'<span>'+stime[0]+'</span>'+
					'<span>'+stime[1][0]+":"+stime[1][1]+'</span>'+
				'</time>'+
				'<div class="cbp_tmicon cbp_tmicon-phone hide-on-med-and-down"></div>'+
					'<div class="col s12 m10 l5 offset-l0">'+
						'<div class="card white darken-1 hoverable borrowcard">'+
							'<div class="BookDetail">'+
								'<div class="card-content black-text" style="height: 100%">'+
									'<div style="overflow: auto;">'+
										'<div class="chips">'+
											'<img src="http://115.28.135.76/images/users/avatars/'+record.loan_uid+'.png" alt="Contact Person">'+
											record.nickname+
										'</div>'+
										'<div>'+
										'<h6 class="left  text-darken-1  BookTitle">'+'向TA借阅'+'&nbsp;&nbsp;&nbsp;</h6>'+
										'<h6 class="left  text-darken-1 BookTitle"><b>《'+record.book_name+'》</b></h6>'+
										'</div>'+
									'</div>'+
									'<div class="status center">'+
										status+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
				'</div>'+
			'</li>'
			   
		);
	}
	
	function insertLoanRecord(record){
		var status;
		if(record.status==1){
			status='<a class="waves-effect waves-dark btn-flat agree" onClick="acceptRecored('+record.brid+',true)">借出</a>'+
            	   '<a class="waves-effect waves-dark btn-flat refuse" onClick="acceptRecored('+record.brid+',false)">拒绝</a>';
		}else if(record.status==2){
			status='<span  style="color:#807e7e"><br>已同意</span>';
		}else if(record.status==3){
			status='<span  style="color:#807e7e"><br>已拒绝</span>';;
		}else if(record.staus==4){
			status='<span  style="color:#807e7e"><br>已归还</span>';;
		}else{
			status="";
		}
		
		var stime= record.borrow_time.split(" ");
		stime[1] = stime[1].split(":");
				
				$("#Borrow").append(
					'<li id="BorrowIn1" class="row">'+
						'<time class="cbp_tmtime col m2 l3 offset-l3 hide-on-small-only" datetime='+record.borrow_time+'>'+
							'<span>'+stime[0]+'</span>'+
							'<span>'+stime[1][0]+":"+stime[1][1]+'</span>'+
						'</time>'+
						'<div class="cbp_tmicon cbp_tmicon-phone hide-on-med-and-down"></div>'+
							'<div class="col s12 m10 l5 offset-l7">'+
								'<div class="card white darken-1 hoverable borrowcard">'+
									'<div class="BookDetail">'+
										'<div class="card-content black-text" style="height: 100%">'+
											'<div style="overflow: auto;">'+
												'<div class="chips">'+
													'<img src="http://115.28.135.76/images/users/avatars/'+record.borrow_uid+'.png" alt="Contact Person">'+
													record.nickname+
												'</div>'+
												'<div>'+
												'<h6 class="left  text-darken-1  BookTitle">'+'请求借阅'+'&nbsp;&nbsp;&nbsp;</h6>'+
												'<h6 class="left  text-darken-1 BookTitle"><b>《'+record.book_name+'》</b></h6>'+
												'</div>'+
											'</div>'+
											'<div class="status center">'+
												status+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
						'</div>'+
					'</li>'
                       
				);
	};
	
	
	
	
	function acceptRecored(brid, accept){
			PLServerAPI.acceptBorrowRecord(brid,accept,{
				onSuccess:function(){
					getRecords();
				},
				onFailure:function(){
					Materialize.toast(apiError.getErrorMessage(), 4000);
				}
			});
	}