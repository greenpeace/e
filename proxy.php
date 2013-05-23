<?php



define('GOOGLE_URL', 'https://docs.google.com/spreadsheet/pub?key=0Akl6Gd95yUsodFZkb0RtLXA1bTRtWkRyRjY2NUN4RWc&single=true&output=csv');



$gid = false;
if (isset($_GET['gid']) && is_numeric($_GET['gid'])) {
  $gid = $_GET['gid'];
}


if (!$gid) exit;


$file = './cache/'.$gid.'.json';


if (isset($_GET['ac']) && $_GET['ac'] == 'reload') {
  $url = GOOGLE_URL.'&gid='.$gid;
    
  $csv = file_get_contents($url);
  $array = array_map('str_getcsv', explode("\n", $csv));
  ob_start();    
  echo json_encode($array);
  $json = ob_get_contents();
  ob_end_clean();


  $tmp = $file . 'tmp';
  $f = fopen($tmp, 'w');
  if ($f) {
    fwrite($f, $json);
    fclose($f);
    rename($tmp, $file);
  }
}




if (file_exists($file)) {
  header('Content-Type: application/json; charset=UTF-8');
  readfile($file);
}