"use strict";




// Repository of frequently used functions.

function isSmallLayout() { if ( $( "html" ).css( "vertical-align" ) === "super" ) { return true; } else { return false; } }	// Hook so that JavaScript is aware of CSS media queries.

function currentPage() { return $( "body" ).data( "page" ) }

function scrollTo( position ) { $( "html,body" ).animate( { scrollTop: position }, "slow" ) }	// We have to use html AND body here because browsers differ in which they respond to.

function getOffset( elem ) { elem = elem.getBoundingClientRect(); return { "top": elem.top + window.scrollY, "left": elem.left + window.scrollX } }




// Repository of all event listeners tied to page elements.

// Listen for key presses.

$( document ).keyup( function( e ) { keyPressActions( e ) } );


// Listen for back or forward buttons being triggered.

window.addEventListener( "popstate", function( e ) { popstateTriggered( e ) } );


// Listens for the user requesting navigation.

$( "#navIcon" ).on( "click", function( e ) { openNav( true ); } );


// Listens for the user dismissing navigation.

$( "#pages i" ).on( "click", function( e ) { openNav( false ); } );


// Checks if the user is trying to navigate to the same page as the one they're currently on.

$( "#pages ul a" ).on( "click", function( e ) { scrollToTop( e ); } );


// Clears focus from buttons after they're clicked on.

$( "button" ).on( "click", function() { if ( document.activeElement.nodeName === "BUTTON" ) { document.activeElement.blur(); } } );


// Listens for clicks acknowledging the 'failure' feedback message (if form submission fails).

$( ".submission-response > button" ).on( "click", function( e ) { e.preventDefault(); dismissFormFailure(); } );


// Listens for clicks on the large down arrow on the home page, then gently scrolls users to the content section.

$( 'body[data-page="home"] header h1 i' ).on( "click", function( e ) { scrollTo( getOffset( $( "#content" )[0] ).top ) } );


// Listens for clicks on .entry elements on the portfolio page.

$( 'body[data-page="portfolio"] .entry' ).on( "click", function( e ) { storeElementInHistoryState( $( e.target ).data( "video-id" ) ); expandToFullscreen( $( e.target ) ); } );


// Listens for requests to close an opened .entry element, portfolio page.

$( 'body[data-page="portfolio"]' ).on( "click", ".entry.cloned i.top-right", function() { addBlankHistoryState(); contractFromFullscreen(); } );


// Plays embedded Vimeo video when the play button is clicked. Fetches video ID from the '.cloned' <div>.

$( 'body[data-page="portfolio"]' ).on( "click", ".playButton", function() { buildPlayerInstance( $( ".cloned" ).data( "video-id" ) ) } );


// Opens up the booking area.

$( 'body[data-page="bookings"] button.primary' ).on( "click", function( e ) { storeElementInHistoryState( $( e.target ).data( "video-id" ) ); expandToFullscreen( $( e.target ) ); } );


// Closes the booking area.

$( 'body[data-page="bookings"] form i.top-right' ).on( "click", function( e ) { addBlankHistoryState(); contractFromFullscreen( e ); } );


// Called when clicking on a jQuery UI select menu (on the bookings page only).

$( 'body[data-page="bookings"] label' ).on( "click", function( e ) { labelAssist( e ); } );


// Called when navigating through the questions on the bookings page.

$( 'body[data-page="bookings"] button.navigation' ).on( "click", function( e ) { changeQuestion( e ); } );


// Begins process of submitting the bookings page form.

$( 'body[data-page="bookings"] #submit-button' ).on( "click", fetchVals );


// Monitors <input> / <textarea> elements that have the .error class, so that class can be removed as soon as a value is entered.

$( 'body[data-page="bookings"] .question,body[data-page="contact"] form' ).find( "input,textarea,select option:selected" ).on( "input", function( e ) { $( e.target ).removeClass( "error" ); } )


// Begins process of submitting the contact page form.

$( 'body[data-page="contact"] form button.primary' ).on( "click", areFieldsFilled );




// Functions to run on ready.

$( function() {

	var currentYear = new Date().getFullYear();
	
	storeLayoutSize();	// i.e., which layout size did the page load using?
	waypointsLogic();

	if ( currentPage() === "home" ) {

		getCentre();
		listenForMousemove();
		listenForMouseleave();
	}

	if ( currentPage() === "bookings" ) {

		outputPossibleWeddingYears( currentYear );
		initialiseSelectMenus();
		calculateQuestionLength();
		addDropdownIcons();
	}

	outputCopyrightYear( currentYear );
});




