import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image?: string;
    role: 'user' | 'tailor' | 'admin';
    bio?: string;
    location?: string;
    phone?: string;
    is_active: boolean;
    email_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String, default: '' },
        role: { type: String, enum: ['user', 'tailor', 'admin'], default: 'user' },
        bio: { type: String, default: '' },
        location: { type: String, default: '' },
        phone: { type: String, default: '' },
        is_active: { type: Boolean, default: true },
        email_verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Virtual for id to match MySQL numeric ID if needed as a string
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
