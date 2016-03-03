$(document).ready(function(){
	$('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('#requestWrapper').pushpin({ top: $('#requestWrapper').offset().top });
    $('ul.tabs').tabs();
  });