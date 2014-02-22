function authSetup() {
   var authArea = document.getElementById('auth');
   $.ajax({ 
      type: 'GET',
      url: '/auth', 
      success: function(res, status, xhr) { 
        var html;
        if(Array.isArray(res)) {
          for(var i=0;i<res.length;i++) {
            var apiName = res[i].api;
            var method = res[i].enabled ? 'delete' : 'post';
            var toggle = res[i].enabled ? 'disable' : 'enable';
            html += '<span class="auth-switch">'
            html += '<form name="'+apiName+'" method="'+method+'" action="/auth/'+apiName+'">';
            html += '<input type="button" value="'+toggle+' '+apiName+'" onclick="'+toggle+'Auth(this.form)" />';
            html += '</form></span>';
          }
        }
        authArea.innerHTML = html; 
      },
      error: function(xhr, status, err) {
        authArea.innerHTML = ''; 
       }
   });
}

function enableAuth(form) {
  form.submit();
}

function disableAuth(form) {
  $.ajax({ 
    type: 'GET',
    url: , 
    success: function(res, status, xhr) { 
      authSetup();  
    },
    error: function(xhr, status, err) {
    }
  });
}
