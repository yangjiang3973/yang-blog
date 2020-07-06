const { ObjectId } = require('mongodb');
const algoliasearch = require('algoliasearch');
const AppError = require('../utils/appError');

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

    // static async createManyPosts(posts) {
    //     try {
    //         const r = await postsCollection.insertMany(posts);
    //         console.log(r);
    //         return;
    //     } catch (err) {
    //         dbErrorHandler(err);
    //     }
    // }

    static async createOnePost(post) {
        if (!post.createdAt) post.createdAt = new Date(Date.now());
        try {
            const r = await postsCollection.insertOne(post);
            if (r.result.ok !== 1)
                throw new AppError(
                    500,
                    'Cannot create data in database, please try again later!'
                );
            // sync data to algolia after inserting to DB successfully
            const client = algoliasearch(
                process.env.ALGOLIA_ID,
                process.env.ALGOLIA_ADMIN_KEY
            );
            const index = client.initIndex('dev_posts');
            const res = await index.saveObject(post, {
                autoGenerateObjectIDIfNotExist: true
            });

            if (!res.objectID)
                throw new AppError(503, 'Failed to sync data to Algolia!');
            return;
        } catch (err) {
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

    static async getPostsByTag(tag) {
        try {
            const posts = await postsCollection.find({ tags: tag }).toArray();
            return posts;
        } catch (err) {
            dbErrorHandler(err);
        }
    }
}

module.exports = PostsDAO;
