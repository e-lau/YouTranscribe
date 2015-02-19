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
			var User = Parse.Object.extend('Client');
			var user = new User();

			email = 'fakeEmail@fake.com'; // Hardcoded.
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
		},

		getUser: function(username) {
			var User = Parse.Object.extend('Client');
			var user = new User();
			user.find({
				success: function(results) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].get('username') === username) {
							return results[i];
						}
					}
				}
			});
		},		

		newRequest: function(user, url) {
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
		getRequests: function(user) {
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