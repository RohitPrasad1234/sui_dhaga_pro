"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "user";

    // Validation
    if (!email || !password || !name) {
        return { error: "Please fill all fields" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    if (!['user', 'tailor'].includes(role)) {
        return { error: "Invalid role selected" };
    }

    try {
        await dbConnect();

        // Check if user already exists
        const existing = await User.findOne({ email });

        if (existing) {
            return { error: "User already exists with this email" };
        }

        // Hash password with bcrypt cost 12
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user
        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { error: "Registration failed. Please try again." };
    }
}
