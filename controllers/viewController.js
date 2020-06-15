const PostDAO = require('../dao/postDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.home = catchAsync(async (req, res, next) => {
    const recentPosts = await PostDAO.getRecentPosts();

    res.status(200).render('home', {
        articles: recentPosts
    });
});
