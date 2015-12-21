<?php
$dir    = './';
$array = scandir($dir);
$count = count($array);
echo "[";
for ($i = 2; $i < $count; $i++) {
	if ($i >= 3) {
		echo ", ";
	}
echo '"' . $array[$i] . '"';
}
echo "]";
?>