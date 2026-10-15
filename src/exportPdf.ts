import { jsPDF } from "jspdf";

type ProgressData = {
  answers: Record<string, string>;
  draft: Record<string, string>;
};
type Unit = {
  name: string;
  exercises: { title: string; prompt: string }[];
};
type ReportOptions = {
  data: ProgressData;
  units: Unit[];
  sections: string[];
  kind?: "avance" | "anteproyecto";
  generatedAt?: Date;
};

/** Build from the current React state, including edits not yet saved to storage. */
export function buildProgressPdf({
  data, units, sections, kind = "avance", generatedAt = new Date(),
}: ReportOptions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 21;
  const width = 168;
  const bottom = 274;
  const lineHeight = 5.7;
  let y = 25;
  const title = kind === "avance" ? "Avances del estudiante" : "Anteproyecto de investigación";
  const hasText = (value?: string) => Boolean(value?.trim());
  const totalExercises = units.reduce((sum, unit) => sum + unit.exercises.length, 0);
  const completed = units.reduce((sum, unit, i) => sum + unit.exercises.filter(
    (_, j) => hasText(data.answers[`${i}-${j}`]),
  ).length, 0);
  const drafted = sections.filter(section => hasText(data.draft[section])).length;

  function page() {
    doc.setFillColor(7, 83, 62);
    doc.rect(0, 0, 210, 13, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(7, 83, 62);
    doc.text("UABC | MGTIC | METODOLab", margin, 23);
    y = 35;
  }
  function ensure(height: number) {
    if (y + height > bottom) { doc.addPage(); page(); }
  }
  function text(value: string, size = 10, bold = false, heading = false) {
    // NFC retains Spanish accents and ñ, including pasted decomposed characters.
    const normalized = value.normalize("NFC").replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(normalized, width) as string[];
    // Keep a heading with at least the first line of its content.
    if (heading) ensure(lines.length * lineHeight + 13);
    for (const line of lines) {
      ensure(lineHeight);
      // A new page draws its header; restore the content style afterwards.
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      if (bold) doc.setTextColor(7, 83, 62);
      else doc.setTextColor(30, 46, 38);
      doc.text(line || " ", margin, y);
      y += lineHeight;
    }
    y += 3;
  }
  function heading(value: string, size = 12) { text(value, size, true, true); }

  page();
  text(title, 19, true);
  text(`Fecha de exportación: ${generatedAt.toLocaleString("es-MX")}`, 9);
  heading("Resumen del avance");
  text(`Ejercicios respondidos: ${completed} de ${totalExercises}.`);
  text(`Apartados redactados: ${drafted} de ${sections.length}.`);
  text("Los conteos indican contenido registrado; no constituyen una calificación.", 9);
  units.forEach((unit, i) => {
    const count = unit.exercises.filter((_, j) => hasText(data.answers[`${i}-${j}`])).length;
    text(`Unidad ${i + 1}. ${unit.name}: ${count} de ${unit.exercises.length} ejercicios respondidos.`, 9);
  });
  text("Este documento reúne el avance disponible en el navegador actual al momento de la descarga.", 9);
  if (completed === 0 && drafted === 0) text("Aún no hay respuestas ni apartados redactados.");

  doc.addPage(); page();
  heading("Anteproyecto de investigación", 15);
  for (const section of sections) {
    const value = data.draft[section]?.trim();
    if (!value && kind === "anteproyecto") continue;
    heading(section);
    text(value || "Pendiente de redacción.");
  }

  doc.addPage(); page();
  heading("Ejercicios por unidad", 15);
  units.forEach((unit, i) => {
    if (kind === "anteproyecto" && !unit.exercises.some((_, j) => hasText(data.answers[`${i}-${j}`]))) return;
    heading(`Unidad ${i + 1}. ${unit.name}`, 13);
    unit.exercises.forEach((exercise, j) => {
      const value = data.answers[`${i}-${j}`]?.trim();
      if (!value && kind === "anteproyecto") return;
      heading(`${j + 1}. ${exercise.title}`, 11);
      text(`Consigna: ${exercise.prompt}`, 9);
      text(value ? `Respuesta registrada:\n${value}` : "Pendiente de respuesta.");
    });
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 110, 105);
    doc.text("METODOLab | Documento generado por el estudiante", margin, 289);
    doc.text(`${i} / ${pages}`, 189, 289, { align: "right" });
  }
  return doc;
}
