const express =  require('express')
const port = process.env.PORT || 7777
const app = express()
const bodyParser = require('body-parser');
const users = require('./data/users');
const mongojs = require('./db');
const db = mongojs.connect;
const Faker = require('Faker')

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
      extended: true
}))

app.get('/', (req,res) => {
      db.users.count(function (err, result) {
            
            var add = result + 5;
            for (var i = result + 1; i <= add ; i++){
                  var json = {
                        "id": i
                        ,"username": Faker.Internet.userName()
                        ,"name": Faker.Name.findName()
                        ,"city": Faker.Address.city()
                        ,"position": Faker.Address.city()
                  };
                  db.users.insert(json, function (err, docs) {

                  });
                  
            }
            res.send(json);
            // if (result <= 0) {
            //       
            // }
            
      });
})

app.get('/index', (req,res) => {
      res.send('This index page')
})

app.get('/user', function (req, res) {
      db.users.find(function (err, docs) {
            res.json(docs);
      });
});

app.get('/user/:id', function (req, res) {
      var id = parseInt(req.params.id);

      db.users.findOne({id: id}, function(err, docs) {
      if (err) throw err;
      res.json(docs);
    });
});

app.post('/newuser', function (req, res) {
      var json = req.body;
      db.users.insert(json, function (err, docs) {
            if (err) throw err;
            res.send('Add new ' + docs.name + ' Completed!');
      });

});

app.get('/user/update/:id', function (req, res) {
      var id = parseInt(req.params.id);
      var city =  Faker.Address.city();
      var position = Faker.Address.city();
      var myquery = { id: id };
      var newvalues = { $set: { city: city,position: position } };
      db.users.update(myquery, newvalues, function(err, docs) {
            if (err) throw err;
            res.json(docs);
      });
});

app.get('/user/del/:id', function (req, res) {
      var id = parseInt(req.params.id);
      var myquery = { id: id };
      db.users.remove(myquery, function (err, docs) {
            if (err) throw err;
            res.json(docs);
      });
});

app.listen(port, () => {
      console.log('Start ndoe.js on http://localhost:'+port)
})

