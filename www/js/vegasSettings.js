// define the shuffle function

function shuffle(o){ //v1.0
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// define backgrounds array

var bgimages = [

	{ src:'/images/bg-01.jpg', fade:1500 },
	{ src:'/images/bg-02.jpg', fade:1500 },
	{ src:'/images/bg-03.jpg', fade:1500 },
	{ src:'/images/bg-04.jpg', fade:1500 },
	{ src:'/images/bg-05.jpg', fade:1500 },
	{ src:'/images/bg-06.jpg', fade:1500 },
	{ src:'/images/bg-07.jpg', fade:1500 },
	{ src:'/images/bg-08.jpg', fade:1500 },
	{ src:'/images/bg-09.jpg', fade:1500 }
]

// shuffle the array

randombgs = shuffle(bgimages);

// pass shuffled array to vegas

$(function() {

  	$.vegas('slideshow', {
  		delay:7000,
  		loading: false,
  		preload: true,
  		backgrounds: randombgs
	});

	$.vegas('overlay', {
		src:'/images/overlay.png',
		opacity: 0.05
	});
});