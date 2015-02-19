var userId = "";

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
    console.log(authResult);

    // Make API call to validate the authentication token.
    var requesturl = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=".concat(authResult.access_token);
    var request = $.ajax({
        url: requesturl,
        dataType: 'json'
    });

    // Set user ID
    request.done(function(msg) {
        // Check if audience field matches client ID.
        if (msg.audience == "424295941249-id3jo68q6rb0j0a8mi5o45ihneip3a4u.apps.googleusercontent.com") {
            console.log("audience field ok");

            userId = msg.user_id;
            console.log("user id: " + userId);

            // Remove sign in button
            document.getElementById('signinButton').setAttribute('style', 'display: none');

            // Get user's name
            requesturl = "https://www.googleapis.com/plus/v1/people/".concat(userId, "?access_token=", authResult.access_token);
            request = $.ajax({
                url: requesturl,
                dataType: 'json'
            });
            // Display welcome text
            request.done(function(msg) {
                console.log(msg);
                $('#navbar ul').append("<li><a href='#accountpage'>" + msg.displayName + "</a></li>");
            });
       }
    });

    } 
    else {
        console.log('Sign-in state: ' + authResult['error']);
    }
}