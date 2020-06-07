module.exports = {
    bsonType: 'object',
    required: ['name', 'email', 'password'],
    properties: {
        name: {
            bsonType: 'string',
            description:
                'must be a string and is required and is unique indexed'
        },
        email: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        password: {
            bsonType: 'string',
            minLength: 8,
            description:
                'must be a string and is longer than 8 char and is required'
        }
    }
};
