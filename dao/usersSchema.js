module.exports = {
    bsonType: 'object',
    required: ['name', 'email', 'password', 'role', 'active'],
    properties: {
        name: {
            bsonType: 'string',
            maxLength: 20,
            description:
                'must be a string and is required and is unique indexed'
        },
        githubUserName: {
            bsonType: 'string',
            description: 'must be a string'
        },
        email: {
            bsonType: 'string',
            description:
                'must be a string and is required and is unique indexed'
        },
        emailMissing: {
            bsonType: 'bool',
            description: 'must be a bool type'
        },
        password: {
            bsonType: 'string',
            description:
                'must be a string and is longer than 8 char and is required'
        },
        passwordMissing: {
            bsonType: 'bool',
            description: 'must be a bool type'
        },
        role: {
            bsonType: 'string',
            enum: ['admin', 'user', 'third-party user'],
            description:
                'must be a string and can only be one of the enum values'
        },
        active: {
            bsonType: 'bool',
            description: 'must be a bool type'
        },
        passwordChangedAt: {
            bsonType: 'date',
            description: 'must be a string'
        },
        passwordResetToken: {
            bsonType: 'string',
            description: 'must be a string'
        },
        passwordResetExpires: {
            bsonType: 'date',
            description: 'must be a date'
        }
    }
};
