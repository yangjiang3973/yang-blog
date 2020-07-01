const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
            if (!user.role) user.role = 'user'; // by default
            if (!user.active) user.active = true;
            if (!user.email) user.email = 'abc@abc.com';

            if (!user.password) {
                user.password = crypto.randomBytes(32).toString('hex');
            } else {
                const { password, passwordConfirm } = user;

                if (!validators.validatePassowrd(password, passwordConfirm))
                    throw new AppError(400, 'your password does not match');
                user.password = await bcrypt.hash(password, 10);
                delete user.passwordConfirm;
            }

            const r = await usersCollection.insertOne(user);
            return r;
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
            const r = await usersCollection.findOneAndUpdate(
                { _id: ObjectId(id) },
                {
                    $set: data
                },
                {
                    returnOriginal: false,
                    projection: { password: 0, active: 0 }
                }
            );
            return r;
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

    static async findUserByEmail(email) {
        try {
            const user = await usersCollection.findOne({ email: email });
            return user;
        } catch (error) {
            dbErrorHandler(err);
        }
    }

    static async findUserByName(name) {
        try {
            const user = await usersCollection.findOne({ name });
            return user;
        } catch (error) {
            dbErrorHandler(err);
        }
    }

    static async checkUserPassword(email, password) {
        try {
            const user = await usersCollection.findOne({ email: email });
            if (!user)
                throw new AppError(
                    401,
                    'No user matches this email, Please provide a valid one'
                );
            const correct = await bcrypt.compare(password, user.password);
            return { user, correct };
        } catch (error) {
            dbErrorHandler(err);
        }
    }

    static async createPasswordResetToken(userId) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await usersCollection.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    passwordResetToken: passwordResetToken,
                    passwordResetExpires: passwordResetExpires
                }
            }
        );
        return resetToken;
    }

    static async deletePasswordResetToken(user) {
        const r = await usersCollection.findOneAndUpdate(
            { _id: user._id },
            {
                $unset: {
                    passwordResetToken: 1,
                    passwordResetExpires: 1
                }
            }
        );
        return r;
    }

    static async findUserByToken(hashedToken) {
        const user = await usersCollection.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date(Date.now()) }
        });
        return user;
    }

    static async resetPassword(userId, newPassword, newPasswordConfirm) {
        if (!validators.validatePassowrd(newPassword, newPasswordConfirm))
            throw new AppError(400, 'your password does not match');

        const password = await bcrypt.hash(newPassword, 10);
        await usersCollection.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    password,
                    passwordChangedAt: new Date(Date.now())
                },
                $unset: {
                    passwordResetToken: 1,
                    passwordResetExpires: 1
                }
            }
        );
    }
}

module.exports = UserDAO;
