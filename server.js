const express = require('express');
const app = express();
const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js');
const uri = "mongodb+srv://elmer:elmer@elmer.wgqba.mongodb.net/gameHighlights?retryWrites=true&w=majority";

var dbName = "highlightDb";
var gridfs = require('gridfs-stream');
var path = require('path');
const cors = require('cors');
app.use(cors());
const Grid = require('gridfs-stream');
const mime = require('mime');

const vidDir = path.join(__dirname + '/highlights/');


app.post('/uploadVideo',(req,res) => {


    mongodb.MongoClient.connect(uri, function(error, client) {
        assert.ifError(error);
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db);
 

        // var gfs = Grid(db,mongodb);
        
        req.
        pipe(bucket.openUploadStream('video.mp4',{
          contentType: 'video/mp4'
        })).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('finish', function() {
          res.send("👍");
          process.exit(0);
        });

        // req.pipe(gfs.createWriteStream({
        //   filename: 'video.mp4',
        //   content_type:'video/mp4'
        // }));

        });



})


app.get('/retrieveVideos',(req,res) => {

    mongodb.MongoClient.connect(uri,{useUnifiedTopology:true}, function(error,client){
        if (error) throw error;
        var db = client.db(dbName);

        var bucket = new mongodb.GridFSBucket(db);
        bucket.find()
        bucket.openDownloadStreamByName('video.mp4').
        pipe(fs.createWriteStream('highlights/output.mp4')).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('end', function() {
          console.log('nice');
          process.exit(0);
        });
        
        // var gfs = Grid(db,mongodb);
        // gfs.createReadStream({filename:'video.mp4'}).pipe(fs.createWriteStream('./highlights/output.mp4'));
        // res.setHeader('Content-disposition', 'attachment; filename=' +"video.mp4");
        // res.setHeader('Content-type', 'video/mp4');
        // var bucket = new mongodb.GridFSBucket(db); 
        // var  readstream = gfs.createReadStream({filename:'video.mp4'});
        // readstream.pipe(res);

      });
});



app.listen(4000, () =>{
    console.log('Server is running on port 4000. (=')
});