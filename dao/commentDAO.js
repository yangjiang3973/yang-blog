const { ObjectId } = require('mongodb');
const dbErrorHandler = require('../utils/dbErrorHandler');
const commentsSchema = require('./commentsSchema');

let commentsCollection; // collections

class CommentDAO {
    static async injectDB(conn, collectionNames) {
        if (commentsCollection) {
            return;
        }
        try {
            // check if collection exists in db
            let existFlag = false;
            for (let i = 0; i < collectionNames.length; i++) {
                if (collectionNames[i].name === 'comments') {
                    existFlag = true;
                    break;
                }
            }
            // create collection
            if (existFlag === false) {
                commentsCollection = await conn
                    .db('blog')
                    .createCollection('comments', {
                        validator: {
                            $jsonSchema: commentsSchema,
                        },
                        validationLevel: 'strict',
                        validationAction: 'error',
                    });
            } else {
                commentsCollection = await conn
                    .db('blog')
                    .collection('comments');
                await conn.db('blog').command({
                    collMod: 'comments',
                    validator: {
                        $jsonSchema: commentsSchema,
                    },
                    validationLevel: 'strict',
                    validationAction: 'error',
                });
            }
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in commentDAO: ${e}`
            );
        }
    }

    static async createOneComment(comment) {
        comment.createdAt = new Date();
        comment.postId = ObjectId(comment.postId);
        try {
            const r = await commentsCollection.insertOne(comment);
            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(404, 'Failed to create a new comment');
            }
            return;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getAllComments() {
        try {
            const comments = await commentsCollection.find({}).toArray();
            return comments;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getOneComment(id) {
        try {
            const comment = await commentsCollection.findOne({
                _id: ObjectId(id),
            });
            return comment;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async updateComment(id, data) {
        try {
            const r = await commentsCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $set: data,
                }
            );

            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(500, 'Failed to update this comment');
            }
            return r;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async deleteComment(id) {
        try {
            const r = await commentsCollection.deleteOne({ _id: ObjectId(id) });
            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(404, 'Failed to delete this comment');
            }
            return;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getCommentsByPostId(id) {
        const postId = ObjectId(id);
        try {
            const comments = await commentsCollection
                .find(
                    { postId },
                    {
                        projection: {
                            _id: 0,
                            postId: 0,
                        },
                    }
                )
                .toArray();
            return comments;
        } catch (err) {
            dbErrorHandler(err);
        }
    }
}

module.exports = CommentDAO;
