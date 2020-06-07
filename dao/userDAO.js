const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const dbErrorHandler = require('../utils/dbErrorHandler');
const validators = require('../utils/validators');
const usersSchema = require('./usersSchema');

let usersCollection; // collections

class UserDAO {
    static async injectDB(conn) {
        if (usersCollection) {
            return;
        }
        try {
            await conn.db('blog').command({
                collMod: 'users',
                validator: {
                    $jsonSchema: usersSchema
                },
                validationLevel: 'strict',
                validationAction: 'error'
            });
            usersCollection = await conn.db('blog').collection('users');
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in userDAO: ${e}`
            );
        }
    }

    static async createOneUser(user) {
        try {
            const { password, passwordConfirm } = user;
            if (!validators.validatePassowrd(password, passwordConfirm))
                throw new AppError(400, 'your password does not match');
            user.password = await bcrypt.hash(password, 10);
            delete user.passwordConfirm;
            return await usersCollection.insertOne(user);
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getAllUsers() {
        try {
            const users = await usersCollection
                .find({}, { projection: { password: 0 } })
                .toArray();
            return users;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async getOneUser(id) {
        try {
            const user = await usersCollection.findOne(
                { _id: ObjectId(id) },
                { projection: { password: 0 } }
            );
            return user;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async updateUser(id, data) {
        try {
            return await usersCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $set: data
                }
            );
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async deleteUser(id) {
        try {
            return await usersCollection.deleteOne({ _id: ObjectId(id) });
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    // static async findUserByEmail(email) {
    //     try {
    //         return await usersCollection.findOne({ email: email });
    //     } catch (error) {
    //         dbErrorHandler(err);
    //     }
    // }
    static async checkUserPassword(email, password) {
        const user = await usersCollection.findOne({ email: email });
        if (!user)
            throw new AppError(
                401,
                'No user matches this email, Please provide a valid one'
            );
        const correct = await bcrypt.compare(password, user.password);
        return { user, correct };
    }
}

module.exports = UserDAO;
