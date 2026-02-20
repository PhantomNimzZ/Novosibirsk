// client/src/utils/generatePDF.js
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate a PDF ticket for a confirmed booking
 * @param {Object} booking - The booking object returned from the API
 */
export const generatePDF = (booking) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("🚆 PRASA Train Ticket", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Booking Reference: #${booking.id}`, 105, 28, { align: "center" });
  doc.text(`Issued: ${new Date().toLocaleString("en-ZA")}`, 105, 34, { align: "center" });

  // Divider line
  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);

  // Check if autoTable exists
  if (typeof doc.autoTable !== "function") {
    console.error("autoTable is not available on jsPDF instance");
    // Fallback to basic text if autoTable fails
    let y = 45;
    doc.setFontSize(10);
    doc.text(`Passenger: ${booking.passengerName}`, 20, y); y += 7;
    doc.text(`Email: ${booking.email}`, 20, y); y += 7;
    doc.text(`ID: ${booking.idNumber}`, 20, y); y += 7;
    doc.text(`Train: ${booking.trainNumber || "N/A"}`, 20, y); y += 7;
    doc.text(`From: ${booking.departure} → To: ${booking.destination}`, 20, y); y += 7;
    doc.text(`Date: ${booking.date ? new Date(booking.date).toLocaleDateString("en-ZA") : "N/A"}`, 20, y); y += 7;
    doc.text(`Time: ${booking.time || "N/A"}`, 20, y); y += 7;
    doc.text(`Seat: ${booking.seat || "Not assigned"}`, 20, y); y += 7;
    doc.text(`Price: R${parseFloat(booking.price || 0).toFixed(2)}`, 20, y); y += 7;
    doc.text(`Status: ${booking.status || "Active"}`, 20, y);
  } else {
    // Use autoTable if available
    doc.autoTable({
      startY: 42,
      head: [["Field", "Details"]],
      headStyles: {
        fillColor: [18, 23, 43],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
      },
      body: [
        ["Passenger Name", booking.passengerName],
        ["Email", booking.email],
        ["ID Number", booking.idNumber],
        ["", ""],
        ["Train", booking.trainNumber || "N/A"],
        ["From", booking.departure],
        ["To", booking.destination],
        ["Date", booking.date ? new Date(booking.date).toLocaleDateString("en-ZA") : "N/A"],
        ["Time", booking.time || "N/A"],
        ["Seat", booking.seat || "Not assigned"],
        ["", ""],
        ["Price", `R${parseFloat(booking.price || 0).toFixed(2)}`],
        ["Payment Status", booking.paymentStatus || "Pending"],
        ["Booking Status", booking.status || "Active"],
      ],
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 110 },
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  }

  // Download the PDF
  const filename = `PRASA-Ticket-${booking.id}-${Date.now()}.pdf`;
  doc.save(filename);
};