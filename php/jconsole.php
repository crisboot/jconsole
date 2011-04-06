<?php 
/* Please configure this file to allow console commands*/

echo "Terminal commands are disabled please configure ./php/jconsole.php file.";die();


if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1'){ echo $_SERVER['REMOTE_ADDR']; die();}
 ob_start();
 if (!empty($_REQUEST['cmd'])){
	 $ff=$_REQUEST['cmd'];
	 #shell_exec($ff);
	 header('Content-Type: text/html; charset=ISO-8859-15');
	 system($ff,$retval);
	 //$str=iconv("windows-1250","UTF-8",$retval);
	 //echo htmlentities($str);
	 //echo htmlentities($retval);
	 #system($ff);
	 #exec($ff);
	 #passthru($ff);
 }

?>
