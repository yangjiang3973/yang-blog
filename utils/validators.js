module.exports.validatePassowrd = (password, passwordConfirm) => {
    return password === passwordConfirm;
};

module.exports.validateEmail = () => {};

module.exports.isPasswordChangedAfterJWT = (
    passwordChangedAt,
    tokenCreatedAt
) => {
    if (passwordChangedAt) {
        const passwordTimestamp = parseInt(
            passwordChangedAt.getTime() / 1000,
            10
        );
        return passwordTimestamp > tokenCreatedAt;
    }
    return false;
};
