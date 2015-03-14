$(function() {

    var getUser = function() {
        if (!userId) {
            return null;
        }    
        
        var Client = Parse.Object.extend('Client');
		var client = new Parse.Query(Client);

		client.find({ username: userId }).then(function(results) {
            if (results[0]) {
                return results[0];
            }
            else {
                return null;
            }
        });
    }
    
    var getbalance = function() {
        if (!userId) {
            return "0";
        }
        var user = getUser();
        
        if (user) {
            return user.balance;
        }
        
        return "0"; // no user found
    }
    
    var addBalance = function(amount) {
        if (!userId) {
            return;
        }
        
        
    }
    
    var balance = getbalance();
    $('.balance-amount').html("$" + balance);
    
});
