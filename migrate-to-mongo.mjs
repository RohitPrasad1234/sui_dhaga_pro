import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// 1. Manually parse .env.local to grab MONGODB_URI
try {
    const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
    const envLines = envContent.split('\n');
    for (const line of envLines) {
        if (line && !line.startsWith('#') && line.includes('=')) {
            const splitPos = line.indexOf('=');
            const key = line.substring(0, splitPos).trim();
            const value = line.substring(splitPos + 1).trim();
            process.env[key] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        }
    }
} catch (error) {
    console.error("Could not load .env.local completely, make sure MONGODB_URI is available.");
}

// 2. Loose Mongoose Schemas (Bypassing Typescript strictly for migration)
const mongooseConfig = { strict: false, versionKey: false };
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, mongooseConfig));
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, mongooseConfig));
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, mongooseConfig));
const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({}, mongooseConfig));

async function migrateDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("ERROR: MONGODB_URI not found in environment.");
        process.exit(1);
    }

    console.log("Connecting to local MySQL (Database: suidhagha)...");
    const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'suidhagha' });

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ Both databases connected successfully!\n");

    // Clear existing Mongo data to prevent duplicates on multiple runs
    console.log("Cleaning up old MongoDB collections before migration...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Post.deleteMany({});

    // Mappings to keep track of old MySQL INT IDs to the new MongoDB String Object IDs
    const userIdMap = {};
    const productIdMap = {};

    // ----------------------------------------------------
    // USERS MIGRATION
    // ----------------------------------------------------
    const [users] = await pool.execute('SELECT * FROM users');
    for (const u of users) {
        const mongoUser = await User.create({
            name: u.name,
            email: u.email,
            password: u.password,
            image: u.image,
            role: u.role,
            bio: u.bio,
            location: u.location,
            phone: u.phone,
            is_active: u.is_active === 1,
            email_verified: u.email_verified === 1,
            createdAt: u.created_at,
            updatedAt: u.updated_at
        });
        userIdMap[u.id] = mongoUser._id;
    }
    console.log(`📦 Migrated ${users.length} Users.`);

    // ----------------------------------------------------
    // PRODUCTS MIGRATION
    // ----------------------------------------------------
    const [products] = await pool.execute('SELECT * FROM products');
    for (const p of products) {
        const mongoProd = await Product.create({
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            category: p.category,
            tailor_id: p.tailor_id ? userIdMap[p.tailor_id] : null,
            rating: p.rating,
            reviews: p.reviews,
            stock: p.stock,
            is_active: p.is_active === 1,
            createdAt: p.created_at,
            updatedAt: p.updated_at
        });
        productIdMap[p.id] = mongoProd._id;
    }
    console.log(`👗 Migrated ${products.length} Products.`);

    // ----------------------------------------------------
    // ORDERS MIGRATION (Includes Items & Payments embedding)
    // ----------------------------------------------------
    const [orders] = await pool.execute('SELECT * FROM orders');
    for (const o of orders) {
        const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
        const formattedItems = items.map(i => ({
            product_id: i.product_id ? productIdMap[i.product_id] : null,
            product_name: i.product_name,
            product_image: i.product_image,
            price: i.price,
            quantity: i.quantity
        }));

        const [payments] = await pool.execute('SELECT * FROM payments WHERE order_id = ?', [o.id]);
        const formattedPayments = payments.map(pay => ({
            payment_amount: pay.payment_amount,
            payment_date: pay.payment_date,
            payment_method: pay.payment_method
        }));

        await Order.create({
            client_id: userIdMap[o.client_id] || null,
            tailor_id: o.tailor_id ? userIdMap[o.tailor_id] : null,
            service_type: o.service_type,
            status: o.status,
            price: o.price,
            payment_status: o.payment_status,
            stripe_session_id: o.stripe_session_id,
            delivery_address: o.delivery_address,
            customer_name: o.customer_name,
            customer_phone: o.customer_phone,
            items: formattedItems,
            payments: formattedPayments,
            createdAt: o.created_at,
            updatedAt: o.updated_at
        });
    }
    console.log(`🛍️  Migrated ${orders.length} Orders (Embedded with payments/items).`);

    // ----------------------------------------------------
    // POSTS MIGRATION (Includes Tags & Images embedding)
    // ----------------------------------------------------
    const [posts] = await pool.execute('SELECT * FROM posts');
    for (const p of posts) {
        const [images] = await pool.execute('SELECT * FROM post_images WHERE post_id = ?', [p.id]);
        const formattedImages = images.map(img => ({
            image_url: img.image_url,
            sort_order: img.sort_order
        }));

        const [tags] = await pool.execute('SELECT * FROM post_tags WHERE post_id = ?', [p.id]);
        const formattedTags = tags.map(t => ({
            tag: t.tag
        }));

        const [likes] = await pool.execute('SELECT user_id FROM post_likes WHERE post_id = ?', [p.id]);
        const formattedLikes = likes.map(l => userIdMap[l.user_id]).filter(id => id);

        await Post.create({
            tailor_id: userIdMap[p.tailor_id] || null,
            title: p.title,
            content: p.content,
            images: formattedImages,
            tags: formattedTags,
            likes: formattedLikes,
            createdAt: p.created_at,
            updatedAt: p.updated_at
        });
    }
    console.log(`✨ Migrated ${posts.length} Posts (Embedded with likes/tags/images).`);

    console.log("\n🚀 Migration Complete! All data successfully transferred to MongoDB Atlas.");
    process.exit(0);
}

migrateDatabase().catch(err => {
    console.error("\n❌ Fatal Error During Migration:", err);
    process.exit(1);
});
