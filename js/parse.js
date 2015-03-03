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

var saveUser = function(username) {
	var UserObj = Parse.Object.extend('Client');
	var userObj = new UserObj();

	userObj.save(
		{'username': username,
		 'balance' : 0,
		 'request' : {}
		}).then(function() { //success
			console.log('saved user successfully');	
		});			
}

var parse = (function() {

	return {
		newRequest: function(user, url, reward) {			
			// user = 'fakeUser01'; // Hardcoded. 						
			var link = url;

			// Defaults values
			if (!$('#youtube-url').val()) link = 'https://www.youtube.com/watch?v=jYbx_PV3318';
			if (!reward) reward = 5;
			console.log("Reward: " + reward);

			// Saves the Video
			var Request = Parse.Object.extend('Request');
			var req = new Request();
			req.save({'link': link, 'user': user, 'reward': reward, 'status': 'new'})
				.then(function(results) {
					console.log('request has been saved')
				});

			// Append Video
			var imgURL = yt.getYouTubeThumbnail(yt.parseID(link));
	        $('#requests-container').append('<a class="request" href=transcribe.html?youtubeid=' + link.split('=')[1] + '><img class="video-thumb" src=' + imgURL
	         + '><div class="video-title">Description Here</div><div class="reward-amount">$' + reward
	         + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
		},

		// returns an array of requests from user
		getRequests: function(user) {
			// Gets all request from user.
			var Request = Parse.Object.extend('Request');
			var req = new Parse.Query(Request);
			req.find().then(function(results) {
				for (var i = 0; i < results.length; i++) {
					if (results[i].get('user') === user) return results[i].get('user');	
				}
			}).then(function(result){
				var imgURL = yt.getYouTubeThumbnail(yt.parseID(result.get('link')));
				var reward = result.get('reward');

			    $('#requests-container').append('<a class="request" href="transcribe.html"><img class="video-thumb" src=' + imgURL
			     + '><div class="video-title">Description Goes Here</div><div class="reward-amount">$' +
			     reward + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
			});

		},

		loadUser: function(username) {
			var Client = Parse.Object.extend('Client');
			var client = new Parse.Query(Client);

			client.find().then(function(results) {
				// Query for user
				for (var i = 0; i < results.length; i++) {
					if (results[i].get('username') === username) return results[i].get('username');	
				}

				saveUser(username);

			}).then(function(result) {
				var Request = Parse.Object.extend('Request');
				var req = new Parse.Query(Request);
				req.find().then(function(reqResults) {
					for (var i = 0; i < reqResults.length; i++) {
						if (reqResults[i].get('user') === result) {
							var imgURL = yt.getYouTubeThumbnail(yt.parseID(reqResults[i].get('link')));
							var reward = reqResults[i].get('reward');
						    $('#requests-container').append('<a class="request" href="transcribe.html"><img class="video-thumb" src=' + imgURL
						     + '><div class="video-title">Description Goes Here</div><div class="reward-amount">$' +
						     reward + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
						}
					}
				});
			});		
		}
	}
})();

initParse();
