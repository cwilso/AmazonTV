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
   		focus = $('.cat').first();
   	}

	switch(e.keyCode) {
	    case 37:// Left arrow - move to previous
	    	next = $(".selectable");
	    	var i = next.index( $('.selected') ) - 1;

    		$(".selected").removeClass("selected");
	    	if ( i < 0 )  // Error, or ran off the end- restart at end
	    		$('.selectable').last().addClass('selected');
	    	 else  
	    		next.eq(i).addClass('selected');
	    	break;

	    case 38:// Up arrow - 
	    	if (focus.hasClass("itemimg")) {
	    		// We're in the videos, not the header band
	    		var i = focus.parents(".item").first().index( focus );
	    		
	    		
	    		
	    		
	    		/* The above is totally wrong.  the itemimg is deep in the hierarchy, and I need to index at the root branch.  
	    		 * The "set" down below is also totally wrong - we need to dive in several layers to set the "selected". 
	    		 * Or should I maybe just change the "selected" highlights to use that deep branch (i.e. the root of the branch is what has "selected"? */ 
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	       		$(".selected").removeClass("selected");
	    		var cat = focus.parents(".cat").prevAll(".cat");
	    		if (cat.length < 1)	// last row - jump to header
	    	   		$('.selectable').first().addClass('selected');
	    		else {
	    			cat = cat.first();
	    			var n = Math.min(i, cat.children().length-1);
	    			cat.children().eq(n).addClass("selected");
	    		}
	    	} else {
	    		
	    	}
	    	break;
	
	    case 39:// Right arrow - move to next
	    	next = $(".selectable");
	    	var i = next.index( $('.selected') ) + 1;

    		$(".selected").removeClass("selected");
	    	if ( ( i == 0 ) || // Error?!?
	    		 ( i >= next.length ) )   // ran off the end- restart
	    		$('.selectable').first().addClass('selected');
	    	 else  
	    		next.eq(i).addClass('selected');
	    	break;
	
	    case 40:// Down arrow - 
	    	if (focus.hasClass("itemimg")) {
	    		// We're in the videos, not the header band
	    		var i = focus.parents(".item").first().index( focus );
	       		$(".selected").removeClass("selected");
	    		var cat = focus.parents(".cat").nextAll(".cat");
	    		if (cat.length < 1)	// last row - jump to header
	    	   		$('.selectable').first().addClass('selected');
	    		else {
	    			cat = cat.first();
	    			var n = Math.min(i, cat.children().length-1);
	    			cat.children().eq(n).addClass("selected");
	    		}
	    	} else {
	    		
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