import { describe, expect, it } from "vitest";
import { buildProgressPdf } from "./exportPdf";

const units = [
  { name: "Origen", exercises: [
    { title: "Tema", prompt: "Define el tema." },
    { title: "Problema", prompt: "Describe el problema." },
  ] },
  { name: "Diseño", exercises: [{ title: "Método", prompt: "Explica el método." }] },
];
const sections = ["Título", "Metodología"];
const generatedAt = new Date(2026, 9, 15, 10, 30);

describe("PDF del avance actual", () => {
  it("incluye borradores, respuestas sin copiar al anteproyecto y pendientes", () => {
    const pdf = buildProgressPdf({
      units, sections, generatedAt,
      data: { answers: { "0-0": "Respuesta independiente", "0-1": "  " }, draft: { "Título": "Proyecto actual" } },
    }).output();
    expect(pdf.startsWith("%PDF-")).toBe(true);
    for (const value of ["1 de 3", "1 de 2", "Respuesta independiente", "Proyecto actual",
      "Pendiente de respuesta.", "Pendiente de redacción.", "Define el tema.", "15/10/2026"]) {
      expect(pdf).toContain(value);
    }
    // Both units remain visible even if a unit has no recorded answers.
    expect(pdf).toContain("Unidad 2. Diseño");
  });

  it("permite exportar un proyecto vacío e indica que no hay avance registrado", () => {
    const pdf = buildProgressPdf({ units, sections, generatedAt, data: { answers: {}, draft: {} } }).output();
    expect(pdf).toContain("0 de 3");
    expect(pdf).toContain("Aún no hay respuestas ni apartados redactados.");
    expect(pdf).toContain("Pendiente de respuesta.");
  });

  it("conserva acentos, ñ y saltos de línea en las respuestas", () => {
    const pdf = buildProgressPdf({ units, sections, generatedAt,
      data: { answers: { "0-0": "Investigacio\u0301n y diseño\nSegunda línea" }, draft: {} },
    }).output();
    expect(pdf).toContain("Investigación y diseño");
    expect(pdf).toContain("Segunda línea");
  });

  it("distribuye respuestas extensas y palabras sin espacios sin perder el final", () => {
    const response = `${"Análisis del aprendizaje. ".repeat(2200)}\n${"x".repeat(2000)}\nFIN DEL AVANCE`;
    const doc = buildProgressPdf({ units, sections, generatedAt,
      data: { answers: { "0-0": response }, draft: {} },
    });
    expect(doc.getNumberOfPages()).toBeGreaterThan(10);
    const pdf = doc.output();
    expect(pdf).toContain("FIN DEL AVANCE");
    expect(pdf).toContain(`${doc.getNumberOfPages()} / ${doc.getNumberOfPages()}`);
  });

  it("mantiene la exportación del anteproyecto enfocada en contenido registrado", () => {
    const pdf = buildProgressPdf({ units, sections, generatedAt, kind: "anteproyecto",
      data: { answers: { "0-0": "Respuesta registrada" }, draft: { "Título": "Mi proyecto" } },
    }).output();
    expect(pdf).toContain("Mi proyecto");
    expect(pdf).toContain("Respuesta registrada");
    expect(pdf).not.toContain("Pendiente de respuesta.");
    expect(pdf).not.toContain("Pendiente de redacción.");
  });
});
