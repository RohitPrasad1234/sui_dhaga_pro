import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
    tailor_id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    images: { url: string; sort_order: number }[];
    tags: string[];
    likes: mongoose.Types.ObjectId[]; // Array of User IDs
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema(
    {
        tailor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        images: [
            {
                url: { type: String, required: true },
                sort_order: { type: Number, default: 0 },
            },
        ],
        tags: [{ type: String }],
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

PostSchema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;
