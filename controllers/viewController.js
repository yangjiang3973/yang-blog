module.exports.home = (req, res, next) => {
    res.status(200).render('home', {
        title: 'hello'
    });
};
