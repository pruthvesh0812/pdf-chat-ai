"use server"

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { users } from '../models/User';
import { connectMongoDb } from '../models/mongoDbClient';

export const initUser = async () => {
    await connectMongoDb()

    try {
        const token = cookies().get("token")?.value!
        if (token != "") {
            const user = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET!))
            if (!user) {
                return false
            }
            const { email, password } = user.payload;
            if (await users.findOne({ email, password })) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }
    catch (err: any) {
        console.log(err.message)
        return false;
    }

}