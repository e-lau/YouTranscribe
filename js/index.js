var userId = "";
var clientId = "424295941249-id3jo68q6rb0j0a8mi5o45ihneip3a4u.apps.googleusercontent.com";

$(function() {
    
    // Hardcoded until we store and retrieve this data with parse
    var addRequest = function(title, thumbURL, rewardAmount) {
        $('#requests-container').append('<a class="request" href="transcribe.html"><img class="video-thumb" src="http://img.youtube.com/vi/jYbx_PV3318/mqdefault.jpg"><div class="video-title">Zach LaVines 2015 Sprint Slam Dunk Contest Performance</div><div class="reward-amount">$8<span>REWARD FOR TRANSCRIBING</span></div></a>');
    }
    
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
        addRequest();
        // parse.newRequest(userId, $('#youtube-url').val());
    });
    
    $('#request-form-close').click(function() {
        if (!$('#request-form').hasClass('hidden')) {
            $('#request-form').addClass('hidden');
        }
    });
});


// Google OAuth

function disconnectUser(access_token) {
    console.log("Disconnecting");
    var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;

    // Perform an asynchronous GET request.
    $.ajax({
        type: 'GET',
        url: revokeUrl,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(nullResponse) {
          $('#signinButton').show();
          $('#displayName').hide();
          $('#logoutButton').hide();

        },
        error: function(e) {
          console.log(e);
          window.alert("Could not log out. Please try to manually log out at https://plus.google.com/apps");
        }
    });
}

function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
    console.log('Signed In!');
    console.log(authResult);

    // Make API call to validate the authentication token.
    // TODO: Handle expiration of access token.
    var requesturl = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=".concat(authResult.access_token);
    var request = $.ajax({
        url: requesturl,
        dataType: 'json'
    });

    // Hide login button
    $('#signinButton').css('style', 'display: none');

    // Set user ID
    request.done(function(msg) {
        // Check if audience field matches client ID.
        if (msg.audience == clientId) {
            console.log("audience field ok");

            userId = msg.user_id;
            console.log("user id: " + userId);

            $('#signinButton').hide();

            // Get user's name
            requesturl = "https://www.googleapis.com/plus/v1/people/".concat(userId, "?access_token=", authResult.access_token);
            request = $.ajax({
                url: requesturl,
                dataType: 'json'
            });
            
            // Display welcome text
            request.done(function(msg) {
                console.log(msg);
                $('#navbar ul').append("<li id='displayName'><a href='#accountPage'>" + msg.displayName + "</a></li>");
                $('#navbar ul').append("<li id='logoutButton'><a href=''>Logout</a></li>");
                $('#logoutButton').click(function(event) {
                    event.preventDefault();
                    disconnectUser(authResult.access_token);
                });
            });

            // Check for first time user
            // if (!parse.getUser(userId)) {
                // parse.saveUser(userId);
            // }
            
            // Loads Requests from Parse and Displays them            
            // var videos = parse.getRequests(userId);
            // while (videos.length) {
            //     var request = videos.pop();
            //     $('#requests-container').append('<a class="request" href="transcribe.html"><img class="video-thumb" src=' + request.get("link") + '><div class="video-title">Zach LaVines 2015 Sprint Slam Dunk Contest Performance</div><div class="reward-amount">$8<span>REWARD FOR TRANSCRIBING</span></div></a>');
            //     console.log(userId + ": " + request);
            // }
        }
    });
    } 
    else {
        console.log('Sign-in state: ' + authResult['error']);
    }
}
