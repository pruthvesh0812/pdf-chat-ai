import { SignJWT } from 'jose';

export const generateToken = async (user: { email: string, password: string}) => {
    const token = new SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256', typ: "JWT" })
        .setExpirationTime((Math.floor(Date.now() / 1000)) + 60 * 60 * 10) // 10hr
        .setIssuedAt((Math.floor(Date.now() / 1000)))
        .setNotBefore((Math.floor(Date.now() / 1000)))
        .sign(new TextEncoder().encode(process.env.SECRET!));

    return token
}