// Functions to run on window resize.

$( window ).resize( function() {
	
	hasLayoutSizeChanged();

	if ( currentPage() === "home" ) {

		getCentre();
	}

	if ( currentPage() === "bookings" ) {

		closeSelectMenus();
	}
});




// Keeps a reference to the "previous" layout size.
// Boolean, but could be set up to keep track of more than two layout sizes.

function storeLayoutSize() {

	var html = $( "html" )[0];

	html.previousLayoutSize = isSmallLayout();
}




// Checks to see if the layout's size has changed.

function hasLayoutSizeChanged() {

	var newLayoutSize = isSmallLayout(),
		html = $( "html" )[0];

	if ( newLayoutSize !== html.previousLayoutSize ) {	// ...then the screen size has changed.

		checkForItemsToRemove();
		storeLayoutSize();
	}
}




// Checks for items to remove. (Called if the layout size changes.)

function checkForItemsToRemove() {

	var html = $( "html" )[0];

	if ( typeof html.stateChangeReference != "undefined" ) {	// If the array exists...

		$.each( html.stateChangeReference, function() {		// ...then for each item in the array...

			window[this]( false );	// ...run the corresponding function. (The strings in the array match function names.)
		});
	}
}




// Displays or hides the navigation bar.

function openNav( display ) {

	var elems = $( "nav,#navIcon,#pages" );
	
	if ( display === true ) {

		updateReferenceArray( "add", openNav.name );	// The second variable here is the function name.
		
		if ( isSmallLayout() ) {	// Actions differ depending on the layout size.

			elems.addClass( "narrow" );

			disableScrolling( true );
		}

		else {

			elems.addClass( "open" );

			$( "#pages" ).one( "mouseleave", function() { openNav( false ) });

			touchscreenTimeout();
		}

		$( "#pages" ).show();
	}

	else {

		updateReferenceArray( "remove", openNav.name );

		disableScrolling( false );

		elems.removeClass( "narrow" ).removeClass( "open" );

		// Clears a timeout set by touchscreenTimeout(), if there is one.

		clearTimeout( $( "#pages" )[0].timeout );
	}
}




// This causes the navigation menu to close after 3 seconds if no mouse movement is detected.
// Prevents menu staying open indefinitely on tablets.

function touchscreenTimeout() {

	function beginTimeout() {

		$( "#pages" )[0].timeout = setTimeout( function() {

			openNav( false );

		}, 3000 );
	}

	beginTimeout();

	$( "#pages" ).on( "mousemove", function() {

		clearTimeout( $( "#pages" )[0].timeout );

		beginTimeout();
	});
}




// Update the layout / state reference array if an item is added or removed.

function updateReferenceArray( addOrRemove, functionName ) {

	var h = $( "html" )[0];

	// Create an array if one doesn't already exist.
	// This array will store a reference to all CSS properties that are active and will need to be reset or removed if the type of layout changes.

	if ( typeof h.stateChangeReference === "undefined" ) {

		h.stateChangeReference = [];
	}

	if ( addOrRemove === "add" ) {

		h.stateChangeReference.push( functionName );	// Pushes the function name into the array.
	}

	else {

		var index = $.inArray( functionName, h.stateChangeReference );	// Searches for the index of the function name in the array...

		h.stateChangeReference.splice( index, 1 );	// ...and then deletes it.
	}
}




// Hides the scrollbar. Gets called from various places.

function disableScrolling( boolean ) {

	if ( boolean ) {

		// First we store the current page's scroll position.

		$( document ).data( "scrollPosition", $( document ).scrollTop() );

		// We temporarily disable the #content waypoint to prevent an animation jerk when we later re-enable scrolling.

		$( "#content" )[0].waypointInstance.disable();

		// We use setTimeout() to prevent the page jerking to the top before the navigation menu animation has completed.
		// CSS animation duration for this is 200ms.

		setTimeout( function() {

			$( "body" ).addClass( "noscroll" );

		}, 200 );
	}

	else {

		if ( $( "body" ).hasClass( "noscroll" ) ) {

			$( "body" ).removeClass( "noscroll" );

			$( "html,body" ).scrollTop( $( document ).data( "scrollPosition" ) );

			// Re-enable the waypoint we disabled.

			$( "#content" )[0].waypointInstance.enable();
		}
	}	
}




