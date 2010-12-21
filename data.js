var pageSize = 6;  // page size for image-based scrolling browsers
var recentVideos = new Array();

function addRecentVideo( video ) {	//takes the jQuery object representing the <img>
	var i;
	var mediaID = video.data( "mediaID" );

	for (i=0;i<recentVideos.length;i++) {
		if (recentVideos[i].mediaID == mediaID) {	// found it, already in the list
			// ideally, we would sort it to the front of the list first - TODO
			return;
		}
	}

	// Didn't find it - add it to the end of the list.
	var newItem = new Object();

	newItem.src = video.attr('src');
	newItem.desc = video.data( "description" );
	newItem.mediaID = mediaID;
	newItem.lengthinms = video.data( "lengthinms" );
	newItem.title = video.data( "title" );
	newItem.airdate = video.data( "airdate" );
	newItem.program = video.data( "program" );

	recentVideos.push( newItem );
}

function loadRecentVideos() {
	var i;
	var items = $('#boxstrip div.items');
	
	$('#boxstrip .scrollable').data("scrollable").begin();
	items.empty();
	$('#title').empty();
	$('#shortdesc').empty();

	for (i=recentVideos.length; i>0; i--) {	// Go in reverse order - we pushed them on the stack
		var newItem = recentVideos[i-1];
		if (items.children().length && (items.children().last().children().length<pageSize)) {
			items.children().last().append("<img class='episode' src='" + newItem.src + "' /> ");
		} else {
			items.append("<div> <img class='episode' src='" + newItem.src + "' /> </div>");
		}
		var item = items.children().last().children().last();	// either way, the item ends up being at the end of the last page.
		item.data( "description", newItem.desc );
		item.data( "mediaID", newItem.mediaID );
		if ( newItem.lengthinms )
			item.data( "lengthinms", newItem.lengthinms );
		item.data( "title", newItem.title );
		item.data( "airdate", newItem.airdate );
		if (newItem.program)
			item.data( "program", newItem.program.title );				
	}

	if (recentVideos.length) {
		// Set the focus on the first video now
		setVideoText( items.children().first().children().first() );
		$(".selected").removeClass("selected").addClass("alsoselected");
		items.children().first().children().first().addClass('selected');
	}
}

function selectProgram( prog, fallback ) {
    var id = prog.data( "resourceURI" );
    loadProgram( id, fallback );
}

function selectVideo( prog ) {
    var player = document.getElementById( "player" );
    var id = prog.data( "mediaID" ).toString();
    var orig = prog.data( "original" );	// This is for debugging
    document.getElementById('elapsedTime').innerHTML = "--:--";
    document.getElementById('remainingTime').innerHTML = "--:--";
    addRecentVideo( prog );
    player.playerLoad( id );
}

function playPause() {
	var player = document.getElementById( "player" );
	player.playerEvent("pause");
	// toggle play/pause button display
	$('#cplaypause').toggleClass('playing');
}
function play() {
	var player = document.getElementById( "player" );
	player.playerEvent("play");
	// toggle play/pause button display
	$('#cplaypause').addClass('playing');
}
function ffwd() {
	var player = document.getElementById( "player" );
	player.playerEvent("ffwd");
}
function rewind() {
	var player = document.getElementById( "player" );
	player.playerEvent("rwd");
}

function clearVideos() {
	$('#boxstrip div.items').empty();
}

function clearPrograms() {
	$('#programguide div.items').empty();
}

function bestThumbnail( images ) {
	var result = null;
	var i;
	
	if (!images || !images.length)
		return programFallbackImage;
	
	for (i = 0; i<images.length; i++) {  // Prefer iPhone-Small thumbnail
		if (images[i].type && (images[i].type.usage_type == "iPhone-Small"))
			return images[i].url;
	}

	for (i = 0; i<images.length; i++) {  // Prefer iPhone-Small thumbnail
		if (images[i].type && (images[i].type.usage_type == "iPhone-Small"))
			return images[i].url;
	}
	return images[0].url;
}

