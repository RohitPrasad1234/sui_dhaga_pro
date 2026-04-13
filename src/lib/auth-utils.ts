import { auth } from "@/auth";

export async function getSession() {
    return await auth();
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}

export async function isAdmin() {
    const user = await getCurrentUser();
    return user?.role === 'admin';
}

export async function isTailor() {
    const user = await getCurrentUser();
    return user?.role === 'tailor';
}
