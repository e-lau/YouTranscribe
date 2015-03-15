var parseUserId = "";
var userRecipientId = "";

var initUserId = function (callback) {
    var Client = Parse.Object.extend('Client');
    var client = new Parse.Query(Client);

    var usr = localStorage.getItem('userid');
    client.equalTo("username", usr);
    client.find({
        success: function (results) {
            localStorage.setItem('parseUserId', results[0].id);
            parseUserId = results[0].id;
            userRecipientId = results[0].attributes.recipientId;

            if (typeof callback === "function") {
                callback();
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

var updateClient = function (key, value) {
    if (!parseUserId) {
        return;
    }

    var Client = Parse.Object.extend("Client");
    var query = new Parse.Query(Client);

    query.get(parseUserId, {
        success: function (obj) {
            obj.set(key, value);
            obj.save();
            // The object was retrieved successfully.
        },
        error: function (obj, error) {
            console.log(error);
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
}

var getUser = function () {
    if (!parseUserId) {
        return null;
    }

    var Client = Parse.Object.extend('Client');
    var client = new Parse.Query(Client);

    client.find({
        username: g_username
    }).then(function (results) {
        if (results[0]) {
            return results[0];
        } else {
            return null;
        }
    });
}

var getBalance = function (callback) {
    if (!parseUserId) {
        return "0";
    }
    
    var Client = Parse.Object.extend("Client");
    var query = new Parse.Query(Client);

    query.get(parseUserId, {
        success: function (obj) {
            console.log(obj);
            $('.balance-amount').html("$" + obj.attributes.balance);
            if (typeof callback === "function") {
                callback();
            }
        },
        error: function (obj, error) {
            console.log(error);
            $('.balance-amount').html("$0");
            if (typeof callback === "function") {
                callback();
            }
        }
    });
}


function getCards(callback) {
    if (!userRecipientId) {
        return null;
    }

    $.post('http://localhost:3000/cards', {
        recipientId: userRecipientId
    }).done(function (data) {
        console.log(data);
        console.log(data.cards);
        fillCardList(data.cards.data);
        if (typeof callback === "function") {
            if (data && data.cards && data.cards.data) {
                callback(data.cards.data);
            }
        }
    });
}

function fillCardList(cards) {
    for (var i = 0; i < cards.length; i++) {
        addCardOption(cards[i]);
    }
}

function addCardOption(card) {
    $('#card-list').append('<option>' + card.brand + ': **** **** **** ' + card.last4 +'</option>');
}

var addBalance = function (amount) {
    if (!g_username) {
        return;
    }
}

initUserId(function() { getBalance(getCards); });