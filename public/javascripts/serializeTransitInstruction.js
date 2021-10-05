/* eslint-disable */

function cipherDeCrypt(key1, key3, cipheredPass) {
  const key = `${key1}g~zdY65${key3}`;
  const bytes = CryptoJS.AES.decrypt(cipheredPass, key);
  const osmUserPass = bytes.toString(CryptoJS.enc.Utf8);
  return osmUserPass;
}

function displayAPICallError(error) {
  window.alert('Error during Private OSM API.', error);
  return;
}

function onSuccessDisplay(result) {
  const username = document.getElementById('osmUsername').value;
  const password = cipherDeCrypt(document.getElementById('cipherKey1').value, JSON.stringify(document.getElementById('createdAt').value), document.getElementById('osmUserCipher').value);
  const urlBase =  document.getElementById('osmEndpoint').value;
  const urlAPI = '/api/0.6/notes';

  const mapNoteExistOpen = typeof result !== undefined && 
    result.getElementsByTagName('id').length !== 0 &&
    result.getElementsByTagName('status')[0].innerHTML === 'open';

  const mapNoteExistClosed = typeof result !== undefined && 
    result.getElementsByTagName('id').length !== 0 &&
    result.getElementsByTagName('status')[0].innerHTML === 'closed';

  const noMapnote = typeof result !== undefined && 
    result.getElementsByTagName('id').length === 0 ;

  if (mapNoteExistOpen) {
    window.alert('Open Map Note ID:' + result.getElementsByTagName('id')[0].innerHTML + ', Exists at this Location. Please close the Map Note and try again');
    window.close();
    return;
  } else if (mapNoteExistClosed) {
    if (window.confirm('Closed Map Note ID:' + result.getElementsByTagName('id')[0].innerHTML + ', Exists. Would you like to ReOpen and append to it?')) {
      $.ajax({
        url: urlBase + urlAPI + '/'+ result.getElementsByTagName('id')[0].innerHTML + '/reopen', 
        type: 'POST',
        dataType: 'xml',
        headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) },
        data: { text: document.getElementById('mapNote').value, },
        success: (resultReopen) => { 
          document.getElementById('mapNoteId').value = resultReopen.getElementsByTagName("id")[0].innerHTML;
          window.alert('Map Note Reopened and Comment Appended');
        },
        error: displayAPICallError,
      });
    } else {
      window.close();
    }
  } else if (noMapnote) {
    $.ajax({
      url: urlBase + urlAPI, 
      type: 'POST',
      dataType: 'xml',
      headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) },
      data: {
        lat: document.getElementById('latitude').value, 
        lon: document.getElementById('longitude').value, 
        text: document.getElementById('mapNote').value, 
      },
      success: (result) => { 
        document.getElementById('mapNoteId').value = result.getElementsByTagName("id")[0].innerHTML;
        window.alert('Map Note Created');
      },
      error: displayAPICallError,
    });
  } else {
    window.alert('Error calling API');
  }
  
}

function findReadWriteReopenMapNote(latitude, longitude) {
  const username = document.getElementById('osmUsername').value;
  const password = cipherDeCrypt(document.getElementById('cipherKey1').value, JSON.stringify(document.getElementById('createdAt').value), document.getElementById('osmUserCipher').value);
  const  urlBase =  document.getElementById('osmEndpoint').value;
  const  urlAPI = '/api/0.6/notes';

  // Calculate 10x10 meter bbox around the given coordinate https://en.wikipedia.org/wiki/Haversine_formula
  const diffLatitude  = (0.005 / 6378) * (180 / Math.PI);
  const diffLongitude = (0.005 / 6378) * (180 / Math.PI) / Math.cos(parseFloat(latitude) * Math.PI/180);

  const largerLatitude = (parseFloat(latitude) + diffLatitude).toString();
  const largerLongitude = (parseFloat(longitude) + diffLongitude).toString();
  const smallerLatitude = (parseFloat(latitude) - diffLatitude).toString();
  const smallerLongitude = (parseFloat(longitude) - diffLongitude).toString();

  const attributes = {
    bbox: smallerLongitude + ',' + smallerLatitude + ',' + largerLongitude + ',' + largerLatitude,
    limit: 1,
    closed: 7
  };

  
  const response = apicall(onSuccessDisplay); // Success callback async method https://stackify.com/return-ajax-response-asynchronous-javascript-call/

  function apicall(callback) {
    $.ajax({
      url: urlBase + urlAPI,
      type: 'GET',
      dataType: 'xml',
      headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) },
      data: attributes,
      success: callback,
      error: displayAPICallError,
    });
    
  }
  return response;
}

