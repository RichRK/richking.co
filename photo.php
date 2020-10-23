<?php
    include "php/background.php";
?>
<!DOCTYPE html>

<html>

	<head>

		<title>Rich King | Photo</title>

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

	<body id="photo">

		<img id="background" src="/images/dimmed/<?php echo $selectedBg; ?>">

		<div id="headerWrapper">

			<div id="header">

				<h1><a href="/">Rich King</a></h1>
				<h2><a href="/photo/">Photo</a></h2>

			</div>

		</div>

		<div id="wrapper">

			<div id="secondaryWrapper">

				<a href="/photo/nicaragua/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>Nicaragua</h3>

						</div>

					</div>

				</a>

				<a href="/photo/selection-weekend/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>Selection Weekend</h3>

						</div>

					</div>

				</a>

				<a href="/photo/la-cangreja/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>La Cangreja</h3>

						</div>

					</div>

				</a>

				<a href="/photo/empanada-night/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>Empanada Night</h3>

						</div>

					</div>

				</a>

				<a href="/photo/panama/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>Panama</h3>

						</div>

					</div>

				</a>

				<a href="/photo/san-lucas/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>San Lucas</h3>

						</div>

					</div>

				</a>

				<a href="/photo/wedding/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>Wedding</h3>

						</div>

					</div>

				</a>

				<a href="/photo/three-peaks/">

					<div class="albumContainer">

						<div class="albumTitleOverlay">

							<h3>Three Peaks</h3>

						</div>

					</div>

				</a>

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