module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // catch will call the callback and pass error to it, like next(error)
    };
};
