$(function() {
    $('#submit-request').click(function() {
        

        var ytUrl = $('#youtube-url').val() ? $('#youtube-url').val() : 'https://www.youtube.com/watch?v=jYbx_PV3318';
        var reward = $('#request-reward').val() ? $('#request-reward').val() : '0';
        
        var jsonURL = 'https://gdata.youtube.com/feeds/api/videos/' + yt.parseID(ytUrl) + '?v=2&alt=jsonc';
      
        $.getJSON(jsonURL)
        .success(function(result) {
            if (!$('#request-form').hasClass('hidden')) {
              $('#request-form').addClass('hidden');
            }

            var title = result.data.title;
            var duration = yt.secformat(result.data.duration);

            parse.newRequest(ytUrl, reward, title, duration);
            

        })
        
        .fail(function(error) {
            alert('enter valid youtube url');
            console.log('error getting youtube info');
        });
    });
});


// Google OAuth
function disconnectUser(access_token) {
    console.log("Disconnecting");

    var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;

    localStorage.removeItem("access_token");

    // Perform an asynchronous GET request.
    $.ajax({
        type: 'GET',
        url: revokeUrl,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(nullResponse) {
            if (document.getElementById('signinButton') != null) {
                document.getElementById('signinButton').setAttribute('style', 'display: block');
            }
            else {
                window.location.replace("/");
            }
            
            document.getElementById('request-link').remove();
            document.getElementById('settings').remove();
            document.getElementById('displayName').remove();
            document.getElementById('logoutButton').remove();
        },
        error: function(e) {
            console.log(e);
            window.alert("Could not log out. Please try to manually log out at https://plus.google.com/apps");
        }
    });

    // Clears the screen
    $('#requests-container').children().remove();
}

function showUserNav() {
    $('#navbar ul').append('<li><a id="request-link" href="#">Request A Video Transcription</a></li>');
    $('#navbar ul').append('<li><a id="settings" href="account.html">Account Settings</a></li>');
    $('#navbar ul').append("<li id='displayName'><a href='#accountPage'>" + localStorage.getItem("username") + "</a></li>");
    $('#navbar ul').append("<li id='logoutButton'><a href=''>Logout</a></li>");
    $('#logoutButton').click(function(event) {
        event.preventDefault();
        disconnectUser(localStorage.getItem("access_token"));
    });
    $('#request-link').click(function() {
        if ($('#request-form').hasClass('hidden')) {
            $('#request-form').removeClass('hidden');
        }
    });

    $('#request-form-close').click(function() {
        if (!$('#request-form').hasClass('hidden')) {
            $('#request-form').addClass('hidden');
        }
    });
}



function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        document.getElementById('signinButton').setAttribute('style', 'display: none');
        if (localStorage.getItem("access_token") == null) {
            // Make API call to validate the authentication token.

            var requesturl = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=".concat(authResult.access_token);
            var request = $.ajax({
                url: requesturl,
                dataType: 'json'
            });

            request.done(function(msg) {
                var clientId = "424295941249-id3jo68q6rb0j0a8mi5o45ihneip3a4u.apps.googleusercontent.com";
                if (msg.audience == clientId) {
                    // Set access token in local storage
                    localStorage.setItem("access_token", authResult.access_token);

                    // Get user's name
                    requesturl = "https://www.googleapis.com/plus/v1/people/".concat(msg.user_id,
                        "?access_token=", authResult.access_token);
                    request = $.ajax({
                        url: requesturl,
                        dataType: 'json'
                    });

                    // Display welcome text
                    request.done(function(msg) {
                        localStorage.setItem("username", msg.displayName);
                        showUserNav();
                    });

                    // Load User
                    localStorage.setItem('userid', msg.user_id);
                    parse.loadAllRequests();
                }
            });
        } else {
            // don't do login, just show information.
            showUserNav();
        }
    } else {
        document.getElementById('signinButton').setAttribute('style', 'display: block');
    }
}

$(document).ready(function() {
    parse.loadAllRequests();
});
