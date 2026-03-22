import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

  pdf.save("invoice.pdf");
};
