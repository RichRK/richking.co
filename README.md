# richking.co

1. Need to ensure a redirect takes place if the user agent is from mobile or tablet.

Original PHP code was:


<?php

	$iphone = strpos($_SERVER['HTTP_USER_AGENT'],"iPhone");

	$ipad = strpos($_SERVER['HTTP_USER_AGENT'],"iPad");

	$android = strpos($_SERVER['HTTP_USER_AGENT'],"Android");

	$palmpre = strpos($_SERVER['HTTP_USER_AGENT'],"webOS");

	$berry = strpos($_SERVER['HTTP_USER_AGENT'],"BlackBerry");

	$ipod = strpos($_SERVER['HTTP_USER_AGENT'],"iPod");



	if ($iphone || $ipad || $android || $palmpre || $ipod || $berry == true) 

	{

	    echo "<script>window.location.replace('http://m.richking.co/');</script>";

	 }

?>

2. Do the random background better? Just disable it entirely and have it be consistent...?

3. Need to get the form submission working with Netlify's approach.
