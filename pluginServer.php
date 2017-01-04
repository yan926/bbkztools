<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);
require_once('./global.php');

$vbulletin->input->clean_array_gpc('g', array(
  'product' => TYPE_ARRAY_NOHTML,
  'id'      => TYPE_ARRAY_INT
));

$products = array_filter($vbulletin->GPC['product']);
$ids = array_filter($vbulletin->GPC['id']);

if($products || $ids){
  array_walk($products, function (&$v, $k) { 
    $v = "product = '$v'";
  });
  array_walk($ids, function (&$v, $k) { 
    $v = "pluginid = $v";
  });

  $wherestr = implode(" OR ", array_filter(array(implode(" OR ", $products),implode(" OR ", $ids))));
  if($wherestr){
    $data = $vbulletin->db->query_read("SELECT * FROM vbb_plugin WHERE $wherestr order by product, pluginid");
    if($data){
      $o = array(); 
      while ($p = $vbulletin->db->fetch_array($data)){
        $o[] = array(
          'pluginid' => $p['pluginid'],
          'title'    => $p['title'],
          'hookname' => $p['hookname'],
          'product'  => $p['product'],
          'active'   => $p['active'],
          'executionorder' => $p['executionorder'],
          'phpcode'  => $p['phpcode']
        );
      }

      header('Content-type: application/json; charset=utf-8');
      echo json_encode($o);
    }
  }
}
?>