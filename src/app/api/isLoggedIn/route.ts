import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { users } from "@/models/User";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value || ""
    try {
        if (token != "") {
            const user = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET!))
            if (!user) {
                return NextResponse.json({ isLoggedIn: true }, { status: 403 })
            }
            const { email, password } = user.payload;
            if (await users.findOne({ email, password })) {
                return NextResponse.json({ isLoggedIn: true }, { status: 200 })
            }
            else {
                return NextResponse.json({ isLoggedIn: false }, { status: 401 })
            }
        }
        else {
            return NextResponse.json({ isLoggedIn: false }, { status: 401 })
        }
    }
    catch (err) {
        return NextResponse.json({ isLoggedIn: false }, { status: 500 })
    }
}