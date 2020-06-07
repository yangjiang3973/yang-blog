module.exports = {
    bsonType: 'object',
    required: ['username', 'text'],
    properties: {
        username: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        text: {
            bsonType: 'string',
            description: 'must be a string and is required'
        }
    }
};
