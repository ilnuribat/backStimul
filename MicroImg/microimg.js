const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

const url = 'mongodb://guov:guov@172.31.250.103:27017/guov?authSource=admin';
const dbName = 'guov';
const PORT = '8000';

console.log('Script')

app.get('/', function (req, res) {
  res.send('MicroImg');
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

        if (r && r.content){
          console.log('data', r.email);
          console.log('JSON', JSON.stringify(r.name));
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
        db.collection('avatars').findOne(
          { name: "defaultpng"},
          (err, r)=>{
            if(err){
              console.log('err', err);
              res.send('');
              client.close();
              return false;
            }
            const content = r.content.replace('data:image/png;base64,', '')
            const img = Buffer.from(content, 'base64');
            res.writeHead(200, {
              'Content-Type': 'image/png',
              'Content-Length': img.length
            });
            res.end(img);
            client.close();
          }
        )
        client.close();
        return false;
      })
  });
});

app.listen(PORT, function () {
  console.log(`Started on port ${PORT}!`);
});
