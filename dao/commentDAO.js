const { ObjectId } = require('mongodb');

let commentsCollection; // collections

class CommentDAO {
    static async injectDB(conn) {
        if (commentsCollection) {
            return;
        }
        try {
            commentsCollection = await conn.db('blog').collection('comments');
        } catch (e) {
            console.error(
                {}`Unable to establish a collection handle in commentDAO: ${e}`
            );
        }
    }

    static async createOneComment(comment) {
        try {
            await commentsCollection.insertOne(comment);
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static async getAllComments() {
        try {
            const comments = await commentsCollection.find({}).toArray();
            return comments;
        } catch (err) {
            console.error(err);
        }
    }

    static async getOneComment(id) {
        try {
            const comment = await commentsCollection.findOne({
                _id: ObjectId(id)
            });
            return comment;
        } catch (err) {
            console.log('CommentDAO -> getOneComment -> err', err);
        }
    }

    static async updateComment(id, data) {
        try {
            const r = await commentsCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $set: data
                }
            );
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static async deleteComment(id) {
        try {
            await commentsCollection.deleteOne({ _id: ObjectId(id) });
            return;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = CommentDAO;
