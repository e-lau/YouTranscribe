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

var g_username='';

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

		historyRequest: function() {
			var Request = Parse.Object.extend('Request');
			var req = new Request(); 
			req.find().then(function(results) {
				for (var i = 0; i < results.length; i++) {
					if (results[i].get('user') == g_username) {
						var link = results[i].get('link');
						var imgURL = yt.getYouTubeThumbnail(yt.parseID(link));
						var reward = reqResults[i].get('reward');
	        			$('.tab-details').append('<a class="request" href=transcribe.html?youtubeid=' + link.split('=')[1] + '><img class="video-thumb" src=' + imgURL
	         			+ '><div class="video-title">Description Here</div><div class="reward-amount">$' + reward
	         			+ '<span>REWARD FOR TRANSCRIBING</span></div></a>');
					}
				}
			});

		},

		// When user hit submit on index.html
		newRequest: function(link, reward) {		
			username = g_username;
			/*if (!g_username) {
				alert('You should log in first');
				return;
			}*/

			// Saves the Video
			var Request = Parse.Object.extend('Request');
			var req = new Request();
			req.save({'link': link, 'user': username, 'reward': reward, 'status': 'new'})
				.then(function(results) {console.log('request has been saved')},
				      function(error) {console.log("Error in saving request!");}
				);

			// Append Video
			var imgURL = yt.getYouTubeThumbnail(yt.parseID(link));
	        $('#requests-container').append('<a class="request" href=transcribe.html?youtubeid=' + link.split('=')[1] + '><img class="video-thumb" src=' + imgURL
	         + '><div class="video-title">Description Here</div><div class="reward-amount">$' + reward
	         + '<span>REWARD FOR TRANSCRIBING</span></div></a>');
		},

		loadUser: function(username) {
			g_username = username;

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

		storeTranscript: function(vidId) {
			var textboxes = [];
			var idx = 0;
			username = g_username;

			// Need to fix.
			while ($('textarea[name="text'+idx+'"]').val()) {
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

		loadTranscript: function(vidId) {
			username = g_username;

			var Transcript = Parse.Object.extend('Transcript');
			var transcript = new Parse.Query(Transcript);
			console.log('finding transcript');
			transcript.find().then(function(transResult) {
				// Query for user's existing list of transcripts
				for (var i = 0; i < transResult.length; i++) {
					// WE NEED TO FIX GOOGLE LOG IN.
					if (/*transResult[i].get('username') == username && */transResult[i].get('vidId') == vidId) {
						console.log('found transcript to load');
						var idx = 0;
						while ($('textarea[name="text'+idx+'"]').val()) {
							$('textarea[name="text'+idx+'"]').val(transResult[i].attributes.textBoxes[idx]);
							idx++;
						}
					}
				}
			});
		}
	}
})();

initParse();
