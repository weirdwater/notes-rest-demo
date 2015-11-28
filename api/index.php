<?php

define('URL', 'http://docent.cmi.hro.nl/bootb/restdemo/notes/');
header('Content-Type: application/json');


if (isset($_GET['id']) && !empty($_GET['id']) && !is_nan($_GET['id'])) {
  $id = $_GET['id'];
  switch($_SERVER['REQUEST_METHOD']) {
    // GET /?id=5
    case 'GET':
      echo file_get_contents(URL . $id);
      exit;
    // PUT /?id=5
    case 'PUT':
      // TODO PUT given data to webservice
      http_response_code(501);
      echo '"error": {"status": "501", "message": "Not implemented"}';
      exit;
    // POST /?id=5
    case 'POST':
      http_response_code(405);
      echo '"error": {"status": "405", "message": "Method Not Allowed"}';
      exit;
    // DELETE /?id=5
    case 'DELETE':
      deleteNote($id);
      http_response_code(204);
      exit;
  }
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
  newNote();
}

// GET /
echo file_get_contents(URL);

function newNote()
{
  $post_data = [
    'author' => $_POST['author'],
    'title'  => $_POST['title'],
    'body'   => $_POST['body']
  ];

  $ch = curl_init();
  $curl_options = [
    CURLOPT_URL => URL,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => http_build_query($post_data),
    CURLOPT_RETURNTRANSFER => true
  ];
  curl_setopt_array($ch, $curl_options);
  $result = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  switch ($httpCode) {
    case 201:
      http_response_code(201);
      echo $result;
      break;
    case 400:
      http_response_code(400);
      $message = json_decode($result);
      echo '"error": {"status": "400", "message": "'.$message->message.'"}';
      break;
  }

  exit;
}

function deleteNote($id)
{
  $ch = curl_init();
  $curl_options = [
    CURLOPT_URL => URL . $id,
    CURLOPT_CUSTOMREQUEST => 'DELETE',
    CURLOPT_RETURNTRANSFER => true
  ];
  curl_setopt_array($ch, $curl_options);
  curl_exec($ch);
  curl_close($ch);
}
