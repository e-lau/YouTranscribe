var splitLen = 10;
            
// http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

function secformat(sec) {
    var fm = [
        Math.floor(sec/60) % 60, // Minutes
        sec % 60 // Seconds
    ];

    return $.map(fm, function(v,i) {
        return ((v < 10) ? '0' : '') +v;}).join(':');
}

function addTextboxes(duration) {
    var numBoxes = Math.ceil(duration/splitLen);

    for (i = 0; i < numBoxes; i++) {
        var start = i*splitLen;
        var end = start + splitLen-1;

        if (end > duration) {
            end = duration;
        }

        var newLabel = $(document.createElement('div')).attr('id', 'lab');
        var newText = $(document.createElement('div')).attr('id', 'tex');

        newLabel.after().html('<label>' + secformat(start) + '-' + secformat(end) + '</label>');
        newText.after().html('<textarea name="text' + i + '" rows="6" cols="40" >');

        newLabel.appendTo('#textboxes');
        newText.appendTo('#textboxes');
    }
}

var videoID = getQueryVariable("youtubeid");
console.log(videoID);

$(function() {
    $('#submit-transcription').click(function() {
        console.log('Storing transcript under: '+player.videoID);
        parse.storeTranscript(videoID);
    });
});

$(document).ready(function() {
    $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + videoID + '?v=2&alt=jsonc', function(result) {
        $('#title').html(result.data.title);
        $('#duration').html("Duration: " + secformat(result.data.duration));
        $('#description').html(result.data.description);
        addTextboxes(result.data.duration);
        parse.loadTranscript(videoID);
    }); 
});

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '360',
        width: '620',
        videoId: videoID,
        playerVars: {
            controls: 1,
            showinfo: 1
        }
    });
}

