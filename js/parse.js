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

		newRequest: function(user, url) {
			// Hardcoded. 
			user = 'fakeUser01';						
			var link = url;
			if (!link) link = 'http://img.youtube.com/vi/jYbx_PV3318/mqdefault.jpg';


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
			// Hardcoded. 
			user = 'fakeUser01';

			// Gets all request from user.
			var Request = Parse.Object.extend('Request');
			var req = new Parse.Query(Request);
			var userRequests = [];
			req.find({
				success: function(results) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].get('user') === user) {
							console.log('link: ' + results[i]);
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