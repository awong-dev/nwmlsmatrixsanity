var nwmlssanity = nwmlssanity || {};

(function() {
  var list_div = document.getElementsByClassName('Portal_Page')[0];
  var detail_div = document.createElement('iframe');
  var map_div = document.createElement('iframe');
  var parentElement = list_div.parentElement;
  parentElement.insertBefore(detail_div, list_div);
  parentElement.appendChild(map_div);

  detail_div.className = 's_detail';
  detail_div.id = 's_detail';
  detail_div.contentDocument.body.innerText = 'detail';

  map_div.className = 's_map';
  map_div.id = 's_map';
  map_div.contentDocument.body.innerText = 'map';

  list_div.className = 's_list';
  list_div.id = 's_list';

}());
