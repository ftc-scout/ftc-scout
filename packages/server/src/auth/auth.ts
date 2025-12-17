import bcrypt from "bcrypt";
import { User } from "../db/entities/User";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function createUser(username: string, password: string): Promise<User> {
    const passwordHash = await hashPassword(password);
    const user = User.create({
        username,
        passwordHash,
        canClipVideos: true,
    });
    await user.save();
    return user;
}

export async function authenticateUser(
    username: string,
    password: string
): Promise<User | null> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return null;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        return null;
    }

    return user;
}
