import {  NextResponse } from "next/server";


export async function POST(){
    try{

        const response = NextResponse.json({
            message:"logout successfull"
        },{status:200})

        response.cookies.set("token","",{
            httpOnly:true
        })

        return response
    }   
    catch(err){
        return NextResponse.json({error:"Internal server error"},{status:500})
    }
}