function addProgram( items, program ) {
	if (items.children().length && (items.children().last().children().length<pageSize)) {
		items.children().last().append("<img class='program' src='" + bestThumbnail( program.associated_images ) + "' /> ");
	} else {
		items.append("<div> <img class='program' src='" + bestThumbnail( program.associated_images ) + "' /> </div>");
	}
	var item = items.children().last().children().last();	// either way, the item ends up being at the end of the last page.
	// Need to store: prog url, shortdesc, length?
	var item = items.children().last().children().last();	// either way, the item ends up being at the end of the last page.
	item.data( "description ", program.short_description );
	item.data( "resourceURI", program.resource_uri );
	item.data( "title", program.title );			
	item.data( "original", program );	// This is for debugging
}

function loadPrograms( programs ) {
	var i;
	var items = $('#programguide div.items');
	
	$('#programguide .scrollable').data("scrollable").begin();
	items.empty();

	for (i=0; i<programs.count; i++)
		addProgram( items, programs.results[i] );
	
	if ($('.alsoselected').length)	// we're in the program guide, so select the first item
		$('#programguide div.items img').first().addClass('selected');
}

function addVideo( items, video ) {
	if (video.is_segment)	// don't add segments, only full programs
		return;
	if (items.children().length && (items.children().last().children().length<pageSize)) {
		items.children().last().append("<img class='episode' src='" + bestThumbnail( video.associated_images ) + "' /> ");
	} else {
		items.append("<div> <img class='episode' src='" + bestThumbnail( video.associated_images ) + "' /> </div>");
	}
	var item = items.children().last().children().last();	// either way, the item ends up being at the end of the last page.
	item.data( "description", video.short_description );
	item.data( "mediaID", video.tp_media_object_id );
	if ( video.mediafiles && video.mediafiles.length )
		item.data( "lengthinms", video.mediafiles[0].length_mseconds );
	item.data( "title", video.title );
	item.data( "airdate", video.airdate );
	if (video.program)
		item.data( "program", video.program.title );
	item.data( "original", video );  // This is for debugging
}

function timeElapsed(elapsedTime){
    document.getElementById('elapsedTime').innerHTML = elapsedTime;
}
function timeRemaining(remainingTime){
    document.getElementById('remainingTime').innerHTML =	remainingTime;
}
 
function setVideoText( video ) {
	var maxDescLength = 85;
	var title = video.data( "title");
	var lengthinms =  video.data( "lengthinms");
	
	maxDescLength -= title.length;	// title takes up room
	if ( lengthinms )
		maxDescLength -= 10;  // Leave room for the time, too.
	$('#title').empty().append( title );
	var desc = video.data( "description");
	if ( desc.length > maxDescLength ) {
		var i = desc.lastIndexOf(" ", maxDescLength );
		if (i==-1)
			i=maxDescLength;
		desc = desc.slice( 0, i );
		desc += "...";
	}
	$('#shortdesc').empty().append( desc );
	if ( lengthinms ) {
		var seconds = Math.floor( lengthinms / 1000 );
		var minutes = Math.floor( seconds/60 );
		seconds -= ( minutes * 60 );
		var hours = Math.floor( minutes/60 );
		minutes -= hours*60;
		
		$('#shortdesc').append( " (" );
		if (hours>0) {
			$('#shortdesc').append( hours + ":" );
			if (minutes<10)
				$('#shortdesc').append( "0" );
		}
		$('#shortdesc').append( minutes + ":" )
		if (seconds<10)
			$('#shortdesc').append( "0" );
		$('#shortdesc').append( seconds + ")"  );
	}
}

function compareAirdate( a, b ) {	// actually returns backward of sort() param, to order most-recent-first
	var dateA = new Date( a.airdate );
	var dateB = new Date( b.airdate );
	if ( dateA < dateB )
		return 1;
	if ( dateA > dateB )
		return -1;
	return 0;
	// format: airdate: "2010-09-20 04:01:00"
}

function loadVideos( spotlight ) {
	var i;
	var items = $('#boxstrip div.items');
	
	$('#boxstrip .scrollable').data("scrollable").begin();
	items.empty();
	$('#title').empty();
	$('#shortdesc').empty();

	if (!spotlight || !spotlight.results || spotlight.results.length<1)
		return;
	
	var videos = spotlight.results[0].videos;

	videos.sort( compareAirdate );
	for (i=0; i<videos.length; i++)
		addVideo( items, videos[i] );
	setVideoText( items.children().first().children().first() );
	items.children().first().children().first().addClass('alsoselected');
}

