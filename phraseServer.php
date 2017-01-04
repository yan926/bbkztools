<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);
require_once('./global.php');

$product = $vbulletin->input->clean_gpc('r','product', TYPE_STR);
if($product){
  $data = $vbulletin->db->query_read("SELECT fieldname, 
    P1.varname, P1.text, IFNULL(P2.text,'') as text_tc, IFNULL(P3.text,'') as text_sc
    FROM (SELECT varname, text, fieldname FROM vbb_phrase WHERE  product = '$product' AND languageid = -1 ORDER BY varname) P1 
    LEFT JOIN (SELECT varname, text FROM vbb_phrase WHERE product = '$product' AND languageid = 2 ) P2 
    ON P1.varname = P2.varname 
    LEFT JOIN (SELECT varname, text FROM vbb_phrase WHERE product = '$product' AND languageid = 1 ) P3 
    ON P1.varname = P3.varname 
    ORDER BY fieldname");
  if($data){
    $o = array(); 
    while ($p = $vbulletin->db->fetch_array($data)){
      $o[$p['fieldname']][] = array(
        'varname' => $p['varname'],
        'text'    => $p['text'],
        'text_sc' => $p['text_sc'],
        'text_tc' => $p['text_tc']
      );
    }

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($o);
  }
}
?>