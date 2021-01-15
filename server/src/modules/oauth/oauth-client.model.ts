import * as mongoose from 'mongoose';

let Schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array },
    grants: { type: Array }
}, {
    timestamps: true,
});

export const OAuthClient = mongoose.model('OAuthClient', Schema, 'oauth_clients');
