import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Supports: ?q=search&category=Suits&page=1&limit=12
 */
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const category = searchParams.get('category') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const skip = (page - 1) * limit;

        const filter: any = { is_active: true };

        // Search filter
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'All') {
            filter.category = category;
        }

        const total = await Product.countDocuments(filter);

        // If no products exist and no filters applied, seed some initial data
        if (total === 0 && !q && !category) {
            const initialProducts = [
                { name: "Signature Navy Suit", description: "Bespoke navy blue suit tailored to perfection using premium Italian wool.", price: 499, image: "/images/suit_design_1.png", category: "Suits", rating: 4.8, reviews: 124, stock: 5 },
                { name: "Royal Golden Sherwani", description: "Exquisite wedding wear with intricate handcrafted gold embroidery.", price: 899, image: "/images/ethnic_wear_1.png", category: "Ethnic", rating: 4.9, reviews: 86, stock: 3 },
                { name: "Summer Floral Dress", description: "Lightweight linen floral dress, custom measured for a perfect summer silhouette.", price: 129, image: "/images/summer_dress_1.png", category: "Dresses", rating: 4.7, reviews: 52, stock: 12 },
                { name: "Egyptian Cotton Formal", description: "Crisp white formal shirt made from high-grade long-staple Egyptian cotton.", price: 79, image: "/images/formal_shirt_1.png", category: "Shirts", rating: 4.6, reviews: 210, stock: 25 }
            ];

            await Product.insertMany(initialProducts);
            const seededProducts = await Product.find({ is_active: true }).populate('tailor_id', 'name').sort({ createdAt: -1 });
            return NextResponse.json({ products: seededProducts, total: seededProducts.length, page: 1, limit });
        }

        const products = await Product.find(filter)
            .populate('tailor_id', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Map tailor_id.name to tailor_name for backward compatibility
        const formattedProducts = products.map(p => {
            const prod = p.toObject();
            return {
                ...prod,
                tailor_name: (prod.tailor_id as any)?.name || null
            };
        });

        return NextResponse.json({ products: formattedProducts, total, page, limit });
    } catch (error: any) {
        console.error("API Products Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/products - Create a new product (admin/tailor only)
 */
export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'tailor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, image, category, stock } = body;
        
        // Inherit tailor ID directly from session if they are a tailor. Admin can specify.
        const tailor_id = session.user.role === 'tailor' ? session.user.id : (body.tailor_id || null);

        if (!name || !description || !price || !image || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            tailor_id: tailor_id && tailor_id !== 'null' ? tailor_id : null,
            stock: stock || 10
        });

        return NextResponse.json({ id: product._id, message: 'Product created' }, { status: 201 });
    } catch (error: any) {
        console.error("API Create Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
