import { useEffect, useRef } from "react";
type Props={value:string;onChange:(html:string)=>void;label:string;onError:(message:string)=>void};
const MAX_IMAGE=2*1024*1024;
export function cleanHtml(html:string):string{
 const doc=new DOMParser().parseFromString(html,"text/html");
 const allowed=new Set(["P","DIV","BR","B","STRONG","I","EM","U","UL","OL","LI","H3","H4","IMG"]);
 function clean(node:Node):string{
  if(node.nodeType===Node.TEXT_NODE)return (node.textContent||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  if(node.nodeType!==Node.ELEMENT_NODE)return "";
  const el=node as HTMLElement;
  if(!allowed.has(el.tagName))return Array.from(el.childNodes).map(clean).join("");
  if(el.tagName==="IMG"){
   const src=el.getAttribute("src")||"";
   if(!/^data:image\/(png|jpeg|webp|gif);base64,[a-zA-Z0-9+/=]+$/.test(src))return "";
   return '<img src="'+src+'" alt="Imagen del anteproyecto">';
  }
  const tag=el.tagName.toLowerCase();
  return "<"+tag+">"+Array.from(el.childNodes).map(clean).join("")+"</"+tag+">";
 }
 return Array.from(doc.body.childNodes).map(clean).join("");
}
export function RichEditor({value,onChange,label,onError}:Props){
 const ref=useRef<HTMLDivElement>(null);
 const fileRef=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(ref.current&&ref.current.innerHTML!==value&&document.activeElement!==ref.current)ref.current.innerHTML=cleanHtml(value)},[value]);
 const save=()=>{if(ref.current)onChange(cleanHtml(ref.current.innerHTML))};
 const insertImage=(file?:File)=>{
  if(!file)return;
  if(!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)){onError("Selecciona una imagen PNG, JPG, WebP o GIF.");return}
  if(file.size>MAX_IMAGE){onError("La imagen supera 2 MB. Comprímela antes de insertarla.");return}
  const reader=new FileReader();
  reader.onload=()=>{
   const src=String(reader.result||"");
   const img=document.createElement("img");img.src=src;img.alt="Imagen del anteproyecto";img.style.maxWidth="100%";
   const target=ref.current;if(!target)return;
   target.focus();
   const selection=window.getSelection();
   if(selection&&selection.rangeCount&&target.contains(selection.anchorNode)){
    const range=selection.getRangeAt(0);range.deleteContents();range.insertNode(img);range.setStartAfter(img);range.collapse(true);selection.removeAllRanges();selection.addRange(range);
   }else target.appendChild(img);
   save();
  };
  reader.readAsDataURL(file);
 };
 const format=(command:string)=>{ref.current?.focus();document.execCommand(command,false);save()};
 return <div className="rich-field"><div className="rich-toolbar" role="toolbar" aria-label={"Formato de "+label}>
  <button type="button" onClick={()=>format("bold")} title="Negritas"><b>B</b></button>
  <button type="button" onClick={()=>format("italic")} title="Cursivas"><i>I</i></button>
  <button type="button" onClick={()=>format("insertUnorderedList")} title="Viñetas">• Lista</button>
  <button type="button" onClick={()=>fileRef.current?.click()}>+ Insertar imagen</button>
  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={e=>{insertImage(e.target.files?.[0]);e.target.value=""}}/>
 </div><div ref={ref} className="rich-editor" contentEditable suppressContentEditableWarning role="textbox" aria-label={label} aria-multiline="true" onInput={save} onBlur={save}/></div>
}
