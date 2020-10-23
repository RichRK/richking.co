<?php
    include "php/background.php";
?>
<!DOCTYPE html>

<html>

	<head>

		<title>Rich King | Contact</title>

		<link rel="stylesheet" type="text/css" href="/css/mobile.css" />

		<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
		<link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">
		<link rel="icon" type="image/png" href="/favicon-160x160.png" sizes="160x160">
		<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
		<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
		<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">

		<meta name="apple-mobile-web-app-title" content="Rich King">
		<meta name="msapplication-TileColor" content="#191919">
		<meta name="msapplication-TileImage" content="/mstile-144x144.png">
		<meta name="application-name" content="Rich King">
		<meta name="viewport" content="initial-scale=1">

	</head>

	<body id="contact">

		<img id="background" src="/images/dimmed/<?php echo $selectedBg; ?>">

		<div id="headerWrapper">

			<div id="header">

				<h1><a href="/">Rich King</a></h1>
				<h2><a href="/contact/">Contact</a></h2>

			</div>

		</div>

		<div id="wrapper">

			<div id="secondaryWrapper">

				<form name="contactForm" action="/php/processForm.php" method="get">

					<label for="your_name">Name</label>
					<input name="your_name" type="text" spellcheck="false">

					<label for="your_email">Email</label>
					<input name="your_email" type="email" autocorrect="off" autocapitalize="off" spellcheck="false">

					<label for="message">Message</label>
					<textarea name="message"></textarea>

					<select id="deliver" name="deliver">

						<option value=""></option>
						<option value="Yes">Yes</option>
						<option value="No">No</option>

					</select>

					<input type="submit" onClick="submit();" alt="Submit" value="Send">

				</form>

			</div>

			<div id="nav">

				<ul>

					<li><a href="/photo/">Photo</a></li>
					<li><a href="/video/">Video</a></li>
					<li><a href="/contact/">Contact</a></li>

				</ul>

			</div>

		</div>

	</body>

</html>