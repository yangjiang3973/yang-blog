# Chapter 0: create Atlas Cluster

1. Setup the Atlas Cluster

2. Introduction of structure of mflix:

    > front end: react (re-built and bundled) 

    > routing layer: express 

    > backend end: DAO(data access obj) and all operations of mongoDB will be in DAO

# Chapter 1: driver setup

1. MongoClient
``` javascript
import { MongoClient } from "mongodb";
const testClient = await MongoClient.connect;(process.env.MFLIX_DB_URI, 
    {
        connectTimeoutMS: 200,
        retryWrites: true,
        useNewUrlParser: true,
    });

/* database handler */
const mflixDB = testClient.db("mflix"); // use database: mflix
const allCollections = await mflixDB.listCollections().toArray();

/* collection handler */
const movies = mflixDB.collection("movies");
```

2. Async programming(overview)  
- callbacks
- promise
    > more declarative than callacks 

    > the driver will check if a callback is passed as a param, if not it will return a promise
- async/await 
    > this is a better way to handle promises and results in clean code.  
    
    > always use try/catch block for await  
    
    > TODO: more info about asyc/await 
3. Basic reads  
```javascript
/* _id is included by default if you do not speciufy _id: 0 */
const r = await movies.findOne({key:<filter>}, {projection:{key: 1}});  
```

```javascript
const r = await movies.find((key: {$all: ['condition1', `condition2`]}))

/* r is a cursor than implemented with a interface to iterate */
let {a, b, c} = r.next(); //use next() or toArray()
```

# Chapter2: User-Facing backend
1. Cursor methods and **Aggregation pipeline** stages

```javascript
/* const limitedCursor = movies
      .find({ key: target }, { _id: 0, title: 1 })
      .limit(2) 
    it is equivalent to this aggragation pipeline
*/
const simplePipeline = [
    { $match: { key: "target" } },
    { $project: { _id: 0, title: 1 } },
    { $limit: 2 },
];

const r = await movies.aggregate(simplePipeline).toArray();
```

2. Basic Aggregation
TODO: more info about aggregation!

3. Basic Write
It is very easy to use **insertOne** and **insertMany**.
But be careful with the returned result. Use it to check write status.
```javascript
let insertResult = await movies.insertOne({key: value});
let {n, ok, insertedId} = insertResult.result //n means number of docs inserted, ok means db response, insertedId is the _id created
```



durable writes: use write concerns to set durability  
```javascript
await users.insertOne({ name, email, password }, { w: 'majority' })
```

4. Basic Update:  
remember to use **$inc** for updating numbers!
```javascript
await theaters.updateOne(
    { theaterId: 8},
    {
        $set: {location: 'new location'},
        $inc: {
            'location.geo.x': -10,
            'location.geo.y': 20
        }
    }
)
```

upsert:  
update if exists, otherwise insert as a new doc: upsert!
```javascript
let upsertResult = await video.updateOne(
    {key: target},  // this is the query
    {
        $set: {  // this is the update
            key: newValue
        },
    },
    {upsert: true},  // upsert flag
);

// check result
upsertResult.result.nModified === 0 // if not exist
```

5. Basic Join:
> Join 2 collections of data  
> Use expressive $lookup  
TODO: more info here about $lookup!!!

here is an example:(join comments(foreign) on movies(local))
```javascript
{
    from: 'comments',
    let: {id: '$_id'},
    pipeline: [
        {
            $match:
                { $expr: ['$movie_id', '$$_id'] }
        },
        {
            $count: 'count'
        },
    ],
    as: 'movie_comments' /* will be an array of docs*/
}
```

6. Basic Delete:  

example:

```javascript
let deleteManyDocs = await videoGames.deleteMany({ year: { $lt: 1993 } })
```

# Chapter3: Admin backend
1. read concerns:

2. buld writes:
```javascript
// by default, it is ordered executions
const { modifiedCount } = await mflix.collection("movies").bulkWrite([`an array of operations`], {ordered: false});
```

# Chapter4: Resiliency
1. Connection polling:

This is related to chapter1: setup connections.

default number of connections is ***100***
``` javascript
import { MongoClient } from "mongodb";
const testClient = await MongoClient.connect;(process.env.MFLIX_DB_URI, 
    {
        connectTimeoutMS: 200,
        retryWrites: true,
        useNewUrlParser: true,
        poolSize: 50,  // here to set polling size as 50
        wtimeout: 2500,
    });
```

2. Robust client config:  
***wtimeout*** can be used to avoid gridlock, always use it with majority writes  

always config and handle ***serverSelectionTimeout*** errors.
by default the driver is going to wait 30 seconds  

3. Error handling:  
Distributed systems are prone to network issues, while concurrent systems will more likely encounter duplicate key errors.

use try/catch block to handle error to avoid crashing the app

4. Principle of least privilege:  

