const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const { AUTH_MAIL_PASS, AUTH_MAIL_USER } = require("../constants");
const { User } = require("../models/user.model");

/**
 * Function to create a PDF from data
 * @param {Object} data - The data to include in the PDF
 * @returns {Promise<Buffer>} - Resolves with the generated PDF as a Buffer
 */
const createPDF = async (data, bookingId) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // ===============================================Logo=============================
      // Add Image at the Top Left Corner
      const logoImagePath = "./assets/logo.png";

      const logoImageWidth = 120;
      const logoImageHeight = 70;

      doc.image(
        logoImagePath,
        20, // X-coordinate for top left corner
        20, // Y-coordinate for top left corner
        {
          width: logoImageWidth,
          height: logoImageHeight,
        }
      );

      // Add Booking ID at the Top Right Corner
      doc
        .fontSize(12)
        .text(`Booking ID: ${bookingId}`, doc.page.width - 300, 30, {
          align: "right",
        });

      // Add Heading
      doc
        .fontSize(20)
        .text("Booking Details", (doc.page.width - 200) / 2, 120, {
          width: 200,
          align: "center",
        });

      const startX = 80; // Start X for centering content
      const columnWidth = 240; // Width of each column
      const rowHeight = 20; // Height of each row

      let currentY = doc.y;

      // Function to calculate dynamic row height for Address
      const calculateRowHeight = (text, columnWidth, doc) => {
        const textOptions = { width: columnWidth - 20, align: "left" }; // Add padding
        const lines =
          doc.heightOfString(text, textOptions) / doc.currentLineHeight();
        return Math.ceil(lines) * doc.currentLineHeight() + 10; // Add padding
      };

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

          // If the row is the 'Address' row, calculate dynamic row height
          if (key === "Address") {
            currentRowHeight = calculateRowHeight(value, columnWidth, doc);
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
            width: columnWidth - 20, // Add padding
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

      // Add Image at the Bottom Right Corner
      const imagePath = "./assets/paid.png";

      const imageWidth = 150;
      const imageHeight = 150;
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      doc.image(
        imagePath,
        pageWidth - imageWidth - 50,
        pageHeight - imageHeight - 120,
        {
          width: imageWidth,
          height: imageHeight,
        }
      );

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
  const { userId, data, bookingId } = payload;

  // Fetch user email address from the database
  const user = await User.findById(userId);

  if (!user || !user.email) {
    throw new Error("User not found or email missing");
  }

  const to = user.email; // Recipient email address
  const subject = `Your Holiday Details (Booking ID: ${bookingId})`;

  try {
    // Generate PDF from the data
    const pdfBuffer = await createPDF(data, bookingId);

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
      text: `Dear ${user.fullname},\n\nPlease find attached your holiday details. If you have any questions or need further assistance, feel free to contact us.\n\nImportant: Don't forget to carry Aadhaar card and passport for all travelers.\n\nBest regards,\nThe Voyawander Team`,

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
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendTickets };
