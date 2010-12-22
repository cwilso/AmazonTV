function keydown(e)
{
	var next;

    if (!e) return;

    /*
   	switch (e.keyCode) {	// Transport controls should always work
	case 227:  
		rewind();
		return;
	case 228:
		ffwd();
		return;
   	// case 176: previous video
   	// case 177: next video
	case 179:
		playPause();
		return;
   	}
   	*/

    var focus = $(".selected").first();
   	if (!focus) {
   		$('.selectable').first().addClass('selected');
   		focus = $('.selected').first();
   	}

	switch(e.keyCode) {
	    case 37:// Left arrow - move to previous
	    	next = $(".selectable");
	    	var i = next.index( $('.selected') ) - 1;

    		focus.removeClass("selected");
	    	if ( i < 0 )  // Error, or ran off the end- restart at end
	    		$('.selectable').last().addClass('selected');
	    	 else  
	    		next.eq(i).addClass('selected');
	    	break;

	    case 38:// Up arrow - 
	    	if (focus.hasClass("itemimg")) {
	    		// We're in the videos, not the header band
	    		// figure out which number item "branch" we are in from the category
	    		var i = focus.parents(".cat").first().children().index( focus.parents(".item") );
	    		
	       		focus.removeClass("selected");
	    		var cat = focus.parents(".cat").prevAll(".cat");
	    		if (cat.length < 1)	{ // last row - jump to header 
	    			cat = $('#toolbar').find(".selectable");
	    			cat.eq( Math.min(i, cat.length-1) ).addClass("selected");
	    		} else {
	    			cat = cat.first();
	    			cat.children().eq( Math.min(i, cat.children().length-1) ).find('.itemimg').addClass("selected");
	    		}
	    	} else {
	    		var i = $("#toolbar").find(".selectable").index( focus );	//which selectable item in the header are we?
	       		focus.removeClass("selected");
	    		var cat = $(".cat").last();
    			cat.children().eq( Math.min(i, cat.children().length-1) ).find('.itemimg').addClass("selected");
	    	}
	    	break;
	
	    case 39:// Right arrow - move to next
	    	next = $(".selectable");
	    	var i = next.index( $('.selected') ) + 1;

    		focus.removeClass("selected");
	    	if ( ( i == 0 ) || // Error?!?
	    		 ( i >= next.length ) )   // ran off the end- restart
	    		$('.selectable').first().addClass('selected');
	    	 else  
	    		next.eq(i).addClass('selected');
	    	break;
	
	    case 40:// Down arrow - 
	    	if (focus.hasClass("itemimg")) {
	    		// We're in the videos, not the header band
	    		// figure out which number item "branch" we are in from the category
	    		var i = focus.parents(".cat").first().children().index( focus.parents(".item") );
	       		focus.removeClass("selected");
	    		var cat = focus.parents(".cat").nextAll(".cat");
	    		if (cat.length < 1)	{ // last row - jump to header
	    			cat = $('#toolbar').find(".selectable");
	    			cat.eq( Math.min(i, cat.length-1) ).addClass("selected");
	    		} else {
	    			cat = cat.first();
	    			cat.children().eq( Math.min(i, cat.children().length-1) ).find('.itemimg').addClass("selected");
	    		}
	    	} else {
	    		var i = $("#toolbar").find(".selectable").index( focus );	//which selectable item in the header are we?
	       		focus.removeClass("selected");
	    		var cat = $(".cat").first();
    			cat.children().eq( Math.min(i, cat.children().length-1) ).find('.itemimg').addClass("selected");
	    	}
	    	break;
	
	    case 13:// Enter/select - 
	    	switch (focus[0].innerText)
	    	{
	    	case "Spotlight":
	    		break;
	    	case "Previews":
	    		break;
	    	}
	        break;
	}
	return;
}

function mouseenter( e ) {
	if (!e)
		return;
	var el = $(e.target);
	if (!el.hasClass("selectable")) {
		el = el.parents(".selectable");
		if (el.length < 1)
			return;	//no selectable parents
		el = el.first();
	}
	$(".selected").removeClass("selected");
	el.addClass("selected");
}

function mouseleave( e ) {
	if (!e)
		return;
	var el = $(e.target);
	
	if (!el.hasClass("selectable")) {
		el = el.parents(".selectable");
		if (el.length < 1)
			return;	//no selectable parents
		el = el.first();
	}
	el.removeClass("selected");
}