// Listens for mousemove events on the document. Used on the homepage to animate the logo.

function listenForMousemove() {

	$( document ).mousemove( function( e ) {
		
		compareMouseWithCentre( e.pageX, e.pageY );
	});
}




// Listen for mouseleave events on the document. 'Mouseleave' prevents event capturing on child elements, in contrast to 'mouseout'.

function listenForMouseleave() {

	$( document ).on( "mouseleave", function() {
		
		resetBox();
	});
}




// Fetch the x and y coordinates of the viewport's centre.

function getCentre() {

	var elem = $( "body > header" )[0];
	
	elem.viewportWidth = document.documentElement.clientWidth;
	elem.viewportHeight = document.documentElement.clientHeight;
	
	elem.centreFromTop = Math.round( elem.viewportHeight / 2 );
	elem.centreFromLeft = Math.round( elem.viewportWidth / 2 );
}




// Check to see the percentage by which the mouse cursor is to the left / right / top / bottom of centre.

function compareMouseWithCentre( mouseX, mouseY ) {
	
	var top,
		bottom,
		left,
		right,
		elem = $( "body > header" )[0];
	
	// X coordinates.
	
	if ( mouseX < elem.centreFromLeft ) {	// We're on the left.
		
		left = Math.round( 100 - ( ( mouseX / elem.centreFromLeft ) * 100 ) );	// This quadrant's percentage position is calculated, then the percentage is inverted.
	}
		
	else {	// We're on the right.
		
		right = Math.round( ( ( mouseX - elem.centreFromLeft ) / ( elem.viewportWidth - elem.centreFromLeft ) * 100 ) );	// Percentage is calculated by "setting centre as zero".
	}
	
	// Y coordinates.
	
	if ( mouseY < elem.centreFromTop ) {	// We're at the top.
		
		top = Math.round( 100 - ( ( mouseY / elem.centreFromTop ) * 100 ) );
	}
		
	else {	// We're at the bottom.
		
		bottom = Math.round( ( ( mouseY - elem.centreFromTop ) / ( elem.viewportHeight - elem.centreFromTop ) * 100 ) );
	}
	
	// Group all of this together in a single object.
	
	var percentages = { "left": left, "right": right, "top": top, "bottom": bottom };
	
	animateBox( percentages );
}




// Animates the centre box according to the position of the mouse cursor.

function animateBox( percentages ) {

	var logo = $( "#logo" ), modifier = 0.05;
	
	if ( percentages.left ) {	// From this existance of this we can deduce left AND right.
		
		logo.css( { marginLeft: ( percentages.left * modifier ) + "px" } );	// Box movement is adjusted by a modifier in order to produce a gentler effect.
	}
	
	else {
		
		logo.css( { marginLeft: "-" + ( percentages.right * modifier ) + "px" } );
	}
	
	if ( percentages.top ) {
		
		logo.css( { marginTop: ( percentages.top * modifier ) + "px" } );
	}
	
	else {
		
		logo.css( { marginTop: "-" + (percentages.bottom * modifier ) + "px" } );
	}
}




// Resets the centre box back to the centre of the viewport — when the mouse leaves the window, for example.
// jQuery .animate is used (rather than a CSS transition) because a css transition would fire every time animateBox() gets called.

function resetBox() {
	
	$( "#logo" ).animate( { marginLeft: 0, marginTop: 0 }, { queue: false } );
}




// Uses Waypoints.js to trigger functions once elements are scrolled to.

function waypointsLogic() {

	$( "#content" )[0].waypointInstance = new Waypoint({

		// When the top of the viewport reaches 175px above the #content div, apply CSS rules to move the navigation

		element: $( "#content" ),
		offset: 175,
		handler: function( direction ) {

			if ( direction === "down" ) {

				$( "#navIcon" ).removeClass( "unscrolled" ).addClass( "scrolled" );
			}

			else {

				$( "#navIcon" ).removeClass( "scrolled" ).addClass( "unscrolled" );
			}
		}
	})
}




// Actions to be taken when the user tries to navigate to the page they're already on

