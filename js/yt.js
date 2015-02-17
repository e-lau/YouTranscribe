var yt = (function() {

    return {
        
        getRequests: function() {
            //Parse API code to get Request Objects
            //returns request objects
        },

        /*  Takes in request objects and displays 
            them within the .requests div 
        **/
        displayRequests: function(reqs) {
                
        },

        submitRequest: function() {
            //When the request formm is submitted this function is called 
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
            } 

            return videoID;
        },

        /*  
        Returns the url of the Medium quality defuault (mqdefault)           YouTube image - Resolution: 320 x 180 pixels., or an empty           string if the given id is null or an empty string. 
        ******************************************/
        getYouTubeThumbnail: function(id){
            if (!id) { 
                return ""; 
            }

            return "http://img.youtube.com/vi/"+id+"/mqdefault.jpg";
        }
    }
}());

