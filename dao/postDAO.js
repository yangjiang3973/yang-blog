const { ObjectId } = require('mongodb');

let postsCollection; // collections

class PostsDAO {
    static async injectDB(conn) {
        if (postsCollection) {
            return;
        }
        try {
            postsCollection = await conn.db('blog').collection('posts');
        } catch (e) {
            console.error(
                {}`Unable to establish a collection handle in userDAO: ${e}`
            );
        }
    }
    static async getAllPosts() {
        try {
            const posts = await postsCollection.find({}).toArray();
            return posts;
        } catch (err) {
            console.error(err);
        }
    }

    static async getOnePost(id) {
        try {
            const post = await postsCollection.findOne({ _id: ObjectId(id) });
            return post;
        } catch (err) {
            console.error(err);
        }
    }

    static async createManyPosts(posts) {
        try {
            await postsCollection.insertMany(posts);
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static async createOnePost(post) {
        try {
            await postsCollection.insertOne(post);
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static async updatePost(id, data) {
        try {
            await postsCollection.updateOne(
                { _id: ObjectId(id) },
                { $set: data }
            );
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static async deletePost(id) {
        try {
            await postsCollection.deleteOne({ _id: ObjectId(id) });
            return;
        } catch (err) {
            console.error(err);
        }
    }

    //   static async getRecentPosts() {
    //     try {
    //       return await posts
    //         .find({})
    //         .limit(5)
    //         .toArray();
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }

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