function loadProgramVideos( spotlight ) {
	var i;
	var items = $('#boxstrip div.items');
	
	$('#boxstrip .scrollable').data("scrollable").begin();
	items.empty();
	$('#title').empty();
	$('#shortdesc').empty();
	
	if (!spotlight || !spotlight.results || spotlight.results.length<1)
		return;
	
	var videos = spotlight.results;

	videos.sort( compareAirdate );
	for (i=0; i<videos.length; i++)
		addVideo( items, videos[i] );
	setVideoText( items.children().first().children().first() );
	programFallbackImage = null; // clear the fallback - we don't want it to apply to Spotlight or Preview items
}

function loadSpotlight() {
	$('#boxstrip .scrollable').data("scrollable").begin();
	$('#boxstrip div.items').empty();
	$('#title').empty();
	$('#shortdesc').empty();
	
	$.ajax({
		  dataType: 'jsonp',
		  jsonp: 'json_callback',
		  jsonpCallback: 'invoke_function',
		  url: 'http://ec2-184-73-109-163.compute-1.amazonaws.com/apiproxy/groups/?filter_name=gtv_spotlight&fields=associated_images,videos',
		  success: function (e) {
			  loadVideos( e );
		  },
		});
}

function loadPreviews() {
	$('#boxstrip .scrollable').data("scrollable").begin();
	$('#boxstrip div.items').empty();
	$('#title').empty();
	$('#shortdesc').empty();

	cancelFadeoutTimer();
	$.ajax({
		  dataType: 'jsonp',
		  jsonp: 'json_callback',
		  jsonpCallback: 'invoke_function',
		  url: 'http://ec2-184-73-109-163.compute-1.amazonaws.com/apiproxy/groups/?filter_name=gtv_previews&fields=associated_images,videos',
		  success: function (e) {
			  loadVideos( e );
		  },
		});
}

var programFallbackImage = null;

function loadProgram( URI, fallback ) {
	var progID = URI.substring( URI.search("/programs/") + 10, URI.length - 1);
	var d = new Date();
	var today = "";

	$('#boxstrip .scrollable').data("scrollable").begin();
	$('#boxstrip div.items').empty();
	$('#title').empty();
	$('#shortdesc').empty();

	programFallbackImage = fallback;	// Not all episodes have an associated image - use the program image as a fallback
/*
			today += d.getFullYear();
			if (d.getMonth()<9) 
				today += "-0";
			else
				today += "-";
			today += (d.getMonth()+1);
			if (d.getDate()<10)
				today += "-0";
			else
				today += "-";
			today += d.getDate();
*/			
	cancelFadeoutTimer();
	$.ajax({
		  dataType: 'jsonp',
		  jsonp: 'json_callback',
		  jsonpCallback: 'invoke_function',
		  url: 'http://ec2-184-73-109-163.compute-1.amazonaws.com/apiproxy/videos/?filter_type=Episode&filter_program=' + progID + '&fields=associated_images,videos,mediafiles',
//				  url: 'http://ec2-184-73-109-163.compute-1.amazonaws.com/apiproxy/videos/?filter_available_datetime__gt=2010-01-01&filter_program=' + progID + '&fields=associated_images,videos',
//				  url: 'http://ec2-184-73-109-163.compute-1.amazonaws.com/apiproxy/videos/?filter_expire_datetime__gt=' + today + '&filter_available_datetime__lt=' + today + '&filter_program=' + progID + '&fields=associated_images,videos',
				  success: function (e) {
			  loadProgramVideos( e );
		  },
		});
}

function loadProgramGuide() {
	$.ajax({
		  dataType: 'jsonp',
		  jsonp: 'json_callback',
		  jsonpCallback: 'invoke_function',
		  url: 'http://ec2-184-73-109-163.compute-1.amazonaws.com/apiproxy/programs/?fields=associated_images',
		  success: function (e) {
		      loadPrograms( e );
		  },
		});
}
