var nwmlssanity = nwmlssanity || {};

(function() {
  var list_div = document.getElementsByClassName('Portal_Page')[0];
  var info_div = document.createElement('div');
  var detail_iframe = document.createElement('iframe');
  var map_iframe = document.createElement('iframe');
//  var hr = document.createElement('hr');
  var parentElement = list_div.parentElement;
  info_div.appendChild(detail_iframe);
  info_div.appendChild(map_iframe);

  parentElement.insertBefore(info_div, list_div);
  parentElement.style.height = 'auto';
  //parentElement.insertBefore(hr, list_div);

//  hr.className = 's_hr';

  info_div.className = 's_info';

  detail_iframe.className = 's_detail';
  detail_iframe.id = 's_detail';
  detail_iframe.contentDocument.body.innerText = 'detail';

  map_iframe.className = 's_map';
  map_iframe.id = 's_map';
  map_iframe.contentDocument.body.innerText = 'map';

  list_div.className = 's_list';
  list_div.id = 's_list';

}());
