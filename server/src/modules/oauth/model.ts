import {OAuthAccessToken} from './oauth-access-token.model';
import {OAuthCode} from './oauth-code.model';
import {OAuthClient} from './oauth-client.model';
import {User} from '../user/user.model';

export const OAuthModel = {

    getAccessToken: async (accessToken) => {

        let _accessToken = await OAuthAccessToken.findOne({ accessToken })
            .populate('user')
            .populate('client');

        if (!_accessToken) {
            return false;
        }

        (_accessToken as any) = _accessToken.toObject();

        if (!(_accessToken as any).user) {
            (_accessToken as any).user = {};
        }
        return _accessToken;
    },

    refreshToken: (refreshToken) => {
        return OAuthAccessToken.findOne({ refreshToken })
            .populate('user')
            .populate('client');
    },

    getAuthorizationCode: (authorizationCode) => {
        return OAuthCode.findOne({ authorizationCode })
            .populate('user')
            .populate('client');
    },

    getClient: (clientId, clientSecret) => {
        const params = { clientId };
        if (clientSecret) {
            (params as any).clientSecret = clientSecret;
        }
        return OAuthClient.findOne(params);
    },

    getUser: async (username, password) => {
        let user = await User.findOne({ username });
        if ((user as any).validatePassword(password)) {
            return user;
        }
        return false;
    },

    getUserFromClient: (client) => {
        // let UserModel = mongoose.model('User');
        // return UserModel.findById(client.user);
        return {};
    },

    saveToken: async (token, client, user) => {
        let accessToken = (await OAuthAccessToken.create({
            user: user.id || null,
            client: client.id,
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
        })).toObject();

        if (!(accessToken as any).user) {
            (accessToken as any).user = {};
        }

        return accessToken;
    },

    saveAuthorizationCode: (code, client, user) => {
        let authCode = new OAuthCode({
            user: user.id,
            client: client.id,
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            scope: code.scope
        });
        return authCode.save();
    },

    revokeToken: async (accessToken) => {
        let result = await OAuthAccessToken.deleteOne({ accessToken });
        return result.deletedCount > 0;
    },

    revokeAuthorizationCode: async (code) => {
        let result = await OAuthCode.deleteOne({
            authorizationCode: code.authorizationCode
        });
        return result.deletedCount > 0;
    }

};