function saveFieldReview(data, url) {
  const username = document.getElementById('osmUsername').value;
  const password = cipherDeCrypt(document.getElementById('cipherKey1').value, JSON.stringify(document.getElementById('createdAt').value), document.getElementById('osmUserCipher').value);
  const urlBase =  document.getElementById('osmEndpoint').value;
  let urlAPI = '/api/0.6/notes';
  let attributes;

  function apicallAddComment(callback) {
    $.ajax({
      url: urlBase + urlAPI,
      type: 'POST',
      dataType: 'xml',
      headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) },
      data: attributes,
      success: callback,
      error: displayAPICallError,
    });
    
  }

  if (data === undefined) {
    window.alert('No Data to Save/Update');
    return;
  } else {
    $.post(url, {fieldReviewData: data
    }, function(data, status, xhr) {
      urlAPI = urlAPI + '/' + data.mapNoteId + '/comment';
      attributes = { text: 'Field-Review-ID: ' + data.newFieldReviewID };
      apicallAddComment((result)=> {return result;}); // Adds mapNote comment with new Field Review ID
      window.alert(data.s_status + ": " + status);
      document.getElementById('createBtn').disabled = true;
    });
  }
}

function saveTransitInstruction(data, url) {
  if (data === undefined) {
    window.alert('No Data to Save/Update');
    return;
  } else {
    $.post(url, {ADAPathwayRecordId: data[1], transitInstruction: data[0], tripDurationTime: data[2]
    }, function(data, status, xhr) {
      window.alert(data.s_status + ": " + status + ' , Reloading page ...');
      window.location.reload();
    });
  }
}

function serializeInstructionFormRecord() {
  let formReturn = [];
  let legJSON = {};
  let steps = [];
  let stepsJSON = {};
  let busStopFrom = {};
  let busStopTo = {};
  let index = '0';
  let indexNested = '0';
  let indexForm;
  let indexNestedForm;
  let keyForm;
  let keyNestedForm;

  const x = $('form').serializeArray();

  $.each(x, (i, field) => {
    [indexForm, keyForm, indexNestedForm, keyNestedForm] = field.name.split(/[ ,.]+/);

    if ((index === indexForm) && (i !== (x.length - 1))) {
      if (keyForm === 'steps') {
        if (indexNested === indexNestedForm) {
          stepsJSON[keyNestedForm] = field.value;
        } else if (indexNested !== indexNestedForm) {
          steps.push(stepsJSON);
          stepsJSON = {};
          indexNested = indexNestedForm;
          stepsJSON[keyNestedForm] = field.value;
        }
      } else if (keyForm === 'busStopFrom') {
        busStopFrom[indexNestedForm] = field.value;
      } else if (keyForm === 'busStopTo') {
        busStopTo[indexNestedForm] = field.value;
      } else {
        legJSON[keyForm] = field.value;
      }
    }
    if ((index !== indexForm) && (i !== (x.length - 1))) {
      if (legJSON.mode === 'WALK') {
        steps.push(stepsJSON);
        legJSON.steps = steps;
        steps = [];
        stepsJSON = {};
        indexNested = '0';
      } else {
        legJSON.busStopFrom = busStopFrom;
        legJSON.busStopTo = busStopTo;
        busStopFrom = {};
        busStopTo = {};
      }

      formReturn.push(legJSON);
      legJSON = {};
      index = indexForm;

      if (keyForm === 'busStopFrom') {
        busStopFrom[indexNestedForm] = field.value;
      } else if (keyForm === 'busStopTo') {
        busStopTo[indexNestedForm] = field.value;
      } else {
        legJSON[keyForm] = field.value;
      }
    }
    if (i === (x.length - 1)) {
      if (keyForm === 'busStopFrom') {
        busStopFrom[indexNestedForm] = field.value;
      } else if (keyForm === 'busStopTo') {
        busStopTo[indexNestedForm] = field.value;
      } else {
        legJSON[keyForm] = field.value;
      }

      if (legJSON.mode === 'WALK') {
        stepsJSON[keyNestedForm] = field.value;
        steps.push(stepsJSON);
        legJSON.steps = steps;
      } else {
        legJSON.busStopFrom = busStopFrom;
        legJSON.busStopTo = busStopTo;
        busStopFrom = {};
        busStopTo = {};
      }
      formReturn.push(legJSON);
    }
  });
  return formReturn;
}