function scrollToTop( e ) {

	var pageRequested = $( e.target ).children( "li" ).text().toLowerCase();

	// If we're on the same page as the one requested...

	if ( currentPage() === pageRequested ) {

		// Prevent the link from working...

		e.preventDefault();

		openNav( false );

		scrollTo( 0 );
	}
}




// Use jQuery UI to slightly customise the <select> menus on the bookings page.

function initialiseSelectMenus() {

	$( "select" ).selectmenu();

	listenForSelectClicks();
}




function listenForSelectClicks() {

	$( 'body[data-page="bookings"] .question,body[data-page="contact"] form' ).find( "select + span" ).on( "click", function() { $( ".question.visibleF select + span" ).removeClass( "error" ); } );
}




// Calculates the number of questions in the form and labels #total-questions accordingly. Also sets progress bar percentage.

function calculateQuestionLength() {

	var startingPercentage = Math.round( 100 / numberOfQuestions() );

	$( "#total-questions" ).text( numberOfQuestions() );
	$( "#progress" ).css( "width", startingPercentage + "%" );
}




// Works out how many questions the form is composed of.

function numberOfQuestions() { return $( ".question" ).length }




// Adds arrows to the jQuery UI drop-down menus. (Instead of using their large-in-file-size icon image.)

function addDropdownIcons() {

	$( "span.ui-button" ).append( '<i class="material-icons">arrow_drop_down</i>' );
}




// Closes jQuery UI <select> menus on resize, because they don't reposition themselves correctly.

function closeSelectMenus() {

	$( ".question select" ).selectmenu( "close" );
}




// Handles navigation within the form area.

function changeQuestion( e ) {

	function isNextButton( e ) {

		if ( $( e.target).attr( "id" ) === "next-button" ) { return true; }

		else { return false; }
	}

	var currentQuestion = $( ".question" ).index( $( ".question.visibleF" ) ),	// Returns the zero-based index of the current .visibleF question.
		nextQuestion = $( ".question" ).get( currentQuestion + 1 ),
		prevQuestion = $( ".question" ).get( currentQuestion - 1 ),
		newQuestion;

	// Before we do anything, check that the user actually entered some information.
	// We don't want to let them proceed if the field is blank.
	// We only want this check to apply when clicking the next button.

	if ( isNextButton( e ) === true ) {

		if ( isFieldFilled( e, currentQuestion ) != true ) {

			return;
		}
	}

	hideCurrentQuestion();

	// If the next button was clicked...

	if ( isNextButton( e ) === true ) {

		$( nextQuestion ).addClass( "visibleF" );	// Request the next question.

		newQuestion =  currentQuestion + 1;
	}

	else {	// The previous button was clicked, so request the previous question.

		$( prevQuestion ).addClass( "visibleF" );	

		newQuestion =  currentQuestion - 1;
	}

	// Hide or display buttons depending on the question we're on

	updatePreviousButton( newQuestion );

	updateNextDoneButtons( newQuestion );

	updateProgressBar( newQuestion + 1 );	// + 1 is adjusting for zero-based number.
}




// Hides whatever the currently visible question is.

function hideCurrentQuestion() {

	$( ".question.visibleF" ).removeClass( "visibleF" );
}




// Hide or display 'previous' button depending on question position

function updatePreviousButton( newQuestion ) {

	if ( newQuestion >= 1 ) {

		$( "#previous-button" ).addClass( "clickable" );
	}

	else {

		$( "#previous-button" ).removeClass( "clickable" );
	}
}




// Hide or display 'next' and 'done' buttons depending on question position

function updateNextDoneButtons( newQuestion ) {

	if ( newQuestion === numberOfQuestions() - 1 ) {

		$( "#next-button" ).addClass( "hidden" );
		$( "#submit-button" ).addClass( "visibleB" );
	}

	else {

		$( "#next-button" ).removeClass( "hidden" );
		$( "#submit-button" ).removeClass( "visibleB" );
	}
}




// Check to see if the field on the current question has some information in it.
// This function isn't actually called for the final question (because this is only called on the 'previous' or 'next' buttons), but this final question is the only optional one anyway so it doesn't matter.

