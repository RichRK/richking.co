<?

// The $deliver variable is a spam-protection test. It's hidden from humans on the contact page, but bots will likely try to fill it out.

$requesterName = $_GET[ "your_name" ];
$replyTo = $_GET[ "your_email" ];
$message = $_GET[ "message" ];
$deliver = (string) $_GET[ "deliver" ];

$destinationEmail = "richardrking@pm.me";
$domainEmail = "contact@forms.richking.co";
$subject= "Message from: $requesterName";

$body = "

<html>
<head>
<title>Message from the richking.co contact form</title>
</head>
<body>

$message

<p>Reply address: $replyTo</p>

</body>
</html>";

$headers = "From: forms.richking.co <$domainEmail>\n";
$headers .= "Reply-To: $replyTo\n";
$headers .= "Content-type: text/html; charset=iso-8859-1";

// The if statement here is checking if the hidden field has been filled out. Possible values are 'Yes' or 'No' if filled out.
// We only want to send an email if this field has been left alone.

if ( strlen( $deliver ) < 1 ) {

	mail( $destinationEmail, $subject, $body, $headers);
}
	
header( "Location: ../thanks/" );

?>