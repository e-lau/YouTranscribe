var yt = (function() {

    return {
        secformat: function(sec) {
            var fm = [
                Math.floor(sec/60) % 60, // Minutes
                sec % 60 // Seconds
            ];

            return $.map(fm, function(v,i) {
                return ((v < 10) ? '0' : '') +v;
            }).join(':');
        },
      
        getDescription: function(url) {
            if (!url) return "Error: Invalid URL";
            else return "DESCRIPTION GOES HERE";
        },

        /*  Uses a regex to get the video id from a youtube url.
        **/
        parseID: function(url) {
            if (url == null) {
                return "";
            }

            var videoID = "";
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                videoID = match[2];
            } else {
              videoID = 'invalidyoutubeid';
            }

            return videoID;
        },

        /*  
        Returns the url of the Medium quality defuault (mqdefault)     
        YouTube image - Resolution: 320 x 180 pixels., or an empty
        string if the given id is null or an empty string. 
        ******************************************/
        getYouTubeThumbnail: function(id){
            if (!id) { 
                return ""; 
            }

            return "http://img.youtube.com/vi/"+id+"/mqdefault.jpg";
        }
    }
}());

