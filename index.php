<!DOCTYPE html>
<html>
	<head>
		<!--[if lte IE 9]><script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/r29/html5.min.js"></script><![endif]-->
		<link href="/img/favicon.png" rel="icon" type="image/png" />
		<link rel="canonical" href="http://inventumdigital.com" />
		<link rel="home" href="http://inventumdigital.com" />
		<link rel="stylesheet" type="text/css" href="css/override.css" />
		<link rel="stylesheet" type="text/css" href="css/ui.css">
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		<meta name="Author" content="Inventum Digital, Inc." />
		<meta name="description" content="A creative digital agency with a specialty in digital design, video post-production, and website development services for businesses." />
		<meta name="keywords" content="agency,chicago,design,development,digital,invntm,media,post-production,production,video,visual,web" />
		<meta name="viewport" content="width=device-width, user-scalable=no" />
		<meta property="og:description" content="A creative digital agency with a specialty in digital design, video post-production, and website development services for businesses." />
		<meta property="og:image" content="http://inventumdigital.com/apple-touch-icon.png" />
		<meta property="og:locale" content="en_US" />
		<meta property="og:site_name" content="Inventum Digital" />
		<meta property="og:title" content="Inventum Digital" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="http://inventumdigital.com" />
		<style>#Spreads>*.Active{opacity:1}#Spreads>*:first-child{height:100%}#Spreads>*:first-child svg,#Spreads>*:last-child svg{max-width:384px;width:calc(100% - 128px)}#Spreads>*>*{text-align:center;display:table-cell;vertical-align:middle}#Spreads>*{display:table;height:100%;width:100%;transition:0.25s all ease-in-out;position:relative;opacity:0.125}#Spreads{height:100%;-webkit-overflow-scrolling:touch;font:400 16px/1.5 sans-serif}*{-webkit-text-size-adjust:none;-webkit-touch-callout:none;margin:0 auto;text-decoration:none;box-sizing:border-box;text-rendering:geometricPrecision}@viewport{width:device-width;zoom:1}a{color:inherit;font:inherit;pointer-events:auto}body,html,main{font:400 16px/1.5 sans-serif;color:#000;height:100%;width:100%;padding:0;margin:0}h1,h2,h3,h4,h5,h6{font-weight:100;margin:16px auto}h1{font-size:48px}h2{font-size:40px}h3{font-size:32px}h4{font-size:24px}h5{font-size:20px}h6{font-size:18px}
		body, html, main#Spreads {
		color: #000;
		background-color: #fff;
		}
		hr{
			margin: 8px auto;
		}
		</style>
		<title>Inventum Digital | CMS API</title>
	</head>
	<body>
		<background class="grid">
		</background>
		<main id="Spreads">
		<section id="Spreaditor" class="Active">
			<article>
				<p>
				<?php
$method = $_SERVER["REQUEST_METHOD"];
if($method == "GET"){
echo "<p>" . $method . " " . $uri . "<hr/></p>";
if($_SERVER["QUERY_STRING"]) {
$Qstring = $_SERVER["QUERY_STRING"];
echo "<p>" . $Qstring . "<hr/></p>";
}
$servername = "localhost";
$username="pavlovci_nvcms";
$password="public";
$dbname="pavlovci_nvcms";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
}
if($Qstring) $query = "SELECT * FROM test WHERE URL = \"$Qstring\""; // "=" or LIKE
else $query = "SELECT * FROM test";
$result = $conn->query($query);
if ($result->num_rows > 0) {// output data of each row
while($row = $result->fetch_assoc()){
// echo json_encode("URL:" . $row["URL"] . "Spreads:" . $row["Spreads"]);
// echo "<br>";
echo $row["Spreads"];
}
} else echo "No results";
$conn->close();
}else if ($method == "POST"){
$postBody = file_get_contents('php://input'); // POST body.
echo $postBody; // This works but needs to be sliced up to find "spreads" parameter and then pass into SQL query to write.
// if(!$spreadURLs || !$location) return false; // Not fully implemented so failsafe here.
// else {
// 	INSERT INTO  `pavlovci_nvcms`.`test` (
// 					`URL` ,
// 					`Spreads`
// 					)
// 					VALUES (
// 						`$location`,
// 						`$spreadURLs`
// 					);
// 	}
}

				?>
				</p>
				<form action="write.php" method="post">
					<input type="submit" style="display:none">
				</form>
			</article>
		</section>
		</main>
		<foreground />
		</script>
	</body>
</html>