function isFieldFilled( e, currentQuestion ) {

	// This finds the input / textarea / option of the current question, then checks how long the data inside it is.

	var childElem = $( $( ".question" ).get( currentQuestion ) ).find( "input,textarea,select option:selected" ),
		selectElem = childElem.parent( "select" ).siblings( "span" );

	if ( childElem.val().length > 0 ) {

		childElem.removeClass( "error" );
		selectElem.removeClass( "error" );

		return true;
	}

	else {

		childElem.addClass( "error" );
		selectElem.addClass( "error" );

		return false;
	}
}




// Adjusts the width of the progress bar.

function updateProgressBar( newPosition ) {

	var newPercentage = ( 100 / numberOfQuestions() ) * newPosition;

	$( "#progress" ).css( "width", newPercentage + "%" );
}




// Resets the bookings form after successful submission to the server.

function resetQuestions() {

	hideCurrentQuestion();

	$( $( ".question" ).get( 0 ) ).addClass( "visibleF" );

	updateProgressBar( 1 );
	updatePreviousButton( 0 );
	updateNextDoneButtons( 0 );
}




// Clones the element that was selected in order to animate a smooth transition to an open state.
// Also called by back and forward navigation if popstateTriggered() is called.

function expandToFullscreen( elem, scrollPos ) {

	// If a scroll position has been included, we need scroll there before performing calculations.
	// Used when called by popstateTriggered().

	if ( scrollPos != null ) {

		scrollTo( scrollPos );
	}

	// Then we create a clone of the element that's been passed to this function.
	// We also take note of the original element's position.

	var clone = elem.clone(),
		position = elem[0].getBoundingClientRect();

	// Here we prevent multiple requests.

	$( ".segment .entry" ).addClass( "no-pointer-events" );

	// Here we prepare the clone to be reinserted into the page.

	clone.addClass( "cloned" );
	clone.removeClass( "no-pointer-events" );
	clone.css( { "top" : position.top, "left" : position.left, "width" : position.width, "height" : position.height } );
	clone.prependTo( "body" );

	// Perform these actions before we start animating.

	expandPreAnimationChecks();

	// Normally when we disable scrolling, the function delays 200ms before doing so.
	// This is so the scrollbar disappears mid-animation, which hides the jarring behaviour of the viewport width's sudden slight widening.
	// However, if we stick with that regular delay in this function (when animating to fullscreen) we see the whole document scroll to the top in the background.
	// This is a side effect of disabling scrolling on an element — the element returns to the top.
	// To counteract this, we have to delay the scrollbar removal further, in this case by another 140ms.
	// That's about the right number when the system that has enough resources to be animating smoothly.

	setTimeout( function() {

		disableScrolling( true );

	}, 140 )

	// We animate the clone to a fullscreen position.

	$( ".cloned i" ).fadeIn();
	$( ".cloned" ).animate( { "top" : "0", "left" : "0", "width" : "100%", "height" : "100%" }, function() {

		// Actions are called once the animation has completed.

		expandPostAnimationChecks( clone );
	});

	// Finally we store a reference to the original element on the clone.

	$( ".cloned" ).data( elem );
}




// Actions to take before animation begins when expanding an element to fullscreen.

function expandPreAnimationChecks() {

	if ( currentPage() === "portfolio" ) {

		$( ".cloned .metadata" ).fadeOut();
	}
}




// Actions to take after animation ends when expanding an element to fullscreen.

function expandPostAnimationChecks( clone ) {

	// We attach a 'done' class here to allow CSS styles to take effect after the animation.

	if ( currentPage() === "portfolio" ) {

		clone.addClass( "done" );
		clone.find( ".player" ).fadeIn();
	}

	else if ( currentPage() === "bookings" ) {

		$( "form" ).addClass( "fullscreen" );
	}
}




// Closes and removes the cloned .entry element.

function contractFromFullscreen() {

	// We need to re-enable scrolling before doing anything else, otherwise all measurements get thrown off.

	disableScrolling( false );

	var origElem = $( ".cloned" ).data(),
		position = origElem[0].getBoundingClientRect();

	$( ".cloned i" ).fadeOut();

	contractPreAnimationChecks();

	$( ".cloned" ).animate( { "top" : position.top, "left" : position.left, "width" : position.width, "height" : position.height }, function() {

		$( ".cloned" ).remove();
		$( ".segment .entry" ).removeClass( "no-pointer-events" );
	});
}




