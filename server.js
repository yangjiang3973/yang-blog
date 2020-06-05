const MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const PostDAO = require('./dao/postDAO');
const UserDAO = require('./dao/userDAO');
const CommentDAO = require('./dao/commentDAO');

let url;
if (process.env.NODE_ENV === 'development') url = 'mongodb://localhost:27017';
else url = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 50,
    wtimeout: 2500
})
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await PostDAO.injectDB(client);
        await UserDAO.injectDB(client);
        await CommentDAO.injectDB(client);
        app.listen(process.env.PORT, () => {
            console.log(`listening on port 4000`);
        });
    });
