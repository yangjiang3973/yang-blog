const Busboy = require('busboy');
const showdown = require('showdown');
const converter = new showdown.Converter();
const PostDAO = require('../dao/postDAO');
const UserDAO = require('../dao/userDAO');
const CommentDAO = require('../dao/commentDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.home = catchAsync(async (req, res, next) => {
    const recentPosts = await PostDAO.getRecentPosts();
    const comments = await CommentDAO.getCommentsByPostId(req.params.id);

    res.status(200).render('home', {
        articles: recentPosts,
        comments,
    });
});

module.exports.post = catchAsync(async (req, res, next) => {
    const post = await PostDAO.getOnePost(req.params.id);
    const comments = await CommentDAO.getCommentsByPostId(req.params.id);
    res.status(200).render('post', {
        article: post,
        comments,
    });
});

module.exports.docs = catchAsync(async (req, res, next) => {
    const posts = await PostDAO.getAllPosts();
    res.status(200).render('docs', {
        posts,
    });
});

module.exports.account = catchAsync(async (req, res, next) => {
    const user = await UserDAO.getOneUser(req.user._id);
    res.status(200).render('account', {
        me: user,
    });
});

module.exports.tags = catchAsync(async (req, res, next) => {
    res.status(200).render('tags', {
        me: 'aaaaa',
    });
});

module.exports.tagsPosts = catchAsync(async (req, res, next) => {
    const tag = req.params.tag;
    // get posts by tag
    const posts = await PostDAO.getPostsByTag(tag);

    res.status(200).render('docs', {
        posts,
    });
});

module.exports.search = catchAsync(async (req, res, next) => {
    res.status(200).render('search');
});

module.exports.admin = catchAsync(async (req, res, next) => {
    res.status(200).render('admin');
});

module.exports.adminUploadPost = catchAsync(async (req, res, next) => {
    const busboy = new Busboy({ headers: req.headers });
    const fileToSave = {
        title: '',
        text: '',
    };

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', function (data) {
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
