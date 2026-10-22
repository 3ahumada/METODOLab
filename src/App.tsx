import { useEffect, useState } from "react";
import { buildProgressPdf } from "./exportPdf";
import { RichEditor, cleanHtml } from "./RichEditor";
type Tab = "aprender" | "proyecto" | "docente";
type Exercise = { title:string; prompt:string; guide:string; section?:string };
const units:{name:string;goal:string;exercises:Exercise[]}[]=[
{name:"Origen de las investigaciones",goal:"Seleccionar y justificar un tema de investigación aplicada.",exercises:[
{title:"Elección y pertinencia del tema",prompt:"Define el tema, la organización o contexto, y explica por qué merece investigarse.",guide:"Delimita el fenómeno, a quién afecta y qué evidencia inicial respalda su pertinencia.",section:"Título"},
{title:"Planteamiento del problema",prompt:"Describe la situación problemática, sus causas, consecuencias y la pregunta de investigación.",guide:"Evita confundir una solución propuesta con el problema que necesita estudiarse.",section:"Planteamiento del problema"},
{title:"Alcance y justificación",prompt:"Explica la utilidad, relevancia y viabilidad de la investigación.",guide:"Incluye beneficiarios, aportación esperada y límites iniciales.",section:"Justificación"}]},
{name:"Tipos de investigación",goal:"Distinguir los alcances y formular hipótesis y variables.",exercises:[
{title:"Selección del alcance",prompt:"Compara los alcances exploratorio, descriptivo, correlacional y explicativo. Elige uno y justifica.",guide:"Relaciona la elección con la pregunta de investigación y los datos disponibles.",section:"Alcances y limitaciones"},
{title:"Hipótesis",prompt:"Formula una hipótesis verificable o explica por qué tu diseño no requiere una hipótesis formal.",guide:"Evita afirmaciones imposibles de observar o medir.",section:"Hipótesis"},
{title:"Variables e indicadores",prompt:"Identifica variables, su definición conceptual y cómo podrían medirse.",guide:"Distingue conceptos de indicadores observables.",section:"Metodología"}]},
{name:"Estructura de un anteproyecto",goal:"Integrar los apartados del anteproyecto y localizar fuentes pertinentes.",exercises:[
{title:"Antecedentes y marco teórico",prompt:"Sintetiza estudios previos y conceptos que fundamentan el problema.",guide:"Indica autor, año y relación de cada antecedente con tu investigación.",section:"Antecedentes"},
{title:"Objetivos",prompt:"Escribe un objetivo general y objetivos específicos coherentes con la pregunta.",guide:"Usa verbos observables y evita prometer resultados.",section:"Objetivo general"},
{title:"Diseño metodológico",prompt:"Describe enfoque, participantes o unidades de análisis, técnicas e instrumentos.",guide:"Explica cómo obtendrás y analizarás la información.",section:"Metodología"},
{title:"Cronograma y fuentes",prompt:"Organiza las etapas de trabajo y registra referencias verificables.",guide:"Incluye actividades, tiempos estimados y formato de cita.",section:"Cronograma"}]},
{name:"Esquema general de trabajo terminal",goal:"Aplicar reglas de redacción, formato y edición académica.",exercises:[
{title:"Estructura del trabajo terminal",prompt:"Propón el índice del documento final y explica la función de cada capítulo.",guide:"Asegura continuidad entre problema, método, resultados y conclusiones."},
{title:"Redacción y revisión",prompt:"Reescribe un párrafo de tu anteproyecto para mejorar claridad, coherencia y precisión.",guide:"Cuida puntuación, conectores y uso consistente de términos."},
{title:"Tablas, figuras y formato",prompt:"Describe una tabla o figura necesaria y cómo la titularías y citarías.",guide:"Verifica encabezados, fuente de datos, numeración y referencias."}]}];
const sections=["Título","Antecedentes","Planteamiento del problema","Justificación","Objetivo general","Objetivos específicos","Hipótesis","Alcances y limitaciones","Metodología","Marco teórico","Cronograma","Fuentes"];
const key="metodolab-4046-v2";
type Saved={answers:Record<string,string>;draft:Record<string,string>};
function load():Saved{try{const v=JSON.parse(localStorage.getItem(key)||"{}");return{answers:v.answers||{},draft:v.draft||{}}}catch{return{answers:{},draft:{}}}}
export default function App(){
const [tab,setTab]=useState<Tab>("aprender");
const [unit,setUnit]=useState<number|null>(null);
const [exercise,setExercise]=useState(0);
const [data,setData]=useState<Saved>(load);
const [notice,setNotice]=useState("");
useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch{setNotice("No se pudo guardar en este navegador. Exporta una copia JSON.")}},[data]);
const all=units.flatMap((u,i)=>u.exercises.map((e,j)=>({id:i+"-"+j,e})));
const completed=all.filter(x=>data.answers[x.id]?.trim()).length;
const setAnswer=(id:string,value:string)=>setData(p=>({...p,answers:{...p.answers,[id]:value}}));
const setDraft=(id:string,value:string)=>setData(p=>({...p,draft:{...p.draft,[id]:value}}));
const printProject=()=>{setTab("proyecto");setTimeout(()=>window.print(),150)};
const exportPdf=(kind:"avance"|"anteproyecto"="avance")=>{try{
const doc=buildProgressPdf({data,units,sections,kind});
doc.save(kind==="avance"?"METODOLab-Avances.pdf":"METODOLab-Anteproyecto.pdf");
setNotice("Se generó la descarga del PDF con el avance actual. Revisa la carpeta Descargas.");
}catch{setNotice("No se pudo generar el PDF. Intenta de nuevo o guarda una copia JSON como respaldo.")}};
const download=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="METODOLab-proyecto.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
const importFile=(file?:File)=>{if(!file)return;file.text().then(t=>{try{const x=JSON.parse(t);if(!x||typeof x!=="object")throw Error();setData({answers:x.answers||{},draft:Object.fromEntries(Object.entries(x.draft||{}).map(([k,v])=>[k,cleanHtml(String(v))]))});setNotice("Proyecto importado correctamente.")}catch{setNotice("No se pudo leer el archivo JSON.")}})};
const selectUnit=(i:number)=>{setUnit(i);setExercise(0)};
const selected=unit===null?null:units[unit];
const ex=selected?.exercises[exercise];
const id=unit===null?"":unit+"-"+exercise;
return <div className="shell"><header><div><p className="eyebrow">UABC · MGTIC · CLAVE 4046</p><h1>METODO<span>Lab</span></h1><p>Laboratorio de metodología aplicada a la gestión de TIC</p></div><span className="tag">Versión de trabajo · Guardado local</span></header>
<nav><button className={tab==="aprender"?"active":""} onClick={()=>setTab("aprender")}>Unidades y ejercicios</button><button className={tab==="proyecto"?"active":""} onClick={()=>setTab("proyecto")}>Mi anteproyecto</button><button className={tab==="docente"?"active":""} onClick={()=>setTab("docente")}>Vista docente</button></nav>
<div className="toolbar"><span><b>Avance:</b> {completed} de {all.length} ejercicios respondidos</span><button className="primary" onClick={()=>exportPdf("avance")}>Descargar avances PDF</button><button onClick={download}>Guardar copia JSON</button><label className="filelabel">Importar JSON<input type="file" accept=".json,application/json" onChange={e=>importFile(e.target.files?.[0])}/></label></div>
{notice&&<p className="notice" role="status">{notice}</p>}
<main>{tab==="aprender"?(unit===null?<><h2>Ruta de aprendizaje</h2><p>Selecciona una unidad para abrir sus ejercicios. Tus respuestas se guardan en este navegador.</p><div className="cards">{units.map((u,i)=><article key={u.name}><small>UNIDAD {i+1}</small><h3>{u.name}</h3><p>{u.goal}</p><p>{u.exercises.filter((_,j)=>data.answers[i+"-"+j]?.trim()).length} / {u.exercises.length} ejercicios respondidos</p><button className="primary" onClick={()=>selectUnit(i)}>Entrar a la unidad →</button></article>)}</div></>:<><button onClick={()=>setUnit(null)}>← Volver a las unidades</button><p className="eyebrow">UNIDAD {unit+1}</p><h2>{selected?.name}</h2><p>{selected?.goal}</p><div className="exercise-tabs">{selected?.exercises.map((e,j)=><button key={e.title} className={exercise===j?"active":""} onClick={()=>setExercise(j)}>{j+1}. {e.title} {data.answers[unit+"-"+j]?.trim()?"✓":""}</button>)}</div>{ex&&<section className="exercise"><h3>{ex.title}</h3><p>{ex.prompt}</p><p className="guide"><b>Orientación:</b> {ex.guide}</p><label>Tu respuesta<textarea value={data.answers[id]||""} onChange={e=>setAnswer(id,e.target.value)} placeholder="Desarrolla tu respuesta con argumentos y ejemplos de tu proyecto..."/></label><div className="toolbar"><span>{data.answers[id]?.trim()?"Respuesta guardada en este navegador":"Ejercicio pendiente"}</span>{ex.section&&<button onClick={()=>{setDraft(ex.section!,data.answers[id]||"");setNotice("Respuesta enviada al apartado «"+ex.section+"» del anteproyecto.")}}>Copiar al anteproyecto</button>}<button className="primary" onClick={()=>{if(selected&&exercise<selected.exercises.length-1)setExercise(exercise+1);else setUnit(null)}}>{selected&&exercise<selected.exercises.length-1?"Siguiente ejercicio →":"Terminar unidad"}</button></div></section>}</>):tab==="proyecto"?<><h2>Constructor de anteproyectos</h2><p>Redacta los apartados del proyecto. Puedes incorporar respuestas desde las unidades. Exporta el JSON como respaldo.</p>{sections.map(s=><section className="project-section" key={s}><h3>{s}</h3><RichEditor label={s} value={data.draft[s]||""} onChange={v=>setDraft(s,v)} onError={setNotice}/></section>)}<p className="print-tip">Para conservar imágenes y formato, selecciona «Imprimir / Guardar como PDF» y elige «Guardar como PDF» en el diálogo de impresión. Guarda también una copia JSON para poder seguir editando.</p><button className="primary" onClick={printProject}>Imprimir / Guardar como PDF</button></>:<><h2>Vista docente</h2><p>Esta versión no tiene cuentas, base de datos ni panel multiestudiante. El avance mostrado corresponde únicamente al navegador actual.</p><div className="cards"><article><h3>Ejercicios respondidos</h3><p>{completed} de {all.length}</p></article><article><h3>Apartados redactados</h3><p>{sections.filter(s=>data.draft[s]?.replace(/<[^>]*>/g,"").trim()||data.draft[s]?.includes("<img")).length} de {sections.length}</p></article></div></>}</main><footer>METODOLab · UABC · Proyecto académico. Los datos permanecen en el navegador hasta que exportes una copia.</footer></div>}
