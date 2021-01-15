import * as mongoose from 'mongoose';

let Schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
    authorizationCode: { type: String },
    expiresAt: { type: Date },
    scope: { type: String }
}, {
    timestamps: true,
});

export const OAuthCode = mongoose.model('OAuthCode', Schema, 'oauth_auth_codes');
