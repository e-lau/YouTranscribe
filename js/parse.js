// Initializes Parse
// Keys are under Peter's account currently.
var initParse = function() {
	var keyApp = 'JxGjxQ7ByiGgivpFGz7892uqVi34zkGdEmOCuMtZ';
	var keyJs  = 'CF4OxiRfXhMxgPkUFKySyYNpmmwXiQsIIJjj21yJ';

	Parse.initialize(keyApp, keyJs);	
}

var parse = (function() {
	return {
		/* Waiting for gplus to be implemented
		var saveUser = function(username, email) {
			var User = Parse.Object.extend('Client');
			var user = new User();
			user.save(
				{'username': username,
				 'email'   : email,
				 'balance' : 0,
				 'request' : {}
				}, 
				{
					success: function() {
						console.log('saved user successfully');	
					}
				}
			);
		}

		var getUser = function(email) {
			var User = Parse.Object.extend('Client');
			var user = new User();
			user.find({
				success: function(results) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].get('email') === email) {
							return results[i];
						}
					}
				}
			});
		}
		*/

		newRequest: function(url) {
			var user = 'URequestor01' //hardcoded a username
			var link = url;

			var Request = Parse.Object.extend('Request');
			var req = new Request();
			req.save(
				{'link': link, 'user': user},
				{success: function(results) {
					console.log('request has been saved')
				}}
			);
		},

		// returns an array of requests from user
		getRequest: function(user) {
			user = 'URequestor01'; //hardcoded a username

			// Gets all request from user.
			var Request = Parse.Object.extend('Request');
			var req = new Parse.Query(Request);
			var userRequests = [];
			req.find({
				success: function(results) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].get('user') === user) {
							userRequests.push(results[i]);
						}
					}
				}
			});

			return userRequests; 
		}
	}
})();

initParse();