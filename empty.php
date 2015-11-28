<?php

$url = "http://docent.cmi.hr.nl/bootb/restdemo/notes/";

$rawList = file_get_contents($url);
$notes = json_decode($rawList);
//deleteList($url, $notes);

function deleteList($url, $list)
{
  foreach ($list as $key => $item) {
    echo $item->id . ' ' . $item->title;
    $ch = curl_init();
    $curl_options = [
      CURLOPT_URL => $url + $item->id,
      CURLOPT_CUSTOMREQUEST => 'DELETE'
    ];
    curl_setopt_array($ch, $curl_options);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo ' ' . $httpCode . '<br/>';
    curl_close($ch);
  }
}

if (isset($_GET['id']) && !empty($_GET['id']))
{
  $ch = curl_init();
  $curl_options = [
    CURLOPT_URL => $url . $_GET['id'],
    CURLOPT_CUSTOMREQUEST => 'DELETE'
  ];
  curl_setopt_array($curl_options);
  $result = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  echo $_GET['id'] . ' ' . $httpCode;
  curl_close();
}
