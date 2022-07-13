const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// process.on('uncaughtException', err => {
//     console.log('uncaught exception! shutting down...');
//     console.log(err.name, err.message);
//     process.exit(1);
// });

const app = require('./app');
const PostDAO = require('./dao/postDAO');
const UserDAO = require('./dao/userDAO');
const CommentDAO = require('./dao/commentDAO');

let url;
if (process.env.NODE_ENV === 'development') url = 'mongodb://localhost:27017';
else url = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

let server;
MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 50,
    wtimeout: 2500,
})
    .then(async (client) => {
        const collectionNames = await client
            .db('blog')
            .listCollections({}, { nameOnly: true })
            .toArray();
        await PostDAO.injectDB(client, collectionNames);
        await UserDAO.injectDB(client, collectionNames);
        await CommentDAO.injectDB(client, collectionNames);
        server = app.listen(process.env.PORT, () => {
            console.log(
                `listening on port 4000 in ${process.env.NODE_ENV} mode`
            );
        });
    })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });

// globally handle unhandled rejection
process.on('unhandledRejection', (err) => {
    console.log('unhandled rejection! shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
