export function truncate(text:string){
    const trucStr = text.substring(0,25)
    if(trucStr.length == text.length){
        return text
    }
    else{
        return `${trucStr}...`
    }
}