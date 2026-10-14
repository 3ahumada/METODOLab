import { useState } from "react";

const units = [
  { name: "Origen de las investigaciones", topics: ["Pertinencia del tema", "Planteamiento del problema", "Justificación"] },
  { name: "Tipos de investigación", topics: ["Alcances", "Hipótesis", "Variables"] },
  { name: "Estructura del anteproyecto", topics: ["Antecedentes", "Objetivos", "Metodología", "Fuentes"] },
  { name: "Trabajo terminal", topics: ["Redacción", "Tablas y figuras", "Formato"] },
];
const sections = ["Título", "Antecedentes", "Planteamiento del problema", "Justificación", "Objetivo general", "Objetivos específicos", "Hipótesis", "Alcances y limitaciones", "Metodología", "Marco teórico", "Cronograma", "Fuentes"];
export default function App() {
  const [tab, setTab] = useState<"aprender" | "proyecto" | "docente">("aprender");
  const [draft, setDraft] = useState<Record<string,string>>({});
  return <div className="shell"><header><div><p className="eyebrow">MGTIC · UABC · 4046</p><h1>METODO<span>Lab</span></h1><p>Laboratorio de investigación aplicada</p></div><span className="tag">Prototipo sin cuentas reales</span></header><nav>{([["aprender","Aprender"],["proyecto","Mi anteproyecto"],["docente","Vista docente"]] as const).map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav><main>{tab==="aprender"?<><h2>Ruta de aprendizaje</h2><p>Cuatro unidades basadas en la carta descriptiva.</p><div className="cards">{units.map((u,i)=><article key={u.name}><small>Unidad {i+1}</small><h3>{u.name}</h3><p>{u.topics.join(" · ")}</p></article>)}</div></>:tab==="proyecto"?<><h2>Constructor de anteproyectos</h2><p>Edición de demostración: el contenido no se guarda ni se envía a un servidor.</p>{sections.map(s=><label key={s}>{s}<textarea value={draft[s]||""} onChange={e=>setDraft({...draft,[s]:e.target.value})} placeholder={"Desarrolla: "+s.toLowerCase()}/></label>)}</>:<><h2>Dashboard docente</h2><p>Aquí aparecerán los grupos, entregas, rúbricas y avances una vez implementada la autenticación y la base de datos. No hay datos reales conectados.</p><div className="cards"><article><h3>Grupos</h3><p>Pendiente de integración</p></article><article><h3>Entregas</h3><p>Pendiente de integración</p></article><article><h3>Evaluación</h3><p>Pendiente de integración</p></article></div></>}</main><footer>METODOLab · Versión inicial de interfaz · Sin datos personales</footer></div>;
}
