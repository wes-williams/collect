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

  if(demoRoute === '/data') {
    $('#demo-api').hide();
    $('#demo-create').show();
    $('#demo-read').show();
    $('#demo-url').show();
  }
  else if(demoRoute === '/api') {
    $('#demo-api').show();
    $('#demo-create').hide();
    $('#demo-read').show();
    $('#demo-url').show();
  }
  else {
    $('#demo-api').hide();
    $('#demo-create').hide();
    $('#demo-read').hide();
    $('#demo-url').hide();
  }

  $('#demo-results').hide();
}
