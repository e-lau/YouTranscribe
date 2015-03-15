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

var getRecipientId = function () {
    if (!g_username) {
        return null;
    }

    var Client = Parse.Object.extend('Client');
    var client = new Parse.Query(Client);

    client.get(parseUserId, {
        success: function (obj) {
            // The object was retrieved successfully.
            return obj.recipientId;
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            return null;
        }
    });
}

$('#submit-add-card').click(function (event) {
    var $form = $(this);
    $form.find('button').prop('disabled', true);

    var stripeResponseCallback = handleNewRecipient

    if (userRecipientId) {
        stripeResponseCallback = function (status, response) {
            handleExistingRecipient(response.id, response.error);
        }
    }

    var name = $('.card-name').val();
    var number = $('.card-number').val();
    var cvc = $('.card-cvc').val();
    var exp_month = $('.card-expiry-month').val();
    var exp_year = $('.card-expiry-year').val();

    Stripe.card.createToken({
        name: name,
        number: number,
        cvc: cvc,
        exp_month: exp_month,
        exp_year: exp_year,
    }, stripeResponseCallback);

    return false;
});

function handleExistingRecipient(token, error) {
    var $form = $('#recipient-form');

    if (error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(error.message);
        $form.find('button').prop('disabled', false);
    } else {
        $.post('http://localhost:3000/addcard', {
            stripeToken: token,
            recipientId: userRecipientId,
            name: $('.card-name').val(),

        }).done(function (data) {
            console.log("post was completed");
            console.log(data);
            addCard(data.card);
        });
    }
}

function handleNewRecipient(status, response) {
    var $form = $('#recipient-form');

    if (response.error) {
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;

        $.post('http://localhost:3000/recipient', {
            stripeToken: token,
            name: $('.card-name').val(),
            email: $('.card-email').val()

        }).done(function (data) {
            console.log("post was completed");
            console.log(data);
            updateClient("recipientId", data.recipientId);
            userRecipientId = data.recipientId;
            if (data.cards && data.cards.data.length > 0) {
                addCard(data.cards.data[0]);
            }
        });
    }
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
        if (typeof callback === "function") {
            if (data && data.cards && data.cards.data) {
                callback(data.cards.data);
            }
        }
    });
}

function addCard(card) {
    $('#cards-container').append('<div class="card-container"><div class="ui-card-security"></div><div class="ui-card-digits">**** **** **** <span data-last4="' + card.last4 + '" class="last4">' + card.last4 + '</span></div><div class="ui-card-group"><div data-name="' + card.name + '" class="ui-card-name">' + card.name + '</div><div class="ui-card-exp">Exp: ' + card.exp_month + '/' + card.exp_year + '</div></div></div>');
}

function addUICards() {
    getCards(function (cards) {
        for (var i = 0; i < cards.length; i++) {
            addCard(cards[i]);
        }
    });
}

initUserId(addUICards);