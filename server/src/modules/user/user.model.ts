import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

let UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String, unique: true },
    verificationCode: { type: String },
    verifiedAt: { type: Date },
}, {
    timestamps: true,
});

UserSchema.methods.validatePassword = function (password) {
    let _password = crypto.pbkdf2Sync(password, process.env.DATABASE_SALT, 10000,
        32, 'sha512').toString('hex');
    return (this as any).password === _password;
};

UserSchema.methods.setPassword = function (password) {
    (this as any).password = crypto.pbkdf2Sync(password, process.env.DATABASE_SALT, 10000,
        32, 'sha512').toString('hex');
};

export const User = mongoose.model('User', UserSchema, 'users');
