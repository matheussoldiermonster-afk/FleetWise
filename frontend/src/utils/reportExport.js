import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

/**
 * summary: [{ label, value }]
 * table: { columns: string[], rows: any[][] } (opcional)
 */
export function exportReportToPdf({ title, subtitle, summary = [], table }) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(21, 128, 61);
  doc.text("FleetWise", 14, 16);

  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(title, 14, 25);

  let cursorY = 25;

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    doc.text(subtitle, 14, 31);
    cursorY = 31;
  }

  cursorY += 6;

  if (summary.length) {
    autoTable(doc, {
      startY: cursorY,
      head: [["Indicador", "Valor"]],
      body: summary.map((s) => [s.label, String(s.value)]),
      theme: "grid",
      headStyles: { fillColor: [21, 128, 61] },
      styles: { fontSize: 9 },
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  if (table && table.rows.length) {
    autoTable(doc, {
      startY: cursorY,
      head: [table.columns],
      body: table.rows,
      theme: "grid",
      headStyles: { fillColor: [21, 128, 61] },
      styles: { fontSize: 8 },
    });
  }

  doc.save(`${slug(title)}.pdf`);
}

export function exportReportToExcel({ title, summary = [], table }) {
  const workbook = XLSX.utils.book_new();

  if (summary.length) {
    const summarySheet = XLSX.utils.json_to_sheet(
      summary.map((s) => ({ Indicador: s.label, Valor: s.value }))
    );
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo");
  }

  if (table && table.rows.length) {
    const rows = table.rows.map((row) =>
      Object.fromEntries(table.columns.map((col, i) => [col, row[i]]))
    );
    const detailSheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, detailSheet, "Detalhes");
  }

  XLSX.writeFile(workbook, `${slug(title)}.xlsx`);
}
