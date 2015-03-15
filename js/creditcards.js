var parseUserId = "";

var getUserId = function () {
    var Client = Parse.Object.extend('Client');
    var client = new Parse.Query(Client);

    var usr = localStorage.getItem('userid');
    client.equalTo("username", usr);
    client.find({
        success: function (results) {
            localStorage.setItem('parseUserId', results[0].id);
            parseUserId = results[0].id;
            return results[0].id;
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
            return "";
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

var getRecipientToken = function () {
    if (!g_username) {
        return null;
    }

    var Client = Parse.Object.extend('Client');
    var client = new Parse.Query(Client);

    client.get(parseUserId, {
        success: function (obj) {
            // The object was retrieved successfully.
            return obj.recipientToken;
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
    var recipientTok = getRecipientToken();

    if (recipientTok) {
        stripeResponseCallback = function () {
            handleExistingRecipient(recipientTok);
        }
    }

    var name = $('.card-name').val();
    var number = $('.card-number').val();
    var cvc = $('.card-cvc').val();
    var exp_month = $('.card-expiry-month').val();
    var exp_year = $('.card-expiry-year').val();
    var dynamic_last4 = number % 10000;

    Stripe.card.createToken({
        name: name,
        number: number,
        cvc: cvc,
        exp_month: exp_month,
        exp_year: exp_year,
        dynamic_last4: dynamic_last4
    }, stripeResponseHandler);

    return false;
});

function handleExistingRecipient(status, response) {
    var $form = $('#recipient-form');

    if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;
        var recipientToken = getRecipientToken();

        $.post('http://localhost:3000/addcard', {
            stripeToken: token,
            recipientToken: recipientToken,
            name: $('.card-name').val(),
            email: $('.card-email').val()

        }).done(function (data) {
            console.log("post was completed");
            console.log(data);
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
        });
    }
}
getUserId();