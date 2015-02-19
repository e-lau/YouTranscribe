$(function() {
    $('#request-link').click(function() {
        if ($('#request-form').hasClass('hidden')) {
            $('#request-form').removeClass('hidden');
        }
    });
    
    
    $('#submit-request').click(function() {
        if (!$('#request-form').hasClass('hidden')) {
            $('#request-form').addClass('hidden');
        }
        
        var imgURL = yt.getYouTubeThumbnail(yt.parseID($('#youtube-url').val()));
        $('#requests-container').append('<img src="' + imgURL + '">');
    });
    
    $('#request-form-close').click(function() {
        if (!$('#request-form').hasClass('hidden')) {
            $('#request-form').addClass('hidden');
        }
    });
});

function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
    console.log('Signed In!');
  } else {
    console.log('Sign-in state: ' + authResult['error']);
  }
}