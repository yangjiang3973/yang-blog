var Busboy = require('busboy');
const showdown = require('showdown');
const converter = new showdown.Converter();
const PostDAO = require('../dao/postDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.home = catchAsync(async (req, res, next) => {
    const recentPosts = await PostDAO.getRecentPosts();

    res.status(200).render('home', {
        articles: recentPosts
    });
});

module.exports.post = catchAsync(async (req, res, next) => {
    const post = await PostDAO.getOnePost(req.params.id);

    res.status(200).render('post', {
        article: post
    });
});

module.exports.admin = catchAsync(async (req, res, next) => {
    res.status(200).render('admin');
});

module.exports.adminUploadPost = catchAsync(async (req, res, next) => {
    const busboy = new Busboy({ headers: req.headers });
    const fileToSave = {
        title: '',
        text: ''
    };

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', function(data) {
            fileToSave.text += data;
        });
    });

    busboy.on(
        'field',
        (
            fieldname,
            val,
            fieldnameTruncated,
            valTruncated,
            encoding,
            mimetype
        ) => {
            if (fieldname === 'title') fileToSave.title = val;
        }
    );

    busboy.on('finish', async () => {
        fileToSave.text = converter.makeHtml(fileToSave.text.toString('utf8'));
        try {
            await PostDAO.createOnePost(fileToSave);
            res.status(201).redirect('/admin');
        } catch (error) {
            new AppError(500, 'Failed to upload file! Please try again');
        }
    });

    req.pipe(busboy);
});
