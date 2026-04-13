import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    product_id?: mongoose.Types.ObjectId | null;
    product_name: string;
    product_image?: string;
    price: number;
    quantity: number;
}

export interface IPayment {
    payment_date: Date;
    payment_method: number; // 1 for Stripe
    payment_amount: number;
}

export interface IOrder extends Document {
    client_id: mongoose.Types.ObjectId;
    tailor_id?: mongoose.Types.ObjectId | null;
    service_type: string;
    status: 'PENDING' | 'ACCEPTED' | 'STITCHING' | 'READY_FOR_DELIVERY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
    price: number;
    payment_status: 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED';
    stripe_session_id?: string;
    stripe_payment_intent?: string;
    delivery_address: string;
    customer_name?: string;
    customer_phone?: string;
    tracking_number?: string;
    measurement_height?: number;
    measurement_chest?: number;
    measurement_waist?: number;
    measurement_hip?: number;
    measurement_notes?: string;
    payment_method: string;
    order_total: number;
    order_date: Date;
    items: IOrderItem[];
    payments: IPayment[];
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    product_name: { type: String, required: true },
    product_image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
});

const PaymentSchema = new Schema({
    payment_date: { type: Date, default: Date.now },
    payment_method: { type: Number, default: 1 },
    payment_amount: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
    {
        client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        tailor_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        service_type: { type: String, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'STITCHING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'],
            default: 'PENDING',
        },
        price: { type: Number, default: 0 },
        payment_status: {
            type: String,
            enum: ['UNPAID', 'PENDING', 'PAID', 'REFUNDED'],
            default: 'UNPAID',
        },
        stripe_session_id: { type: String, default: null },
        stripe_payment_intent: { type: String, default: null },
        delivery_address: { type: String, default: 'Address Pending' },
        customer_name: { type: String, default: '' },
        customer_phone: { type: String, default: '' },
        tracking_number: { type: String, default: null },
        measurement_height: { type: Number, default: null },
        measurement_chest: { type: Number, default: null },
        measurement_waist: { type: Number, default: null },
        measurement_hip: { type: Number, default: null },
        measurement_notes: { type: String, default: '' },
        payment_method: { type: String, default: 'Stripe' },
        order_total: { type: Number, default: 0 },
        order_date: { type: Date, default: Date.now },
        items: [OrderItemSchema],
        payments: [PaymentSchema],
    },
    { timestamps: true }
);

OrderSchema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
