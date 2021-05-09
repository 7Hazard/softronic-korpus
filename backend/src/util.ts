export function trimText(text:string){
    return text.trim().replace(/\s{2,}/g, ' ')
}