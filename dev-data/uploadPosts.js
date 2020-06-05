const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const MongoClient = require("mongodb").MongoClient;
const PostsDAO = require("../dao/postDAO");

const url = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);

const urlTest = "mongodb://localhost:27017";

MongoClient.connect(urlTest, {
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
    try {
      await PostsDAO.injectDB(client);
    } catch (err) {
      console.log(err);
    }

    const posts = JSON.parse(
      fs.readFileSync(`${__dirname}/posts.json`, "utf-8")
    );

    if (process.argv[2] === "--import") {
      try {
        await PostsDAO.createManyPosts(posts);
        console.log("Data loaded!");
        process.exit();
      } catch (err) {
        console.log(err);
      }
    } else if (process.argv[2] === "--delete") {
      try {
        await postsCollection.deleteMany({});
        console.log("Data deleted!");
        process.exit();
      } catch (err) {
        console.log(err);
      }
    }
  });
