function demoSetup(apis) {

  var apiOptions = $('#demo-api');
  apiOptions.empty();
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
      console.log(demoRoute + ' route not supported');
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
      console.log(demoMethod + ' method not supported');
      return; // not supported
  }

  console.log(demoMethod + ' submitted for ' + fullUrl); 
  $('#demo-results').empty();

  var demoForm = document.getElementbyId('demo-form');
  demoForm.method = demoMethod;
  demoForm.action = fullUrl;
  demoForm.submit();
}
