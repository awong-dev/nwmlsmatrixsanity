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

function updateDetail(postback_target, postback_argument) {
  var detail_iframe = document.getElementById('s_detail');

  // All of the navigation is done via posting a mega form known as 'theForm'
  // with its __EVENTTARGET and __EVENTARGUMENT <input> tags set to the right
  // value.  The server side has a little closure of state that's kept in a
  // hidden <input> field.  Most of the other fields are left blank.
  //
  // We make a hack of this by cloning the top-level form on click,
  // injecting it into the iframe's document, and then submit it to get the
  // navigation we want.
  var cloned_form = document.forms[0].cloneNode();
  var input_elements = document.forms[0].getElementsByTagName('input');
  var i = 0;
  for (i = 0; i < input_elements.length; ++i) {
    var cloned_input = input_elements[i].cloneNode();
    if (cloned_input.name == '__EVENTTARGET') {
      cloned_input.value = postback_target;
    } else if (cloned_input.name == '__EVENTARGUMENT') {
      cloned_input.value = postback_argument;
    }
    cloned_form.appendChild(cloned_input);
  }

  var remove_controls = function() {
    detail_iframe.onload = null;
    var real_details = detail_iframe.contentDocument.getElementById('_ctl0_m_pnlDisplay');
    detail_iframe.contentDocument.body.innerHTML = '';
    detail_iframe.contentDocument.body.appendChild(real_details);
  };

  var navigate = function() {
    detail_iframe.onload = remove_controls;
    detail_iframe.contentDocument.body.appendChild(cloned_form);
    cloned_form.submit();
  };

  if (detail_iframe.contentWindow.location.origin == 'null' ||
      detail_iframe.contentWindow.location.origin == window.location.origin) {
    navigate();
  } else {
    detail_iframe.onload = navigate;
    detail_iframe.src = 'about:blank';
  }
}

function createMlsOnClick(map_record, postback_target, postback_argument) {
  return function() {
    updateMap(map_record);
    updateDetail(postback_target, postback_argument);
    return false;
  };
}

function interceptUI() {
  // Fixup anchors to update panes rather than postback.
  var mls_entries = document.getElementsByClassName('singleLineDisplay');
  var mls_map_record_ids = [];
  for (i = 0; i < mls_entries.length; i++) {
    var entry = mls_entries[i];

    // href looks like: "javascript:Dpy.mapPopup('57749205', 1, 1)" 
    // So if we want the number, we can do a split on single quotes.
    var map_href = entry.getElementsByClassName('d111m9')[0].getElementsByTagName('a')[0].href;
    var map_record = map_href.split("'")[1];

    // Find the post parameters. href looks like:
    // javascript:__doPostBack('_ctl0$m_DisplayCore','Redisplay|109,0')
    // The arguments correspond to input fields on theForm named
    // __EVENTTARGET, and __EVENTARGUMENT respectively.
    var anchor = entry.getElementsByClassName('d111m6')[0].getElementsByTagName('a')[0];
    var postback_re = /javascript:__doPostBack\('(.*)','(.*)'\)/;
    var matches = anchor.href.match(postback_re);
    var mls_link_func = createMlsOnClick(map_record, matches[1], matches[2]);

    // Fix up the anchor.
    anchor.href = 'javascript:void(0);';
    anchor.addEventListener('click', mls_link_func);

    if (i == 0) {
      mls_link_func();
    }
  }

  // After all the links have been harvested, hide some stupid buttons.
  var photo_buttons = document.getElementsByClassName('d111m8');
  var map_buttons = document.getElementsByClassName('d111m9');
  var i = 0;
  for (i = 0; i < photo_buttons.length; i++) {
    var b = photo_buttons[i];
    b.style.width = b.offsetWidth + 'px';
    b.style.height = b.offsetHeight + 'px';
    b.innerHTML='';
  }
  for (i = 0; i < map_buttons.length; i++) {
    var b = map_buttons[i];
    b.style.width = b.offsetWidth + 'px';
    b.style.height = b.offsetHeight + 'px';
    b.innerHTML='';
  }

  window.__doPostBack = function(a,b) { console.log('hi ' + a + ' ' + b); };

}

interceptUI();

}());
