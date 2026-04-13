export const clean = v =>
(v || "")
.toString()
.replace(/\u00A0/g," ")
.replace(/\s+/g," ")
.trim()
.toUpperCase();

export function linkify(text){

if(!text) return "";

const urlPattern=/https?:\/\/[^\s]+/g;

return text.replace(urlPattern,url=>{
return `<a href="${url}" target="_blank">${url}</a>`;
});

}