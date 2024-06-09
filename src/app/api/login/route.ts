

import { users } from "@/models/User";
import { connectMongoDb } from "@/models/mongoDbClient";
import { generateToken } from "@/utils/generateToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    try {
        await connectMongoDb()
        const userDb = await users.findOne({ email, password })
        if (userDb) {
            const user = { email, password }
            const token = await generateToken(user)
            const response = NextResponse.json({ message: "success", token , userId:userDb.userId }, { status: 200 })

            response.cookies.set("token", token, {
                httpOnly: true
            })

            response.cookies.set("user",userDb.userId,{
                httpOnly:true
            })

            return response
        }
        else {
            return NextResponse.json({ message: "error: user does not exists" }, { status: 403 })
        }
    }
    catch (err) {

        return NextResponse.json({ message: "error", error: "internal server error" })

    }
}