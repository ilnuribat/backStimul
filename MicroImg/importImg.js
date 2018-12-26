var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://guov:guov@172.31.250.103:27017/guov?authSource=admin";
path = "111/"


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db("guov");
  fs.readdir(path, function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        // console.log(items[i]);
        const base64str = 'data:image/jpeg;base64,' + base64_encode(path + items[i]);
        // console.log(base64str)
        const myobj = {name: items[i].slice(0, -4), content: base64str, userId: null, email: null}

        dbo.collection("avatars").insertOne(myobj, function(err, res) {
          if (err) throw err;
          // console.log("1 document inserted");
        });
    }
    db.close();
  });
});

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return Buffer.from(bitmap).toString('base64');
}
