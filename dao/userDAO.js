const { ObjectId } = require('mongodb');

let usersCollection; // collections

class UserDAO {
    static async injectDB(conn) {
        if (usersCollection) {
            return;
        }
        try {
            usersCollection = await conn.db('blog').collection('users');
        } catch (e) {
            console.error(
                {}`Unable to establish a collection handle in userDAO: ${e}`
            );
        }
    }

    static async createOneUser(user) {
        try {
            await usersCollection.insertOne(user);
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static async getAllUsers() {
        try {
            const users = await usersCollection.find({}).toArray();
            return users;
        } catch (err) {
            console.error(err);
        }
    }

    static async getOneUser(id) {
        try {
            const user = await usersCollection.findOne({ _id: ObjectId(id) });
            return user;
        } catch (err) {
            console.log('UserDAO -> getOneUser -> err', err);
        }
    }

    static async updateUser(id, data) {
        try {
            const r = await usersCollection.updateOne(
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

    static async deleteUser(id) {
        try {
            await usersCollection.deleteOne({ _id: ObjectId(id) });
            return;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = UserDAO;
