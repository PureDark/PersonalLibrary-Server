$(document).ready(function(){
	$('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('#requestWrapper').pushpin({ top: $('#MyFriendsCard').offset().top });
    $('ul.tabs').tabs();
  });