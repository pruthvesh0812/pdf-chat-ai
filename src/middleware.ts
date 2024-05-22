import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const token = request.cookies.get("token")?.value!

    if(token){
        const user = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET!))
        if(user){
            if(path == "/chat" || path == "/"){
                return NextResponse.next()
            }
            
            else{
                return NextResponse.redirect(new URL('/', request.url))
            }
        }  
    return NextResponse.redirect(new URL('/login', request.url))
       
    }
    else{
        if(path == "/login" || path =="/signup"){
            return NextResponse.next()
        }
        else{
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
        // return NextResponse.redirect(new URL('/login', request.url))

}

export const config = {
    matcher: [
        "/",
        "/chat",
        "/login",
        "/signup"
    ]
}