const express = require('express');
const app = express();
const assert = require('assert');
const fs = require('fs');

const mongodb = require('mongodb');
const uri = "mongodb+srv://elmer:elmer@elmer.wgqba.mongodb.net/gameHighlights?retryWrites=true&w=majority";
const upload = require('express-fileupload');
var dbName = "highlightDb";
var path = require('path');
const cors = require('cors');
app.use(cors());
app.use(upload());
const mime = require('mime');
// const fileUpload = require('express-fileupload');

const vidDir = path.join(__dirname + '/highlights/');




app.post('/uploadVideo',(req,res) => {


    mongodb.MongoClient.connect(uri, function(error, client) {
        assert.ifError(error);
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db);
        // file = req.files.highlight

        // file.mv('/highlights/video.mp4')
        
        fs.createReadStream('./video.mp4').
        pipe(bucket.openUploadStream('video.mp4')).
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
        res.setHeader('Content-disposition', 'inline; filename=' +"video.mp4");
        res.setHeader('Content-type', 'video/mp4');
        bucket.openDownloadStreamByName('video.mp4').
        pipe(res).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('end', function() {

          console.log('nice');
        });
        
        // var gfs = Grid(db,mongodb);
        // gfs.createReadStream({filename:'video.mp4'}).pipe(fs.createWriteStream('./highlights/output.mp4'));

        // var bucket = new mongodb.GridFSBucket(db); 
        // var  readstream = gfs.createReadStream({filename:'video.mp4'});
        // readstream.pipe(res);

      });
});



app.listen(8080, () =>{
    console.log('Server is running on port 8080. (=')
});