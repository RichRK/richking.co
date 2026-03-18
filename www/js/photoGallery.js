// prevents page reflow during image loading by assigning width values to images based on the viewport size

function preventReflow() {

	var documentHeight = $(window).height();
	var image100 = documentHeight / 100;
	var imageHeight = image100 * 75;
	var landscapeImageRatio = 1037 / imageHeight;
	var landscapeImageWidth = 1555 / landscapeImageRatio;
	var portraitImageRatio = 1037 / imageHeight;
	var portraitImageWidth = 691 / portraitImageRatio;

	$('.portrait').attr("width",portraitImageWidth);
	$('.landscape').attr("width",landscapeImageWidth);

}

preventReflow();

// disable middle mouse button scrolling

$('html').mousedown(function(e){if(e.button==1)return false;});

// creates array containing thumbnail positions

var thumbOffsets =[];

$.each($("#thumbnav a"), function() {
    thumbOffsets["#"+$(this).attr("id")] = $(this).offset().left;
});

// builds arrays containing position of landscape and portrait images in img list

var portraitIndex =[];
var landscapeIndex =[];

$(document).ready(function(){

		$('img').each(function(i, data) {

			if( $(data).hasClass('portrait') ) portraitIndex.push(i);
			else landscapeIndex.push(i);

		});

		portraitIndex = portraitIndex.map(function(x) { return x + 1; }); // add 1 to each array value (this not supported by IE8)
		landscapeIndex = landscapeIndex.map(function(x) { return x + 1; });

});

// calculates amount by which to offset anchor scroll locations in order to center images, accounting for viewport ratio and dimensions
// also calculates thumbnail offset locations for centering

var portraitOffset;
var landscapeOffset;
var viewportWidth;
var portraitWidth;
var landscapeWidth;
var viewportPortraitDifference;
var viewportLandscapeDifference;
var summaryWidth;
var summaryDifference;
var summaryOffset;

var halfViewport;
var viewport100th;
var viewport7;
var thumbAdjust;

function generateThumbOffsetValues() {

	viewportWidth = $(window).width();
	viewportHeight = $(window).height();
	halfViewport = viewportWidth / 2;
	viewport100th = viewportHeight / 100;
	viewport7 = viewport100th * 3.5;
	thumbAdjust = halfViewport - viewport7;

}

function generateOffsetValues() {
   
	portraitWidth = $("#wrapper .portrait").eq(0).width();

	if (portraitWidth === null) {

		portraitWidth = 0;
	}

	else {
	}

	portraitWidth = portraitWidth.toFixed();

	viewportWidth = $(window).width();

	viewportPortraitDifference = viewportWidth - portraitWidth;

	portraitOffset = viewportPortraitDifference / 2;

	landscapeWidth = $("#wrapper .landscape").eq(0).width();
	landscapeWidth = landscapeWidth.toFixed();

	viewportLandscapeDifference = viewportWidth - landscapeWidth;

	landscapeOffset = viewportLandscapeDifference / 2;

	summaryWidth = $("#wrapper #0").eq(0).width();
	summaryDifference = viewportWidth - summaryWidth;
	summaryOffset = summaryDifference / 2;

}

$(document).ready(function(){

	generateThumbOffsetValues();
	generateOffsetValues();

});

$(window).resize(function() {

	preventReflow();
	generateThumbOffsetValues();
	generateOffsetValues();

});

var setInt = window.setInterval(function(){

	generateThumbOffsetValues();
	generateOffsetValues();

}, 500);


$(window).load(function () {

	window.clearInterval(setInt);

});

// navigation

var currPhoto = 0; // sets the 'current photo' on page load (always the first)
var nextPhoto;
var prevPhoto;
var targetPhoto;
var thumbNum;
var totalPhotos = $('img').length; // fetches total number of photos on the page

currPhoto = parseInt(currPhoto, 10); // converts id to number from string

// thumbnail links

$('#thumbnav a').click(function() { // applies to all thumbnails

	currPhoto = $(this).index();

	currPhoto = parseInt(currPhoto, 10); // works out previous + next photo based on the current photo
	prevPhoto = currPhoto - 1;
	nextPhoto = currPhoto + 1;

	$("#leftArrowContainer").attr("href","#" + prevPhoto); // alters link href on arrows
	$("#rightArrowContainer").attr("href","#" + nextPhoto);

	if($(this).is(":first-child")){ // fades out left arrow if there are no previous photos (thumbnail nav)
		$("#leftArrow").animate({opacity:"0"},
			function() {
				$("#leftArrowContainer").css('visibility', 'hidden'); // removes clickability
			}
		);
	} 
	else {
		$("#leftArrowContainer").css('visibility', 'visible');
		$("#leftArrow").animate({opacity:"1"});
	}

	if($(this).is(":last-child")){ // fades out right arrow if there are no further photos (thumbnail nav)
		$("#rightArrow").animate({opacity:"0"},
			function() {
				$("#rightArrowContainer").css('visibility', 'hidden'); // removes clickability
			}
		);
	} 
	else {
		$("#rightArrowContainer").css('visibility', 'visible');
		$("#rightArrow").animate({opacity:"1"});
	}

	$("#thumbnav a .thumbnailContainer .currentPhoto").attr("class","currentPhoto");
	$(this).find(".currentPhoto").attr("class","currentPhoto visible");

	targetPhoto = $(this).attr('href');
	targetPhoto = (targetPhoto.substring(1, targetPhoto.length));
	targetPhoto = parseInt(targetPhoto, 10);

	var target="#"+$(this).attr("id");
    $("#thumbnav").animate({scrollLeft:thumbOffsets[target] - thumbAdjust},1000);

});

