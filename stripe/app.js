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

app.post('/recipient', function (req, res) {
   var userInfo = req.body;
   var stripeToken = userInfo.stripeToken;
/*
   var transfer = {
      amount: 1000,
      currency: 'usd'
      recipient: recipientId,
      name: userInfo.name,
      type: 'individual',
      card: stripeToken,
      email: 'dummyemail@live.com'
   }
 **/      
// Create a transfer to the specified recipient
   stripe.transfers.create(transfer, function(err, transfer) {
     // transfer;
   });
  
   console.log('**************************');
   console.log(userInfo);
   console.log('**************************');

   stripe.recipients.create(user, function (err, recipient) {
      console.log("woohooo new recipient!");
      console.log(err);
      console.log(recipient);
   });
});

app.post('/addcard', function (req, res) {
   var userInfo = req.body;
   var stripeToken = userInfo.stripeToken;

   var user = {
      name: userInfo.name,
      type: 'individual',
      card: stripeToken,
      email: 'dummyemail@live.com'
   }
   
   console.log('**************************');
   console.log(userInfo);
   console.log('**************************');

   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:54325');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');


   stripe.recipients.create(user, function (err, recipient) {
      console.log("woohooo new recipient!");
      console.log(err);
      console.log(recipient);

      if (err) {
         res.send({error: err});
      }

      res.send({ blah: "test", cards: recipient.cards });

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
