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

var saveUser = function(username) {
	var UserObj = Parse.Object.extend('Client');
	var userObj = new UserObj();

	userObj.save({'username': username, 'balance' : 0, 'request' : {}})
		.then(function() { //success
			console.log('saved user successfully');	
		});			
}

var saveTranscript = function(username, vidId, textboxes) {
	var Transcript = Parse.Object.extend('Transcript');
	var transcript = new Transcript();
	transcript.save({'username':username, 'vidId': vidId, 'textBoxes': textboxes})
		.then(function(results) {
			console.log('saved transcript successfully');
		});
}

// Initializes Parse
var initParse = function() {
	var keyApp = 'bXjIyaiBbhZGr8msBXLoSSsbg21mEd4uGSdOVB19';
	var keyJs  = 'AlqxejCtHGHuEN47jpNM0uOkuTQxViX6pL6tC9SA';

	Parse.initialize(keyApp, keyJs);	
}

var parse = (function() {

	return {
		// When user hit submit on index.html
		newRequest: function(user, link, reward) {			
			// Saves the Video
			var Request = Parse.Object.extend('Request');
			var req = new Request();
			req.save({'link': link, 'user': user, 'reward': reward, 'status': 'new'})
				.then(function(results) {console.log('request has been saved')},
				      function(error) {console.log("Error in saving request!");}
				);

			// Append Video
			var imgURL = yt.getYouTubeThumbnail(yt.parseID(link));
	        $('#requests-container').append('<a class="request" href=transcribe.html?youtubeid=' + link.split('=')[1] + '><img class="video-thumb" src=' + imgURL
	         + '><div class="video-title">Description Here</div><div class="reward-amount">$' + reward
	         + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
		},

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
				// Query for existing user
				for (var i = 0; i < results.length; i++)
					if (results[i].get('username') === username) 
						return results[i].get('username');	
				
				// Save non-existing user
				saveUser(username);

			}).then(function(result) {
				// Load existing user's requests
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
		},

		storeTranscript: function(username, vidId) {
			var textboxes = [];
			var idx = 0;

			// Need to fix.
			while (idx < 54) {
				console.log('idx: ' + $('textarea[name="text'+idx+'"]').val());
				textboxes.push($('textarea[name="text'+idx+'"]').val());
				idx++;
			}

			var Transcript = Parse.Object.extend('Transcript');
			var transcript = new Parse.Query(Transcript);
			transcript.find().then(function(transResult) {
				// Query for user's existing list of transcripts
				for (var i = 0; i < transResult.length; i++) {
					if (transResult[i].get('username') == username && transResult[i].get('vidId') == vidId) {
						// Update 
						console.log('updating transcript...');
						transResult[i].set('textBoxes', textboxes);
						transResult[i].save();
						return;
					}
				}
				console.log('saving transcript...');
				saveTranscript(username, vidId, textboxes);
			});		

		},

		loadTranscript: function(username, vidId) {
			var Transcript = Parse.Object.extend('Transcript');
			var transcript = new Parse.Query(Transcript);
			transcript.find().then(function(transResult) {
				// Query for user's existing list of transcripts
				for (var i = 0; i < transResult.length; i++) {
					if (transResult[i].get('username') == username && transResult[i].get('link') == link)
						// TODO: Place the stored transcripts into its associated textboxes.
						;
				}
			});
		}
	}
})();

initParse();
