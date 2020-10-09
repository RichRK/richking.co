
// This randomly chooses a background for use on all pages other than the home page.
// Once set, the background persists for 24 hours.

var backgrounds = [ 'bg-01.jpg', 'bg-03.jpg', 'bg-04.jpg', 'bg-05.jpg', 'bg-06.jpg', 'bg-07.jpg', 'bg-08.jpg', 'bg-09.jpg' ];



$( document ).ready( function() {

    injectBackgroundIntoPage( retrieveBackground() );
});



function injectBackgroundIntoPage( background ) {

    var styling = 'html { background: -moz-linear-gradient(top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%) fixed, url(/images/' + background + ') no-repeat center bottom fixed; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0.7)), color-stop(100%,rgba(0,0,0,0.7))) fixed, url(/images/' + background + ') no-repeat center bottom fixed; background: -webkit-linear-gradient(top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/' + background + ') no-repeat center bottom fixed; background: -ms-linear-gradient(top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/' + background + ') no-repeat center bottom fixed; background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/' + background + ') no-repeat center bottom fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; }';

    var styleTag = document.createElement( 'style' );
    styleTag.textContent = styling;

    document.head.append( styleTag );
}



function retrieveBackground() {

    var background = localStorage.getItem( 'background' ),
        dateIsValid = isDateValid( localStorage.getItem( 'backgroundDate' ));

    if ( dateIsValid && background != null ) {

        return background;
    }

    else { return getRandomBackground(); }
};



function isDateValid( storedDate ) {

    var currentDate = Date.now(),
        difference = currentDate - ( storedDate || 1 );

    if ( storedDate != null && difference < 86400000 ) {

        return true;
    }

    else { return false; }
}



function getRandomBackground() {

    background = backgrounds[ getRandomInt( 0, backgrounds.length ) ];

    saveBackgroundToLocalStorage( background );

    return background;
};



function getRandomInt( min, max ) {

    // Returns a random whole number between two numbers.
    // The minimum is inclusive, the maximum is not.

    min = Math.ceil( min );
    max = Math.floor( max );

    return Math.floor( Math.random() * ( max - min ) + min );
}



function saveBackgroundToLocalStorage( background ) {

    localStorage.setItem('background', background);
    localStorage.setItem('backgroundDate', Date.now() );
}

