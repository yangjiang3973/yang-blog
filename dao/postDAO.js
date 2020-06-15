const { ObjectId } = require('mongodb');
const dbErrorHandler = require('../utils/dbErrorHandler');
const postsSchema = require('./postsSchema');

let postsCollection; // collections

class PostsDAO {
    static async injectDB(conn) {
        if (postsCollection) {
            return;
        }
        try {
            await conn.db('blog').command({
                collMod: 'posts',
                validator: {
                    $jsonSchema: postsSchema
                },
                validationLevel: 'strict',
                validationAction: 'error'
            });
            postsCollection = await conn.db('blog').collection('posts');
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in postDAO: ${e}`
            );
        }
    }
    static async getAllPosts() {
        try {
            const posts = await postsCollection.find({}).toArray();
            return posts;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getOnePost(id) {
        try {
            const post = await postsCollection.findOne({ _id: ObjectId(id) });
            return post;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async createManyPosts(posts) {
        try {
            await postsCollection.insertMany(posts);
            return;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async createOnePost(post) {
        try {
            return await postsCollection.insertOne(post);
            // for validation err, create AppError throw err here to pass err to dbErrorHandler
        } catch (err) {
            // throw err;
            dbErrorHandler(err);
        }
    }

    static async updatePost(id, data) {
        try {
            return await postsCollection.updateOne(
                { _id: ObjectId(id) },
                { $set: data }
            );
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async deletePost(id) {
        try {
            return await postsCollection.deleteOne({ _id: ObjectId(id) });
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getRecentPosts() {
        try {
            return await postsCollection
                .find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .toArray();
        } catch (error) {
            dbErrorHandler(err);
        }
    }

    //   static async getPostsList() {
    //     try {
    //       const docs = await posts
    //         .find({}, { projection: { title: 1 } })
    //         .limit(5)
    //         .toArray();
    //       return docs;
    //     } catch (error) {
    //       console.error(error);
    //       return null;
    //     }
    //   }

    //   static async test() {
    //     try {
    //       console.log("bbb");
    //       await posts.insertOne({ test: "hello" });
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
}

module.exports = PostsDAO;
