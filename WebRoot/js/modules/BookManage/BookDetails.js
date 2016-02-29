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
			 .css({ background: data.color })
	});

	// Run the A.B. plugin.
	$.adaptiveBackground.run({ parent: "bookcover" });
  })

})(window, document, jQuery)

function getBook(bid){ 
	  alert(bid);
}
