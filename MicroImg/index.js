const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

const url = 'mongodb://guov:guov@172.31.250.103:27017/guov?authSource=admin';
const dbName = 'guov';

app.get('/', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    const adminDb = client.db(dbName).admin();
    adminDb.listDatabases(function (err, dbs) {
      test.equal(null, err);
      test.ok(dbs.databases.length > 0);
      res.send(JSON.stringify(dbs))
      client.close();
    });
  });
});

app.get('/img/:id', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName);
    db.collection('avatars').findOne(
      { name: req.params.id},
      (err, r)=>{
        if(err){
          console.log('err', err);
          res.send('');
          client.close();
          return false;
        }
        if(r){
          console.log('data', r.email);
          console.log('data', r.name);
          const content = r.content.replace('data:image/jpeg;base64,', '')
          const img = Buffer.from(content, 'base64');
          res.writeHead(200, {
            'Content-Type': 'image/jpg',
            'Content-Length': img.length
          });
          res.end(img);

          client.close();
          return false;
        }
        console.log('no data');
        res.send('');
        client.close();
        return false;
      })
  });
});

app.listen(8000);