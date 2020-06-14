module.exports = {
    bsonType: 'object',
    required: ['title', 'text', 'createdAt'],
    properties: {
        title: {
            bsonType: 'string',
            description:
                'must be a string and is required and is unique indexed'
        },
        text: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        createdAt: {
            bsonType: 'date',
            description: 'mube be a date and is required'
        }
    }
};
