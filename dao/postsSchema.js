module.exports = {
    bsonType: 'object',
    required: ['title', 'text'],
    properties: {
        title: {
            bsonType: 'string',
            description:
                'must be a string and is required and is unique indexed'
        },
        text: {
            bsonType: 'string',
            description: 'must be a string and is required'
        }
    }
};
