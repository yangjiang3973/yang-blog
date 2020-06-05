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
        // try {
        //     console.log(ObjectId('wwwww'));
        //     const post = await postsCollection.findOne({ _id: ObjectId(id) });
        //     return post;
        // } catch (err) {
        //     console.error(err);
        // }
        const post = await postsCollection.findOne({ _id: ObjectId(id) });
        return post;
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
            return await postsCollection.insertOne(post);
        } catch (err) {
            console.error(err);
        }
    }

    static async updatePost(id, data) {
        try {
            return await postsCollection.updateOne(
                { _id: ObjectId(id) },
                { $set: data }
            );
        } catch (err) {
            console.error(err);
        }
    }

    static async deletePost(id) {
        try {
            return await postsCollection.deleteOne({ _id: ObjectId(id) });
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
