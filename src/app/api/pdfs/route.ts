import { pdfs } from "@/models/Pdf";
import { users } from "@/models/User";
import { jwtVerify } from "jose";
import { NextRequest , NextResponse} from "next/server";


export async function GET(req: NextRequest){
    const token = req.cookies.get("token")?.value!
    if(token){
        try{
            const userFromToken = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET!))
            const { email, password } = userFromToken.payload;
            const user =  await users.findOne({ email, password })
            if (user) {
                
                const allUserPdfs = await pdfs.find({userId:user.userId})
                const pdfArray:{pdfId:string,pdfName:string}[] =  allUserPdfs.map(pdf =>{
                    return {
                        pdfId:pdf.pdfId,
                        pdfName:pdf.pdfName
                    }
                })

                if(pdfArray.length == 0){
                return NextResponse.json(JSON.stringify({ userPdfs: pdfArray , isEmpty:true}), { status: 200 })

                }
                return NextResponse.json(JSON.stringify({ userPdfs: pdfArray, isEmpty:false }), { status: 200 })
            }
        }
        catch(err){
            return NextResponse.json({error:err},{status:200})
        }
    }
    return NextResponse.json(JSON.stringify({message:new Error("you are not suppose to be here")}),{status:401})
}