$(document).ready(function(){
	$('.parallax').parallax();
	$( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
	
	$("#BorrowManage").click(function(){
		$("#TempPage").load("http://www.baidu.com");
		
		});
});
