module.exports.home = (req, res, next) => {
    res.status(200).render('home', {
        articles: [{ data: '1' }, { data: '2' }]
    });
};
