// =============================================================================
//
// BASE SETUP
//
// =============================================================================

/********************************************************************************
*
*   Base Setup
*
********************************************************************************/

// call the packages
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');


// bodyparser handling file uploads
var busboyBodyParser = require('busboy-body-parser');


/********************************************************************************
*
* database connection
*
********************************************************************************/
var conn = mongoose.connection;
var app = express();



// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboyBodyParser({ limit: '200mb' }));



// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});



// set the port
var port = process.env.PORT || 3001;
Grid.mongo = mongoose.mongo;
// connect to our mongoDB database instance hosted locally/ change database name near future


mongoose.connect('mongodb://127.0.0.1/lawfirmResources');
// adds the fs.chunks and fs.files collections to the mongo DB
conn.once('open', function() {
    console.log('open');
    var gfs = Grid(conn.db);
});


// =============================================================================
// Routes
// =============================================================================

// create our router

var router = express.Router();
// middleware to use for all requests


router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});


// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function( req, res ) {
    res.json({ message: 'hooray! welcome to our api!' });
})  // not closing with a semi colon because chaining the function calls


// =============================================================================
// GridFS routes (that end in /files)
// =============================================================================


// writing a file (accessed at POST http://localhost:3001/api/files) to the database
.post('/', function(req, res) {

    console.log("Files route POST /files");

    // lets see what the request looks like
    console.log(req);


    var part = req.files.file;


    // add the user who uploaded the file to the metadata field of the GridFS file document
    var metadata = {
        // username: req.body.username,
        // chatid: req.body.chatid
    };

    var gfs = Grid(conn.db);


    // writes the file provided to the GridFS collections with the name the user assigned, May have to look for
    //      collisions and create a view-by-name that is unique


    // filename, mode, etc... are the parameters received/(expected possibly required) with the request
    var writeStream = gfs.createWriteStream({

        filename: part.name,
        mode: 'w',
        content_type: part.mimetype,
        metadata: metadata

    });


    // responding to request and closing connection
    writeStream.on('close', function(file) {

        console.log("response output");

        // send back the fileid
        res.json({

            id: file._id,
            dateUploaded: file.uploadDate

        });
    });

    // writes the data to GridFS?
    writeStream.write(part.data);
    console.log("after writeStream.write()");


    // closes the write stream
    writeStream.end();
    console.log("after writeStream.end()");

});

// TODO: this is just an example, a detailed
// TODO:    List of what you want will be listed separately with
// TODO:    it's own search query
// TODO:

/************************************************************************
*
*       request at url /api/attorneyImages
*
*       Request Method: Get
*
*       Input Parameters: (none)
*
*       Output: format (json)
*               list of image files ending in jpg
*
*
*       Details:
*          Calling Mongo Gridfs and receiving the file
*           meta data, with the filename, and file.Id
*
*           the file.id is used with getUrl( /api/files/fild.id )
*               to retrieve the binary file from mongo gridFS
*
*
*
************************************************************************/
router.get('/attorneyImages', function( req, res )
{
    var gfs = Grid( conn.db );

    gfs.files.find({'filename': /jpg$/}).toArray( function( error, files )
    {
        if( files.length === 0 )
        {
            return res.status( 400 ).send( { message: 'File not found :(' });
        }

        var jpegImageNames = files.map( function( file ) { return {imageId: file._id, filename: file.filename }; });

        // for( var i = 0; i < files.length; i++ )
        // {
        //     var imageMeta = { imageId : files[i]._id, filename : files[i].filename };
        //     jpegImageNames.push( imageMeta );
        // }


        res.end( JSON.stringify( jpegImageNames ) );
    });
});


// get a specific file (accessed at GET http://localhost:3001/api/files/{file_id})
router.route('/files/:file_id').get(function(req, res) {

    console.log("hit the /files get route");
    // see what the request looks like

    console.log(req);

    var gfs = Grid(conn.db);


    // finds the specific file by id
    gfs.files.find({ "_id": mongoose.Types.ObjectId(req.params.file_id) }).toArray(function(err, files) {

        // if no results returned, send message that file was not found
        if (files.length === 0) {
            return res.status(400).send({
                message: 'File not found'
            });
        }


        console.log(files);
        console.log(files.length);


        // unsure why there is a need to specify the filename or contentType
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            contentType: files[0].contentType
        });


        // not sure if this is needed or not, but keeping it in here for now...
        res.set('Content-Type', files[0].contentType);


        // set up the readstream pipe to send the result out as a html response
        readstream.pipe(res);

    });

});

app.use('/api', router);
app.listen(port);
console.log('Listening on port 3001...');
