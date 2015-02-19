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