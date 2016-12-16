//=================================================================================
//SETTING UP SERVER FOR CASES AND MESSAGES
//=================================================================================
var express         = require('express');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var app             = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

var port = process.env.PORT || 3002; // set our port

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/lawfirmResources'); // connect to our database

var db = mongoose.connection;



var Message = require('./app/models/message');
var CaseInfo    = require('./app/models/caseInfo');


// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});


router.get('/', function(req, res) {

    res.json({ message: 'Api call successful' });
});


//=============================================================================
//                      on routes that end in /message
// ----------------------------------------------------
router.route('/message')

// create message post route (accessed at POST http://localhost:3002/api/messages)
    .post(function(req, res) {

        var message = new Message();
        message.title = req.body.title;
        message.bodyDescription = req.body.bodyDescription;
        message.createdBy = req.body.createdBy;
        message.attorney = req.body.attorney;
        message.practiceArea = req.body.attorney


        // set message name (comes from the request)
        console.log("body:" + req.body);

        // get caseinfo case name (comes from the request)
        console.log("message:" + message.title);
        message.save(function(err)
        {
            if (err)
            {
                res.send(err);
            }

            Message.find().exec( function( err, messageList )
            {
                if( err ) return console.error( err );

                console.log('just retrieved message list : ' + messageList.length );
                res.json({ message: 'message name created!', messageList: messageList });
            });
        });


    })

    // get all the message data (accessed at GET http://localhost:3002/api/message)
    .get(function(req, res) {
        Message.find(function(err, message) {
            if (err)
                res.send(err);

            res.json(message);
        });
    });

// on routes that end in /message/:message_id
// ----------------------------------------------------
router.route('/message/:message_id')

// get the message with that id
    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    })

    // update message with this id
    .put(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {

            if (err)
                res.send(err);

            message.title = req.body.title;
            message.bodyDescription = req.body.bodyDescription;
            message.createdBy = req.body.createdBy;
            message.attorney = req.body.attorney;
            message.practiceArea = req.body.attorney;

            message.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Message data updated!' });
            });

        });
    })

    // delete message data with this id
    .delete(function(req, res) {
        Message.remove({
            _id: req.params.message_id
        }, function(err, message) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

//==================================================================================
//                           routes ending in caseInfo
//==================================================================================


router.route('/caseInfo')

// create caseinfo post route (accessed at POST http://localhost:3002/api/caseinfo)
    .post(function(req, res) {

        var caseInfo = new CaseInfo();
        caseInfo.caseName = req.body.caseName;
        caseInfo.caseNumber = req.body.caseNumber;
        caseInfo.practiceArea = req.body.practiceArea;
        caseInfo.attorney = req.body.attorney;
        caseInfo.customerName = req.body.customerName;


        // set caseinfo name (comes from the request)
        console.log("body:" + req.body);

        // get caseinfo case name (comes from the request)
        console.log("message:" + caseInfo.caseName);
        caseInfo.save(function(err)
        {
            if (err)
            {
                res.send(err);
            }

            CaseInfo.find().exec( function( err, caseList )
            {
                if( err ) return console.error( err );

                console.log('just retrieved caselist : ' + caseList.length );
                res.json({ caseInfo: 'caseInfo name created!', caseList: caseList });
            });
        });


    })

    // get all the cases data (accessed at GET http://localhost:3002/api/caseinfo)
    .get(function(req, res) {

        console.log('inside /api/caseInfo get');
        CaseInfo.find(function(err, caseInfo) {
            if (err)
                res.send(err);

            res.json(caseInfo);
        });
    });

router.route('/caseInfo/practiceArea').get(function( req, res )
{
    CaseInfo.distinct('practiceArea').exec( function( err, practiceAreaList )
    {
        if( err ) return console.error( err );

        console.log( practiceAreaList );
        res.json( { practiceAreaList: practiceAreaList });
    });
});


router.route('/caseInfo/attorney').get(function( req, res )
{
    CaseInfo.distinct('attorney').exec( function( err, attorneyList )
    {
        if( err ) return console.error( err );

        console.log( attorneyList );
        res.json( { attorneyList: attorneyList });
    });
});

// on routes that end in /caseinfo/:caseinfo_id
// ----------------------------------------------------
router.route('/caseInfo/:caseInfo_id')

// get the case information with the id
    .get(function(req, res) {
        CaseInfo.findById(req.params.caseInfo_id, function(err, caseInfo) {
            if (err)
                res.send(err);
            res.json(caseInfo);
        });
    })

    // update caseInfo with this id
    .put(function(req, res) {
        CaseInfo.findById(req.params.caseInfo_id, function(err, caseInfo) {

            if (err)
                res.send(err);

            caseInfo.caseName = req.body.caseName;
            caseInfo.caseNumber = req.body.caseNumber;
            caseInfo.practiceArea = req.body.practiceArea;
            caseInfo.attorney = req.body.attorney;
            caseInfo.customerName = req.body.customerName;

            caseInfo.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ caseInfo: 'cases data updated!' });
            });

        });
    })

    // delete caseinfo data with this id
    .delete(function(req, res) {
        CaseInfo.remove({
            _id: req.params.caseInfo_id
        }, function(err, caseInfo) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });




// REGISTER OUR ROUTES
app.use('/api', router);


//================================================================
// listening port
//================================================================
app.listen(port);
console.log('Magic happens on port ' + port);