import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (booking) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("🎫 Train Booking Ticket", 14, 22);

  doc.setFontSize(12);
  doc.text(`Issued: ${new Date().toLocaleString()}`, 14, 30);

  doc.autoTable({
    startY: 40,
    head: [["Field", "Details"]],
    body: [
      ["Name", booking.name],
      ["Train", booking.train],
      ["From", booking.from],
      ["To", booking.to],
      ["Time", booking.time],
      ["Date", booking.date || "N/A"],
      ["Email", booking.email],
      ["Payment", booking.payment],
      ["Booking ID", booking.id],
      ["Created At", new Date(booking.createdAt).toLocaleString()],
    ],
  });

  doc.save(`ticket-${booking.id}.pdf`);
};