// arrow links

$('#leftArrowContainer').click(function() {

	currPhoto = parseInt(currPhoto, 10);
	currPhoto = currPhoto - 1;
	$("#leftArrowContainer").attr("href","#" + currPhoto);
	$("#rightArrowContainer").css('visibility', 'visible'); // reinstates clickability
	$("#rightArrow").animate({opacity:"1"}); // fades in right arrow when there are further photos (arrow nav)

	if (currPhoto <= 0) { // fades out left arrow if there are no more previous photos (arrow nav)
		$("#leftArrow").css('opacity', '0');
		$("#leftArrowContainer").css('visibility', 'hidden'); // removes clickability
	} 
	else {
	}

	thumbNum = currPhoto + 1;

	$("#thumbnav a .thumbnailContainer .currentPhoto").attr("class","currentPhoto");
	$("#thumbnav a:nth-child(" + thumbNum + ") .thumbnailContainer .currentPhoto").attr("class","currentPhoto visible");

	var target="#t"+ currPhoto;
    $("#thumbnav").animate({scrollLeft:thumbOffsets[target] - thumbAdjust},1000);

});

$('#rightArrowContainer').click(function() {

	currPhoto = parseInt(currPhoto, 10);
	currPhoto = currPhoto + 1;
	$("#rightArrowContainer").attr("href","#" + currPhoto);
	$("#leftArrowContainer").css('visibility', 'visible'); // reinstates clickability
	$("#leftArrow").animate({opacity:"1"}); // fades in left arrow when there are previous photos (arrow nav)

	if (currPhoto >= totalPhotos) { // fades out right arrow if there are no further photos (arrow nav)
		$("#rightArrow").css('opacity','0');
		$("#rightArrowContainer").css('visibility', 'hidden'); // removes clickability
	} 
	else {
	}

	thumbNum = currPhoto + 1;

	$("#thumbnav a .thumbnailContainer .currentPhoto").attr("class","currentPhoto");
	$("#thumbnav a:nth-child(" + thumbNum + ") .thumbnailContainer .currentPhoto").attr("class","currentPhoto visible");

	var target="#t"+ currPhoto;
    $("#thumbnav").animate({scrollLeft:thumbOffsets[target] - thumbAdjust},1000);

});

// smooth scrolling (thumbnav)

$(function() {

	$('#thumbnav a').click(function() {

		var target = $(this.hash);

			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			if (target.length) {

				if(jQuery.inArray(targetPhoto, portraitIndex)!==-1) {

					$('html,body').animate({

						scrollLeft: target.offset().left - portraitOffset

					}, 500);

					return false;
				}

				else if(jQuery.inArray(targetPhoto, landscapeIndex)!==-1) {

					$('html,body').animate({

					scrollLeft: target.offset().left - landscapeOffset

					}, 500);

					return false;

				}

				else {

					$('html,body').animate({

					scrollLeft: target.offset().left - summaryOffset

					}, 500);

					return false;
				}
			}
	});
});

// smooth scrolling (arrow nav)

$(function() {

	$('#arrows a').click(function() {

			var target = $(this.hash);

			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			if (target.length) {

				if(jQuery.inArray(currPhoto, portraitIndex)!==-1) {

					$('html,body').animate({

						scrollLeft: target.offset().left - portraitOffset

					}, 500);

					return false;
				
				}

				else if(jQuery.inArray(currPhoto, landscapeIndex)!==-1) {

					$('html,body').animate({

					scrollLeft: target.offset().left - landscapeOffset

					}, 500);

					return false;

				}

				else {

					$('html,body').animate({

					scrollLeft: target.offset().left - summaryOffset

					}, 500);

					return false;
				}
			}

	});
});

// triggers click of arrow divs on arrow key press

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: 		// left arrow key

        	if (currPhoto <= 0) { // enables if there are preceding photos
        	}
			else {
				$('#leftArrowContainer')[0].click();
			}

        break;

        case 39: 		// right arrow key

        	if (currPhoto >= totalPhotos) { // enables if there are more photos to come
			} 
			else {
				$('#rightArrowContainer')[0].click();
			}

        break;

        default: return;
    }
    e.preventDefault();
});