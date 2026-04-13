import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import dbConnect from './lib/db';
import User from './models/User';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials) return null;
                const { email, password } = credentials as { email: string; password: string };

                try {
                    await dbConnect();
                    const user = await User.findOne({ email, is_active: true });

                    if (!user) return null;

                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) return null;

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
});
