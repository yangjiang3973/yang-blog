const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
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
                    $jsonSchema: usersSchema,
                },
                validationLevel: 'strict',
                validationAction: 'error',
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
            user.role = 'user'; // by default
            user.active = true;
            if (!user.email) {
                user.email = crypto.randomBytes(10).toString('hex');
                while (await usersCollection.findOne({ email: user.email })) {
                    user.email = crypto.randomBytes(10).toString('hex');
                }
                user.emailMissing = true;
            } else {
                user.email = user.email.toLowerCase();
                user.emailMissing = false;
            }
            if (!user.password) {
                user.password = crypto.randomBytes(16).toString('hex');
                user.passwordMissing = true;
            } else {
                const { password, passwordConfirm } = user;
                if (!validators.validatePassowrd(password, passwordConfirm))
                    throw new AppError(400, 'your password does not match');
                user.password = await bcrypt.hash(password, 10);
                delete user.passwordConfirm;
                user.passwordMissing = false;
            }
            if (await usersCollection.findOne({ name: user.name })) {
                throw new AppError(
                    400,
                    'your name has been registered, please choose a new one!'
                );
            }
            if (await usersCollection.findOne({ email: user.email })) {
                throw new AppError(
                    400,
                    'your email has been registered, please choose a new one!'
                );
            }

            const r = await usersCollection.insertOne(user);
            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(404, 'Failed to create a new user');
            }
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
            if (!user) {
                throw new AppError(404, 'No user found with that ID');
            }
            return user;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async updateUser(id, data) {
        // if update email, need to validate
        if (data.email) {
            if (validator.isEmail(data.email)) data.emailMissing = false;
            else throw new AppError(400, 'Please input a valid email address');
        }
        try {
            const r = await usersCollection.findOneAndUpdate(
                { _id: ObjectId(id) },
                {
                    $set: data,
                },
                {
                    returnOriginal: false,
                    projection: { password: 0, active: 0 },
                }
            );
            if (r.ok !== 1)
                throw new AppError(
                    500,
                    'Failed to update, please try again later!'
                );
            return r;
        } catch (err) {
            dbErrorHandler(err);
        }
    }

    static async deleteUser(id) {
        try {
            await usersCollection.deleteOne({ _id: ObjectId(id) });
            if (r.result.ok !== 1 || r.result.n === 0) {
                throw new AppError(404, 'Failed to delete this user');
            }
            return;
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

    static async findUserByField(query) {
        try {
            const user = await usersCollection.findOne(query);
            return user;
        } catch (error) {
            dbErrorHandler(err);
        }
    }

    static async checkUserPassword(email, password) {
        try {
            const user = await usersCollection.findOne({ email: email });
            if (!user) throw new AppError(401, 'Incorrect password or email');
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
                    passwordResetExpires: passwordResetExpires,
                },
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
                    passwordResetExpires: 1,
                },
            }
        );
        return r;
    }

    static async findUserByToken(hashedToken) {
        const user = await usersCollection.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date(Date.now()) },
        });
        return user;
    }

    static async resetPassword(userId, newPassword, newPasswordConfirm) {
        if (!validators.validatePassowrd(newPassword, newPasswordConfirm))
            throw new AppError(400, 'your password does not match');

        const password = await bcrypt.hash(newPassword, 10);
        const r = await usersCollection.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    password,
                    passwordChangedAt: new Date(Date.now()),
                    passwordMissing: false,
                },
                $unset: {
                    passwordResetToken: 1,
                    passwordResetExpires: 1,
                },
            }
        );
        return r;
    }
}

module.exports = UserDAO;
