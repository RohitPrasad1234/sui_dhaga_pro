import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    tailor_id?: mongoose.Types.ObjectId;
    rating: number;
    reviews: number;
    stock: number;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        tailor_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        rating: { type: Number, default: 4.5 },
        reviews: { type: Number, default: 0 },
        stock: { type: Number, default: 10 },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ProductSchema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
