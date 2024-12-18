const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const { AUTH_MAIL_PASS, AUTH_MAIL_USER } = require("../constants");
const { User } = require("../models/user.model");

/**
 * Function to create a PDF from data
 * @param {Object} data - The data to include in the PDF
 * @returns {Promise<Buffer>} - Resolves with the generated PDF as a Buffer
 */
const createPDF = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Add Heading
      doc.fontSize(20).text("Booking Details", { align: "center" });
      doc.moveDown(2);

      const startX = 80; // Start X for centering content
      const columnWidth = 240; // Width of each column
      const rowHeight = 20; // Height of each row
      const addressRowHeight = 60; // Increased row height for address

      let currentY = doc.y;

      // Draw Each Section of the Data
      const drawSection = (title, content, extraSpace = false) => {
        // Add extra spacing above the section if required
        if (extraSpace) {
          doc.moveDown(0);
          currentY = doc.y;
        }

        // Section Title (Left Align)
        doc
          .fontSize(12)
          .text(title, startX, currentY, { align: "left", underline: true });
        currentY = doc.y + 20;

        // Table Rows
        for (const [key, value] of Object.entries(content)) {
          let currentRowHeight = rowHeight;

          // If the row is the 'address' row, increase the row height
          if (key === "Address") {
            currentRowHeight = addressRowHeight;
          }

          doc
            .rect(startX, currentY - 5, columnWidth, currentRowHeight)
            .stroke();
          doc
            .rect(
              startX + columnWidth,
              currentY - 5,
              columnWidth,
              currentRowHeight
            )
            .stroke();
          doc.text(key, startX + 10, currentY, { align: "left" });
          doc.text(value.toString(), startX + columnWidth + 10, currentY, {
            align: "left",
          });

          currentY += currentRowHeight; // Update Y for next row
        }

        doc.moveDown(2);
      };

      // Traveller Section
      drawSection("Traveller Details", data.traveller);

      // Holiday Section (with extra spacing)
      drawSection("Holiday Details", data.holiday, true);

      // Payment Section (with extra spacing)
      drawSection("Payment Details", data.payment, true);

      // Finish PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Function to send tickets via email
 * @param {Object} payload - Contains userId and booking data
 */
const sendTickets = async (payload) => {
  const { userId, data } = payload;

  // Fetch user email address from the database
  const user = await User.findById(userId);

  if (!user || !user.email) {
    throw new Error("User not found or email missing");
  }

  const to = user.email; // Recipient email address
  const subject = "Your Holiday Details";

  try {
    // Generate PDF from the data
    const pdfBuffer = await createPDF(data);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: AUTH_MAIL_USER,
        pass: AUTH_MAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: AUTH_MAIL_USER,
      to,
      subject,
      text: "Please find attached your holiday details in PDF format.",
      attachments: [
        {
          filename: "HolidayDetails.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully with PDF attachment.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
};

module.exports = { sendTickets };
