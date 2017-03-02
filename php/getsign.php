<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wxf496e4930f15a229", "31cb33bfd740666ccb3f51efc7c5aad9");
$signPackage = $jssdk->GetSignPackage($_POST['url']);
echo json_encode($signPackage);
?>