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
//
// =============================================================================
// Routes
// =============================================================================
//
// create our router
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});
// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
}) // not closing with a semi colon because chaining the function calls
// =============================================================================
// GridFS routes (that end in /files)
// =============================================================================
//
//POST ROUTE
//
// writing a file (accessed at POST http://localhost:3001/api/files) to the database
router.post('/', function(req, res) {
    console.log("Files route POST /");
    // lets see what the request looks like
    console.log(req);
    var part = req.files.file;
    console.log(part);
    // add the user who uploaded the file to the metadata field of the GridFS file document
    var metadata = {
        // username: req.body.username,
        // chatid: req.body.chatid
    };
    var gfs = Grid(conn.db);
    // writes the file provided to the GridFS collections with the name the user assigned, May have to look for
    //      collisions and create a view-by-name that is unique
    var writeStream = gfs.createWriteStream({
        filename: part.name,
        mode: 'w',
        content_type: part.mimetype,
        metadata: {
            userId: req.body.userId
        }
    });
    // responding to request and closing connection
    writeStream.on('close', function(file) {
        console.log("response output");
        // send back the fileid
        res.json({
            id: file._id,
            uploadDate: file.uploadDate,
            filename: file.filename
        });
    });
    // writes the data to GridFS?
    writeStream.write(part.data);
    console.log("after writeStream.write()");
    // closes the write stream
    writeStream.end();
    console.log("after writeStream.end()");
});
//
// GET ROUTE for all files
//
router.get('/files/everything', function(req, res) {
    console.log('everything')
    var gfs = Grid(conn.db);
    gfs.files.find({}).toArray(function(err, file) {
        if (file.length === 0) {
            return res.status(400).send({
                message: 'File not found'
            });
        }
        if (err) res.send(err);
        return res.status(200).json(file);
    });
});
//
//GET ROUTE for download route for specific file
//
router.get('/files/:file_id', function(req, res) {
    var gfs = Grid(conn.db);
    console.log('single file download')
    console.log(req.params.file_id)
    gfs.files.find({ "_id": mongoose.Types.ObjectId(req.params.file_id) }).toArray(
        function(err, file) {
            if (err) {
                console.log('error')
                res.send(err);
            }
            var readstream = gfs.createReadStream({
                filename: file[0].filename,
                contentType: file[0].contentType
            });
            res.set('Content-Type', file[0].contentType);
            res.set('Content-Disposition', 'attachment; filename=' + file[0].filename);
            console.log(res);
            readstream.pipe(res);
        });
});
//
// Delete Route
//
router.delete('/files/:file_id', function(req, res) {
    console.log(req.params.file_id);
    var gfs = Grid(conn.db);
    gfs.chunks.remove({ 'files_id': req.params.fileId });
    gfs.files.remove({ '_id': req.params.file_id });
});

app.use('/api', router);
app.listen(port);
console.log('Listening on port 3001...');