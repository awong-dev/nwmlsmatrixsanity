var nwmlssanity = nwmlssanity || {};

(function() {

function getPagingSpan(doc) {
  return doc.getElementById('_ctl0_m_pnlPagingSummaryTop').getElementsByClassName('pagingLinks')[0];
}

function clickElement(element, win, doc) {
  var click = doc.createEvent("MouseEvents");
  click.initMouseEvent("click", true, true, win,
    0, 0, 0, 0, 0,
    false, false, false, false,
    0, null);
  element.dispatchEvent(click);
}

function updateMap(nRecordId){
  var map_iframe = document.getElementById('s_map');
  var strMapPage="/Matrix/Public/InteractiveMapPopup.aspx";

  // These 3 variables seem to effectively be static in NWMLS.
  var nTableID = 1;
  var nLanguID = 1;
  var strPublic = '&pbs=1';

  map_iframe.src = strMapPage+"?RecordID="+nRecordId+"&TableID="+nTableID+"&L="+nLanguID+strPublic;
}

function updateDetail(page, entry) {
  // This is a total hack. We navigate the iframe, click the wanted link,
  // grab a ref to the wanted element, whack all the html on the page,
  // and then make that element the only one in the body.
  var detail_iframe = document.getElementById('s_detail');
  var click_entry = function() {
    // When the click is done, kill the navigation controls.
    detail_iframe.onload = function() {
      var real_details = detail_iframe.contentDocument.getElementById('_ctl0_m_pnlDisplay');
      detail_iframe.contentDocument.body.innerHTML = '';
      detail_iframe.contentDocument.body.appendChild(real_details);
    };

    // Do the click.
    console.log("detail page to entry " + entry);
    var inner_link = detail_iframe.contentDocument.getElementsByClassName('d111m6')[entry].getElementsByTagName('a')[0];
    clickElement(inner_link,
        detail_iframe.contentWindow,
        detail_iframe.contentDocument);
  };


  if (page != 1) {
    detail_iframe.onload = function() {
      var paging_span = getPagingSpan(detail_iframe.contentDocument);
      detail_iframe.onload = click_entry;
      clickElement(paging_span.children[page-1],
          detail_iframe.contentWindow,
          detail_iframe.contentDocument);
    };
  } else {
    detail_iframe.onload = click_entry;
  }

  detail_iframe.src = window.location.href;
}

function createMlsOnClick(map_record, page, entry) {
  return function() {
    updateMap(map_record);
    updateDetail(page, entry);
    return false;
  };
}

function interceptUI() {
  // Hide some stupid buttons.
  var photo_buttons = document.getElementsByClassName('d111m8');
  var map_buttons = document.getElementsByClassName('d111m9');
  var i = 0;
  for (i = 0; i < photo_buttons.length; i++) {
    photo_buttons[i].hidden = true;
  }
  for (i = 0; i < map_buttons.length; i++) {
    map_buttons[i].hidden = true;
  }

  // Find the current page:
  var current_page = getPagingSpan(document).getElementsByTagName('b')[0].innerText;
  current_page = current_page.split('[')[1];
  current_page = current_page.split(']')[0];
  console.log('current page: ' + current_page);

  // Fixup anchors to update panes rather than postback.
  var mls_entries = document.getElementsByClassName('singleLineDisplay');
  var mls_map_record_ids = [];
  for (i = 0; i < mls_entries.length; i++) {
    var entry = mls_entries[i];
    var href = entry.getElementsByClassName('d111m9')[0].getElementsByTagName('a')[0].href;
    // href looks like: "javascript:Dpy.mapPopup('57749205', 1, 1)" 
    // So if we want the number, we can do a split on single quotes.
    var map_record = href.split("'")[1];
    var mls_link_func = createMlsOnClick(map_record, current_page, i);

    if (i == 0) {
      mls_link_func();
    }

    // Fix up the anchor.
    var anchor = entry.getElementsByClassName('d111m6')[0].getElementsByTagName('a')[0];
    anchor.href = 'javascript:void(0);';
    anchor.addEventListener('click', mls_link_func);
  }
}

interceptUI();

}());
