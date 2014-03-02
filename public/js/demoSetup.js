function demoSetup(apis) {

  var apiOptions = $('#demo-api');
  apiOptions.empty();
  $.each(apis, function() {
    if(this.enabled) {
      apiOptions.append($("<option />").val(this.id).text(this.id));
    }
  });

  $('#demo').show();
}

function demoTeardown() {
  $('#demo-results').empty();
  $('#demo').hide();
}

function doDemo() {
  var fullUrl = '';
  var demoMethod = $('#demo-method').val();
  var demoRoute = $('#demo-route').val();
  var demoApi = $('#demo-api').val();
  var demoUrl = $('#demo-url').val().trim();

  if(demoUrl.length===0) {
    demoUrl = '/';
  }
  else if(demoUrl.charAt(0) !== '/') {
    demoUrl = '/' + demoUrl;
  }

  switch(demoRoute) {
    case '/api':
    case '/data':
      break;
    default:
      console.log(demoRoute + ' route not supported');
      return; // not supported
  }

  if(demoMethod) {
    demoMethod = demoMethod.toUpperCase();
  }

  switch(demoMethod) {
    case 'GET':
      if(demoRoute === '/data') {
        fullUrl = demoRoute + demoUrl;
      }
      else {
        fullUrl = demoRoute + '/' + demoApi + demoUrl;
      }
      break;
    case 'POST':
      if(demoRoute !== '/data') {
        console.log(demoMethod + ' method not supported for ' + demoRoute);
        return; // not supported
      }
      fullUrl = demoRoute + demoUrl;
      break;
    default:
      console.log(demoMethod + ' method not supported');
      return; // not supported
  }

  console.log(demoMethod + ' submitted for ' + fullUrl); 
  $('#demo-results').empty();

  if(demoMethod === 'GET') {
    $('#demo-results').attr('src',fullUrl);
  }
  else {
    var demoForm = document.createElement('form');
    demoForm.method = demoMethod;
    demoForm.action = fullUrl;
    demoForm.target = 'demo-results';
    demoForm.submit();
  }

  $('#demo-results').show();
}

function demoRouteChange() {
  var demoRoute = $('#demo-route').val();

  $('#demo-method').empty();

  if(demoRoute === '/data') {
    $('#demo-method').append($("<option />").val('GET').text('GET'));
    $('#demo-method').append($("<option />").val('POST').text('POST'));

    $('#demo-api').hide();
    $('#demo-method').hide();
    $('#demo-url').show();
    $('#demo-submit').show();
  }
  else if(demoRoute === '/api') {
    $('#demo-method').append($("<option />").val('POST').text('POST'));

    $('#demo-api').show();
    $('#demo-method').show();
    $('#demo-url').show();
    $('#demo-submit').hide();
  }
  else {
    $('#demo-api').hide();
    $('#demo-method').hide();
    $('#demo-url').hide();
    $('#demo-submit').hide();
  }

  $('#demo-results').hide();
}
