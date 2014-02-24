function demoSetup(apis) {

  var apiOptions = $('#demo-api');
  apiOption.empty();
  $.each(apis, function() {
    apiOptions.append($("<option />").val(this.id).text(this.id));
  });

  $('#demo').show();
}

function demoTeardown() {
  $('#demo-results').empty();
  $('#demo').hide();
}

function doDemo(demoMethod) {
  var fullUrl = '';
  var demoRoute = $('#demo-route').val();
  var demoApi = $('#demo-api').val();
  var demoUrl = $('#demo-url').val().trim();

  if(demoUrl.length===0) {
    demoUrl = '/';
  }

  switch(demoRoute) {
    case '/api':
    case '/data':
      break;
    default:
      return; // not supported
  }

  switch(demoMethod.toUpperCase()) {
    case 'GET':
      if(demoUrl === '/data') {
        fullUrl = demoRoute + demoUrl;
      }
      else {
        fullUrl = demoRoute + '/' + demoApi + demoUrl;
      }
      break;
    case 'POST':
      if(demoUrl !== '/data') {
        return; // not supported
      }
      fullUrl = demoRoute + '/' + demoApi + demoUrl;
      break;
    default:
      return; // not supported
  }

  $('#demo-results').empty();

  var demoForm = $('#demo-form');
  demoForm.method = demoMethod;
  demoForm.action = fullUrl;
  demoForm.submit();
}
