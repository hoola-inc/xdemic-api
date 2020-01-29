const OAuthTokensModel = require('../models/OAuth/oauth-tokens.model.js.model.js');
const OAuthClientsModel = require('../models/OAuth/oauth-clients.model.js.model.js');
const OAuthUsersModel = require('../models/OAuth/oauth-users.model.js');

module.exports.getAccessToken = function (bearerToken) {
    // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
    return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
};

/**
 * Get client.
 */

module.exports.getClient = function (clientId, clientSecret) {
    return OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function (refreshToken) {
    return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
};

/**
 * Get user.
 */

module.exports.getUser = function (username, password) {
    return OAuthUsersModel.findOne({ username: username, password: password }).lean();
};

