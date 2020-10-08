
$(document).ready(function(){

    var background = retrieveBackgroundFromLocalStorage();

    if ( !background ) {
        
        background = getRandomBackground();
        saveBackgroundToLocalStorage( background );
    }

    injectBackgroundIntoHtml( background );
});



function retrieveBackgroundFromLocalStorage() {

    if ( /* local storage has a background */ ) {

        return 'storedBackgroundId';
    }

    else {

        return null;
    }
};



function getRandomBackground() {

    // bg-02 is too dark for general use here but does get used elsewhere.

    var backgrounds = [
        
        'bg-01.jpg',
        'bg-03.jpg',
        'bg-04.jpg',
        'bg-05.jpg',
        'bg-06.jpg',
        'bg-07.jpg',
        'bg-08.jpg',
        'bg-09.jpg'
    ];

    chosenBackground = backgrounds[getRandomIntInclusive( 1, backgrounds.length )];

    return chosenBackground;
};



function getRandomIntInclusive( min, max ) {

    // Returns a random whole number between two numbers.
    // Both the minimum and maximum values are inclusive.

    min = Math.ceil( min );
    max = Math.floor( max );

    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}



function saveBackgroundToLocalStorage( background ) {


}



function injectBackgroundIntoHtml( background ) {

    
}

