
import { users } from "@/models/User";
import { connectMongoDb } from "@/models/mongoDbClient";
import { generateToken } from "@/utils/generateToken";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    try {
        connectMongoDb()
        if (await users.findOne({ email, password })) {
            return NextResponse.json({ message: "user already exists" }, { status: 403 })
        }
        else {
            const userId = `${uuidv4()}-userId`
            const newUser = new users({ userId, email, password })
            await newUser.save()
            const user = { email, password }
            const token = await generateToken(user)
            const response = NextResponse.json({ message: "success", token,userId:userId  }, { status: 200 })

            response.cookies.set("token", token, {
                httpOnly: true
            })

            response.cookies.set("user",userId,{
                httpOnly:true
            })
            return response
        }
    }
    catch (err) {

        return NextResponse.json({ message: "error", error: "Internal Server Error" }, { status: 500 })

    }
}