// Actions to take before animation begins when contracting an element from fullscreen.

function contractPreAnimationChecks() {

	if ( currentPage() === "portfolio" ) {

		$( ".cloned .player" ).fadeOut();
	}

	if ( currentPage() === "bookings" ) {

		$( "form" ).removeClass( "fullscreen" );
	}
}




// Here we build an instance of the Vimeo player.
// It's called when an .entry <div> with a video-id is opened.

function buildPlayerInstance( videoID ) {

	// First we give the .player <div> an 'id' attribute.

	$( ".player" ).attr( "id", videoID );

	// Then we create an instance of the player.
	// The 'videoID' in the first line specifies the ID of the element that the player uses as a container.
	// toString() is needed because Vimeo doesn't accept the ID as a number.

	$( ".cloned" )[0].player = new Vimeo.Player( videoID.toString(), {

		id: videoID,
		width: 400,
		title: false,
		byline: false,
		portrait: false,
		color: "ffffff",
		autoplay: true,
		loop: true
	});
}




// Outputs the current year for the copyright notice at the bottom of each page.

function outputCopyrightYear( currentYear ) {

	$( ".currentYear" ).text( currentYear );
}




// Populates the bookings form with possible wedding years.

function outputPossibleWeddingYears( currentYear ) {

	var years = [ currentYear ],
		yearsToGenerate = $( 'select[name="year"] option' ).length - 2;

	// 'yearsToGenerate' has subtracted two because the first <option> is blank and the second one will contains the current year — which already exists in the array.

	for ( var i = 0; i < yearsToGenerate; i++ ) {

		// Each iteration adds a new year to the array, each incremented one more than the last.

		years.push( years[years.length - 1] + 1 );
	}

	$.each( $( 'select[name="year"] option:not(:selected)' ), function( i ) {

		$( this ).val( years[i] );
		$( this ).text( years[i] );
	})
}




// Addresses shortcomings with jQuery UI's <select> replacements, when wrapped in a label.
// e.target is the <h2> tag.

function labelAssist( e ) {

	if ( $( e.target ).siblings( "select" ).length > 0 ) {	// If a <select> element exists...

		$( e.target ).siblings( "span" ).click();	// ...click it.
	}

	else if ( $( e.target ).children( "select" ).length > 0 ) {

		$( e.target ).children( "span" ).click();
	}
}




// Checks to see if all the fields on the contact form have been filled out.

function areFieldsFilled() {

	var failed;

	$.each( $( "form input,form textarea" ), function() {

		if ( $( this ).val().length === 0 ) {

			$( this ).addClass( "error" );

			failed = true;
		}
	});

	if ( !failed ) {

		fetchVals();
	}
}




// Begins the process of submitting form information to the server.
// Places field names and field user input into two separate arrays.
// 'encodeURIComponent' encodes special characters for security.

function fetchVals() {

	$( "form section, form > button, form > h6, #question-container, #controls-container" ).addClass( "faded" );

	function checkIfBlank( field ) {	// This is for <option> elements. Grabs the name of the parent <select> instead.

		if ( field.name === undefined || field.name.length === 0 ) {

			return $( field ).parent( "select" ).attr( "name" );
		}

		else { return field.name; }
	}

	var properties = [],
		values = [];

	// Pulls values from each element containing user data.
	// We exclude all <input> elements that are checkboxes.

	$.each( $( 'input:not([type="checkbox"]),textarea,select option:selected' ), function( i ) {

		properties[i] = encodeURIComponent( checkIfBlank( this ) );
		values[i] = encodeURIComponent( this.value );
	});

	prepareString( properties, values );
}




// Generates a string containing all the form parameters, e.g. 'firstname=John&lastname=Smith'.

function prepareString( properties, values ) {

	// We set an empty string to prevent 'undefined' appearing in the string.

	var XHRstring = "";

	$.each( properties, function( i ) {

		XHRstring += properties[i] += "=";
		XHRstring += values[i] += "&";
	})

	// Remove an extraneous ampersand from the end of the string.

	XHRstring = XHRstring.slice( 0, -1 );

	sendData( XHRstring);
}




// Here we're sending a prepared string to the server.
// XMLHttpRequest performs an AJAX POST operation.

