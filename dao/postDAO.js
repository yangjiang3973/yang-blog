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
            postsCollection = await conn.db('blog').collection('posts');
            await conn.db('blog').command({
                collMod: 'posts',
                validator: {
                    $jsonSchema: postsSchema,
                },
                validationLevel: 'strict',
                validationAction: 'error',
            });
        } catch (error) {
            console.error(
                `Unable to establish a collection handle in postDAO: ${error}`
            );
        }
    }
    static async getAllPosts() {
        try {
            const posts = await postsCollection.find({}).toArray();
            return posts;
        } catch (error) {
            dbErrorHandler(error);
        }
    }

    static async getOnePost(id) {
        try {
            const post = await postsCollection.findOne({ _id: ObjectId(id) });
            if (!post) {
                throw new AppError(404, 'No post found with that ID');
            }
            return post;
        } catch (error) {
            dbErrorHandler(error);
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
            // const client = algoliasearch(
            //     process.env.ALGOLIA_ID,
            //     process.env.ALGOLIA_ADMIN_KEY
            // );
            // const index = client.initIndex('dev_posts');
            // const res = await index.saveObject(post, {
            //     autoGenerateObjectIDIfNotExist: true,
            // });

            // if (!res.objectID)
            //     throw new AppError(503, 'Failed to sync data to Algolia!');
            return;
        } catch (error) {
            dbErrorHandler(error);
        }
    }

    static async updatePost(id, data) {
        try {
            const r = await postsCollection.updateOne(
                { _id: ObjectId(id) },
                { $set: data }
            );

            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(404, 'Failed to update this post');
            }

            return;
        } catch (error) {
            dbErrorHandler(error);
        }
    }

    static async deletePost(id) {
        try {
            const r = await postsCollection.deleteOne({ _id: ObjectId(id) });
            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(404, 'Failed to delete this post');
            }
            return;
        } catch (error) {
            dbErrorHandler(error);
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
            dbErrorHandler(error);
        }
    }

    static async getPostsByTag(tag) {
        try {
            const posts = await postsCollection.find({ tags: tag }).toArray();
            return posts;
        } catch (error) {
            dbErrorHandler(error);
        }
    }
}

module.exports = PostsDAO;
