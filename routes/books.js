var router = require('express').Router();
var pg = require('pg'); //pg needs to know what database we are using

var config = {
    database: 'paulkatchmark'
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){

  // err - an error object, will be not-null if there was an error connecting
  //       possible errors, db not running, config is wrong

  // client - object that is used to make queries against the db

  // done - function to call when you're done (returns connection back to the pool)
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    // 1. SQL string
    // 2. (optional)  input parameters
    // 3. callback function to execute once the query is finished
    //      takes an error object and a result object as args
    client.query('SELECT * FROM books;', function(err, result){
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.get('/:id', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }
    client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function(err, result){
      done();
      if (err) {
        console.log('Another error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res){
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO books (author, title, published, edition, publisher) VALUES ($1, $2, $3, $4, $5) returning *;',
                 [req.body.author, req.body.title, req.body.published, req.body.edition, req.body.publisher],
                 function(err, result){
                   done();
                   if (err) {
                     console.log('Error querying the DB', err);
                     res.sendStatus(500);
                     return;
                   }
                   console.log('Got rows from the DB:', result.rows);
                   res.send(result.rows);
                 });
  });
});

module.exports = router;






















// initialize the database connection pool, need this for any connection to database
// var pool = new pg.Pool(config);
// router.get('/:id', function(req, res) {
//     pool.connect(function(err, client, done) {
//         if (err) {
//             console.log("error connecting to the DB", err);
//             res.sendStatus(500);
//             done();
//             return;
//         }
//         //NEED MORE CODE HERE TO FINISH
//         client.query('SELECT * FROM books WHERE id = $1;', function(err, result) {
//             if (err) {
//                 console.log("Error querying the DB", err);
//                 res.sendStatus(500);
//                 done();
//                 return;
//             }
//             console.log('Got rows from the DB:', result.rows);
//             res.send(result.rows);
//         });
//     });
// });
// router.get('/', function(req, res) {
//
//     //err - an error object, will be not-null if there was an error connecting
//     //      possible  errors, db not running, config is wrong
//
//     // client - an ovjet that is used to ae queries against the db
//
//     // done - function to call when you're done (returns connection back to the pool)
//     pool.connect(function(err, client, done) {
//         if (err) {
//             console.log("error connecting to the DB", err);
//             res.sendStatus(500);
//             done();
//             return;
//         }
//         // 1. SQL string
//         // 2. (optional) input parameters
//         // 3. callback function to execute once the query is finished
//         //        takes an error object and a result ovject as args
//         client.query('SELECT * FROM books', function(err, result) {
//             done();
//             if (err) {
//                 console.log("Error querying the DB", err);
//                 res.sendStatus(500);
//                 done();
//                 return;
//             }
//             // result is a defualt js thing, rows is our data
//             console.log('Got rows from the DB:', result.rows);
//             res.send(result.rows);
//         });
//     });
// });
// router.post('/', function(req, res) {
//     pool.connect(function(err, client, done) {
//         if (err) {
//           console.log('error connecting the DB:', err);
//             res.sendStatus(500);
//             done();
//             return;
//         }
//         client.query('INSERT INTO books (author, title, published) VALUES($1, $2, $3) returning *', [req.body.author, req.body.title, req.body.published], function(err, result) {
//             done();
//             if (err) {
//               console.log('error querying the DB:', err);
//                 res.sendStatus(500);
//                 return;
//             }
//             res.send(result.rows);
//         });
//     });
// });
//
// module.exports = router;

// POST = Create
// GET = Read
// PUT = Update
// DELETE = Delete