function sendData( XHRstring ) {

	var xhr = new XMLHttpRequest(),
		url = '/' + currentPage() + '/';

	xhr.open( 'POST', url, true );
	xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
	xhr.send( XHRstring );

	// Now we listen to responses and determine whether the whole operation succeeded.

	xhr.onreadystatechange = function() {

		if ( xhr.readyState === 4 ) {

			// First we're checking to see if the string was sent correctly.

			if ( xhr.status != 200 ) {

				formFailure();
			}

			else { formSuccess(); }
		}
	}
}




// The form was submitted successfully — we'll inform the user so they have confirmation.

function formSuccess() {

	$( ".submission-response" ).removeClass( "failure" ).addClass( "success" );

	// Here we make the clear field values and display a confirmation message.
	// We add a delay to give the user time to take in the information.

	setTimeout( function() {

		$( "form section, form > button, form > h6, #question-container, #controls-container" ).removeClass( "faded" );
		$( "input, textarea" ).val( "" );

		$( ".submission-response" ).removeClass( "success" );

		if ( currentPage() === "bookings" ) {

			resetQuestions();
			contractFromFullscreen();
		}

	}, 1500 );
}




// Something failed somewhere. We'll let the user know without going into detail, while inviting them to try again.

function formFailure( response ) {

	$( ".submission-response" ).removeClass( "success" ).addClass( "failure" );

	console.log( response );
}




// Removes the failure message once the user has acknowledged it.

function dismissFormFailure() {

	$( "form section, form > button, form > h6, #question-container, #controls-container" ).removeClass( "faded" );

	$( ".submission-response" ).removeClass( "failure" );
}




// Creates (or replaces) an entry in the history. This prevents people being accidentally returned to the home page after they open a fullscreen overlay.
// (At the time of writing, there are only two places where fullscreen overlays are used: entries in the portfolio and for the bookings page button.)

function storeElementInHistoryState( elem ) {

	// We create an object with a reference to the intiating element.
	// It also stores the current scroll position of the page.

	var details = { elem: elem, scrollPos: $( "html" ).scrollTop() };

	// Here we're just checking that we're not creating two back-to-back states that both reference elements.
	// When that happens, UI transitions suffer.

	if ( window.history.state === null ) {

		window.history.pushState( details, null, null );
	}

	else {

		window.history.replaceState( details, null, null );
	}
}




// Adds a history state for the current page, referencing nothing.
// Called if a user clicks on the UI close button rather than using the browser back button.

function addBlankHistoryState() {

	window.history.pushState( null, null, null );
}




// These actions run if back or forward navigation is triggered ('popstate').

function popstateTriggered( e ) {

	var elem;

	// If there's no element referenced by the history item, then we know a fullscreen overlay is open (and we want to close it).

	if ( e.state === null ) {

		contractFromFullscreen();
	}

	// Otherwise we retrieve the history state's referenced element, previously created by storeElementInHistoryState().
	// This is used to determine which video we need to return to.

	else {

		if ( currentPage() === "portfolio" ) {

			elem = $( '.entry[data-video-id="' + e.state.elem + '"]' );
		}

		else if ( currentPage() === "bookings" ) {

			// The bookings page only has one possibility, so we don't need to find it — just reference it correctly.

			elem = $( "button.primary" );
		}

		expandToFullscreen( elem, e.state.scrollPos );
	}
}




// Actions to take when key presses are detected.

function keyPressActions( e ) {

	// 	We're checking that...
	//
	// 	1: We're on the bookings page.
	// 	2: The enter key is being pressed.
	// 	3: The booking form is open.

	if ( currentPage() === "bookings" && e.keyCode === 13 && $( "body > button" ).hasClass( "cloned" ) ) {

		var input = $( '.question.visibleF input:not([type="checkbox"])' ),
			select = $( ".question.visibleF label > span" ),
			span = $( ".question.visibleF select option:selected" );

		// Now we're checking to see if the <input> element on the current question has focus.

		if ( input.is( ":focus" ) ) {

			// And is there something in the field?

			if ( input.val().length > 0 ) {

				$( "#next-button" ).click();
			}

			else {

				input.addClass( "error" );
			}
		}

		else if ( select.is( ":focus" ) ) {

			if ( span.val().length > 0 ) {

				$( "#next-button" ).click();
			}

			else {

				select.addClass( "error" );
			}
		}
	}
}