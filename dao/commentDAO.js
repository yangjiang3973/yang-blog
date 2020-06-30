const { ObjectId } = require('mongodb');
const dbErrorHandler = require('../utils/dbErrorHandler');
const commentsSchema = require('./commentsSchema');

let commentsCollection; // collections

class CommentDAO {
    static async injectDB(conn) {
        if (commentsCollection) {
            return;
        }
        try {
            await conn.db('blog').command({
                collMod: 'comments',
                validator: {
                    $jsonSchema: commentsSchema
                },
                validationLevel: 'strict',
                validationAction: 'error'
            });
            commentsCollection = await conn.db('blog').collection('comments');
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
            return await commentsCollection.insertOne(comment);
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
                _id: ObjectId(id)
            });
            return comment;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async updateComment(id, data) {
        try {
            return await commentsCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $set: data
                }
            );
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async deleteComment(id) {
        try {
            return await commentsCollection.deleteOne({ _id: ObjectId(id) });
        } catch (err) {
            dbErrorHandler(err);
        }
    }
}

module.exports = CommentDAO;
