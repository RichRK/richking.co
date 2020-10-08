<?php

	// declare CSS file

	// header("Content-type: text/css");

	// select a random background image

	// $bg = array('bg-01.jpg', 'bg-03.jpg', 'bg-04.jpg', 'bg-05.jpg', 'bg-06.jpg', 'bg-07.jpg', 'bg-08.jpg', 'bg-09.jpg' );

	// $i = rand(0, count($bg)-1);
	// $selectedBg = "$bg[$i]";

?>
html {

	background: -moz-linear-gradient(top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%) fixed, url(/images/<?php echo $selectedBg; ?>) no-repeat center bottom fixed;
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0.7)), color-stop(100%,rgba(0,0,0,0.7))) fixed, url(/images/<?php echo $selectedBg; ?>) no-repeat center bottom fixed;
	background: -webkit-linear-gradient(top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/<?php echo $selectedBg; ?>) no-repeat center bottom fixed;
	background: -o-linear-gradient(top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/<?php echo $selectedBg; ?>) no-repeat center bottom fixed;
	background: -ms-linear-gradient(top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/<?php echo $selectedBg; ?>) no-repeat center bottom fixed;
	background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%) fixed, url(/images/<?php echo $selectedBg; ?>) no-repeat center bottom fixed;
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
}