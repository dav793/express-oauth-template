import * as mongoose from 'mongoose';

let Schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String }
}, {
    timestamps: true,
});

export const OAuthAccessToken = mongoose.model('OAuthAccessToken', Schema, 'oauth_access_tokens');
