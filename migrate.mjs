import mysql from 'mysql2/promise';

async function migrate() {
    console.log("Starting Database Migration for SRS updates...");
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'suidhagha',
    });

    try {
        console.log("1. Altering orders table...");
        
        // Add order_date
        try {
            await pool.query("ALTER TABLE orders ADD COLUMN order_date DATE NOT NULL DEFAULT (CURRENT_DATE);");
        } catch (e) { if (!e.message.includes("Duplicate column")) throw e; }

        // Add payment_method
        try {
            await pool.query("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) NOT NULL DEFAULT 'Stripe';");
        } catch (e) { if (!e.message.includes("Duplicate column")) throw e; }

        // Add order_total
        try {
            await pool.query("ALTER TABLE orders ADD COLUMN order_total FLOAT NOT NULL DEFAULT 0.00;");
        } catch (e) { if (!e.message.includes("Duplicate column")) throw e; }

        // Modify delivery_address
        await pool.query("ALTER TABLE orders MODIFY COLUMN delivery_address VARCHAR(100) NOT NULL DEFAULT 'Address Pending';");
        
        console.log("2. Creating payments table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                payment_id INT AUTO_INCREMENT PRIMARY KEY,
                payment_date DATE NOT NULL,
                payment_method INT NOT NULL,
                payment_amount FLOAT NOT NULL,
                order_id INT,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

        console.log("Migration SUCCESS!");
    } catch (e) {
        console.error("Migration FAILED:", e.message);
    } finally {
        pool.end();
        process.exit(0);
    }
}
migrate();
