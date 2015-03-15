var express          = require('express')
var app              = express()
var bodyParser       = require('body-parser');
var multer           = require('multer');
var stripe           = require('stripe')('sk_test_2DbGrAOFEjKSgTes0QQKjnRB');

//require('./config/passport')(passport);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


/*
stripe.transfers.create({
  amount: 1000, // amount in cents
  currency: "usd",
  recipient: recipientId,
  source: cardId,
  statement_descriptor: "JULY SALES"
}, function(err, transfer) {
  // transfer;
});
**/

app.get('/stripe', function (req, res) {
   res.send('Nothing to see here...');
});

app.post('/cards', function(req, res) {
   var userInfo = req.body;

   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');

console.log(req);
console.log(userInfo);
   stripe.recipients.listCards(userInfo.recipientId, function(err, cards) {
      if (err) {
         res.send({ error: err });
      }
      else {
         res.send({ cards: cards });
      }
   });
});

app.post('/recipient', function (req, res) {
   var userInfo = req.body;
   var stripeToken = userInfo.stripeToken;
 
   var user = {
      name: userInfo.name,
      type: 'individual',
      card: stripeToken,
   }

   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');

   stripe.recipients.create(user, function (err, recipient) {
      if (!err) {
         console.log(recipient);
         res.send({ recipientId : recipient.id, cards: recipient.cards });
      }
      else {
         console.log(err);
         res.send({ error : err });
      }
   });
});

app.post('/addcard', function (req, res) {
   var userInfo = req.body;
   var cardToken = userInfo.stripeToken;
   var recipientId = userInfo.recipientId;

   if (!recipientId) {
      res.send({ error : "No recipientId to create the card for." });
   }

   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');


   stripe.recipients.createCard(
      recipientId, 
      { card: cardToken }, 
      function (err, card) {
         if (err) {
            console.log(err);
            res.send({ error: err });
         }
         else {
            console.log(card);
            res.send({ card: card });
         }
   });
});

app.post('/stripe', function (req, res) {
   var transaction = req.body;
   var stripeToken = transaction.stripeToken;
   var amount = 10; // hardcoded $10

   var charge = {
      amount: amount * 100,
      currency: 'USD',
      source: stripeToken,
      description: 'sampleuser@example.com'
   };
   
   stripe.charges.create(charge, function(err, charge) {
      if (err) {
         console.log(err);
         res.send('There was an error charging the payment.');
      }
      else {
         console.log('Successful charge sent to stripe!');
         res.send('Successful charge sent to stripe!');
      }
   });
});

//HTTP request get handled in routes.js file.
//require('./app/routes.js')(app, passport);

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
