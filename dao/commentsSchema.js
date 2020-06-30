module.exports = {
    bsonType: 'object',
    required: ['username', 'text', 'createdAt'],
    properties: {
        username: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        text: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        postId: {
            bsonType: 'objectId'
        },
        createdAt: {
            bsonType: 'date',
            description: 'mist be a date and is required'
        }
    }
};
