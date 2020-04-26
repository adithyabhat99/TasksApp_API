// This is not required, this is low level interfacing with mongodb
// Use mongoose for better validation and modelling

const { MongoClient, ObjectID } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const dbname =  "taskManager";

MongoClient.connect(connectionUrl,{ useNewUrlParser: true, useUnifiedTopology: true }, (error,client) => {
    if(error){
        return console.log("Unable o connect to database");
    }
    // console.log("DB Connected");
    const db = client.db(dbname);
    // crud operations here
    // db.collection("users").find() and findOne
    // db.collection("users").updateMany() and updateMany, you can use $set, $unset etc here
    // similar ones are insert and insertOne, delete and deleteOne
    // These methods can be hanndled using callbacks as well as promises

   
   // Insert exaples:
   // db.collection('users').insertOne({
    //     name: 'Andrew',
    //     age: 27
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28
    //     }, {
    //         name: 'Gunther',
    //         age: 27
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents!')
    //     }

    //     console.log(result.ops)
    // })



    // Update exaples(used ObjectId as well):

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5c0fe6634362c1fb75b9d6b5")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })
    
    
    // Delete examples:


    // db.collection('users').deleteMany({
    //     age: 27
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').deleteOne({
    //     description: "Clean the house"
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
});