jQuery(function ($) {
    $('#add-card-form').submit(function (event) {
        var $form = $(this);

        $form.find('button').prop('disabled', true);

        Stripe.card.createToken({
            name: $('.card-name').val(),
            number: $('.card-number').val(),
            cvc: $('.card-cvc').val(),
            exp_month: $('.card-expiry-month').val(),
            exp_year: $('.card-expiry-year').val()
        }, stripeResponseHandler);

        return false;
    });

    var getRecipientToken() {
        if (!userId) {
            return null;
        }    
        
        var Client = Parse.Object.extend('Client');
		var client = new Parse.Query(Client);

		client.find({ username: userId }).then(function(results) {
            if (results[0]) {
                return results[0].recipientToken;
            }
            else {
                return null;
            }
        });
    }
    $('#submit-add-card').click(function (event) {
        var $form = $(this);

        $form.find('button').prop('disabled', true);

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

    function stripeResponseHandler(status, response) {
        var $form = $('#recipient-form');

        if (response.error) {
            // Show the errors on the form
            $form.find('.payment-errors').text(response.error.message);
            $form.find('button').prop('disabled', false);
        } else {
            // response contains id and card, which contains additional card details
            var token = response.id;
            // Insert the token into the form so it gets submitted to the server
//            $form.append($('<input type="hidden" name="stripeToken" />').val(token));
//            $form.append($('<input type="hidden" name="name" />').val($('.card-name').val()));
//            $form.append($('<input type="hidden" name="email" />').val('test@live.com'));
            // and submit
            
            $.post('http://localhost:3000/addcard', 
            { 
                stripeToken:    token, 
                name:           $('.card-name').val(), 
                email:          $('.card-email').val() 
            
            }).done(function(data) {
                    console.log("post was completed");
                    console.log(data);
            });
        }
    }

});