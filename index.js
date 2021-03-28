const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oukgz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  console.log('Database Connection Successfully!');

  // post request
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent);

    eventCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
    })
  });

  // get request
  app.get('/events', (req, res)=>{
    eventCollection.find()
    .toArray((error, documents) =>{
        res.send(documents);
    })
  });

  //delete request
  app.delete('/deleteEvent/:id', (req, res)=>{
      const id = ObjectID(req.params.id)
      console.log('delete this', id)
      eventCollection.findOneAndDelete({_id: id})
      .then(documents => res.send(!! documents.value))
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})