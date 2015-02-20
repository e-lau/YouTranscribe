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


// Initializes Parse
// Keys are under Peter's account currently.
var initParse = function() {
	var keyApp = 'JxGjxQ7ByiGgivpFGz7892uqVi34zkGdEmOCuMtZ';
	var keyJs  = 'CF4OxiRfXhMxgPkUFKySyYNpmmwXiQsIIJjj21yJ';

	Parse.initialize(keyApp, keyJs);	
}

var parse = (function() {

	return {		
		saveUser: function(username, email) {
			var UserObj = Parse.Object.extend('Client');
			var userObj = new UserObj();

			email = 'fakeEmail@fake.com'; // Hardcoded.
			userObj.save(
				{'username': username,
				 'email'   : email,
				 'balance' : 0,
				 'request' : {}
				}, 
				{
					success: function(results) {
						console.log('saved user successfully');	
					},
					error: function(error) {
						console.log('unable to save user');
					}
				}
			);
		},

		getUser: function(username) {
			var Client = Parse.Object.extend('Client');
			var client = new Parse.Query(Client);

			client.find({
				success: function(results) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].get('username') === username) {	
							results[i].get('username');
						}					
					}
				},
				error: function(error) {
					console.log('error: getUser()');
					return null;
				}
			});
		},		

		newRequest: function(user, url, reward) {
			// Hardcoded. 
			user = 'fakeUser01';						
			var link = url;

			// Defaults values
			if (!$('#youtube-url').val()) link = 'https://www.youtube.com/watch?v=jYbx_PV3318';
			if (!reward) reward = 5;

			// Saves the Video
			var Request = Parse.Object.extend('Request');
			var req = new Request();
			req.save(
				{'link': link, 'user': user, 'reward': reward},
				{success: function(results) {
					console.log('request has been saved')
				}}
			);

			// Append Video
			var imgURL = yt.getYouTubeThumbnail(yt.parseID(link));
	        $('#requests-container').append('<a class="request" href=transcribe.html?youtubeid=' + link.split('=')[1] + '><img class="video-thumb" src=' + imgURL
	         + '><div class="video-title">Description Here</div><div class="reward-amount">$' + reward
	         + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
		},

		// returns an array of requests from user
		getRequests: function(user) {
			// Hardcoded. 
			user = 'fakeUser01';

			// Gets all request from user.
			var Request = Parse.Object.extend('Request');
			var req = new Parse.Query(Request);
			req.find({
				success: function(results) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].get('user') === user) {
							var imgURL = yt.getYouTubeThumbnail(yt.parseID(results[i].get('link')));
						    $('#requests-container').append('<a class="request" href="transcribe.html"><img class="video-thumb" src=' + imgURL
						     + '><div class="video-title">Description Goes Here</div><div class="reward-amount">$' +
						     results[i].get('reward') + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
						}
					}
				}
			});
		}
	}
})();

initParse();