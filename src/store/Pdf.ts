import { pdf } from "@/types/AllTypes";
import { atom } from "recoil";


export const pdfIdState = atom<pdf>({
    key:"pdfId",
    default:{
        pdfId:"",
        pdfName:""
    }
})