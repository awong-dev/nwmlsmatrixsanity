var nwmlssanity = nwmlssanity || {};

(function() {
  var list_div = document.getElementsByClassName('Portal_Page')[0];
  var container_div = document.createElement('div');
  var info_div = document.createElement('div');
  var detail_iframe = document.createElement('iframe');
  var map_iframe = document.createElement('iframe');
  var parentElement = list_div.parentElement;
  var link_div = document.createElement('div');
  // We know the second one in the document has the interesting buttons.
  var link_bar = document.getElementsByClassName('LinkFunctionBar')[1];

  container_div.className = 's_container';
  container_div.id = 's_container';

  info_div.className = 's_info';
  info_div.id = 's_info';

  detail_iframe.className = 's_detail';
  detail_iframe.id = 's_detail';

  map_iframe.className = 's_map';
  map_iframe.id = 's_map';

  link_div.className = 's_links';
  link_div.id = 's_links';

  list_div.className = 's_list';
  list_div.id = 's_list';

  // Put it all in the right place.
  info_div.appendChild(detail_iframe);
  info_div.appendChild(map_iframe);

  link_div.appendChild(link_bar);

  parentElement.replaceChild(container_div, list_div);
  container_div.appendChild(info_div);
  container_div.appendChild(link_div);
  container_div.appendChild(list_div);

  parentElement.scrollIntoView(true);

}());
