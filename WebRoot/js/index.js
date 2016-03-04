$(document).ready(function() {
	$('.parallax').parallax();
	
	/*$.post("servlet/manager",
		{
			module: "user",
			action: "checkIfLogedIn"
		}, 
		function(result){
			SelectModileFromUrl();
		},
		"json"
	);*/
	
	SelectModileFromUrl();
	
	if(window.history && window.history.pushState){
		$(window).on("popstate", function(){
			SelectModileFromUrl();
		});
	}
	
	
});

function SelectModileFromUrl(){
	var names = window.location.href.split("#");
	SelectModule(names[1]);
}

function SelectModule(name){
		$(".nav-wrapper ul li").removeClass("active");
	if(name=="Book"){
		$(".nav-wrapper ul li:eq(0)").addClass("active");
		LoadPage("Book/MyBooks.html");
	}else if(name=="Borrow"){
		$(".nav-wrapper ul li:eq(1)").addClass("active");
		LoadPage("Borrow/BorrowManage.html");
	}else if(name=="Friend"){
		$(".nav-wrapper ul li:eq(2)").addClass("active");
		LoadPage("Friend/FriendManage.html");
	}else if(name=="Social"){
		$(".nav-wrapper ul li:eq(3)").addClass("active");
		LoadPage("Social/BookMarks.html");
	}else{
		$(".nav-wrapper ul li:eq(0)").addClass("active");
		LoadPage("Book/MyBooks.html");
	}
}

function LoadPage(path){
	$("#PageContainer").load("modules/"+path);
}