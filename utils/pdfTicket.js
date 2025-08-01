const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const bwipjs = require('bwip-js');
const fontkit = require('fontkit');
const QRCode = require('qrcode');

const environments = require('../configs/environments');
const { sendRequest } = require('../utils/sendRequest');

async function generateTicketPdf(eventDetails, employeeDetails) {
    let eventDate = eventDetails.date;
    const d = new Date(eventDate);
    year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(d);
    month = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d);
    day = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(d);
    hour = new Intl.DateTimeFormat('fa-IR', { hour: 'numeric' }).format(d);
    minute = new Intl.DateTimeFormat('fa-IR', { minute: 'numeric' }).format(d);
    let date = `${day.split('').reverse().join('')} ${month} ${year
        .split('')
        .reverse()
        .join('')} ساعت ${minute.split('').reverse().join('')}:${hour
        .split('')
        .reverse()
        .join('')}`;
    let time = console.log(date);
    //console.log(new Intl.DateTimeFormat('fa-IR').format(d));
    // Create a new PDF Document
    const pdfDoc = await PDFDocument.create();

    // Register fontkit with the PDF document
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage([600, 800]); // Width and height of the page

    // Load a font that supports Persian text
    const fontBytes = fs.readFileSync('fonts/Vazir-Bold.ttf'); // Adjust the path as needed
    const customFont = await pdfDoc.embedFont(fontBytes);

    // Define some positions
    let yPosition = 750; // Start position from the top

    // Add Title
    page.drawText('Evento', {
        x: 235,
        y: yPosition,
        size: 25,
        font: customFont,
        color: rgb(0, 0, 0)
    });

    // Update yPosition
    yPosition -= 10;

    // Generate QR code
    const qrCodeData = ``;
    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, { type: 'png' });

    // Embed QR code image
    const qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer);
    const qrCodeDims = qrCodeImage.scale(1.5); // Scale QR code if necessary

    // Draw QR code on the page
    page.drawImage(qrCodeImage, {
        x: (page.getWidth() - qrCodeDims.width) / 2, // Centering based on page width
        y: yPosition - qrCodeDims.height, // Position just above the next yPosition
        width: qrCodeDims.width,
        height: qrCodeDims.height
    });

    yPosition -= qrCodeDims.height + 50; // Update yPosition to move down

    // Generate Barcode
    const barcodeBuffer = await new Promise((resolve, reject) => {
        bwipjs.toBuffer(
            {
                bcid: 'code128',
                text: employeeDetails.id,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: 'center'
            },
            (err, png) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(png);
                }
            }
        );
    });

    // Embed Barcode image
    const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);
    const barcodeDims = barcodeImage.scale(0.5); // Scale it if necessary

    // Draw barcode on the page
    page.drawImage(barcodeImage, {
        x: (page.getWidth() - barcodeDims.width) / 2, // Centering based on page width
        y: yPosition, // position below the title
        width: barcodeDims.width,
        height: barcodeDims.height
    });

    // Update yPosition after the barcode
    yPosition -= barcodeDims.height;

    // Add Table (simulating with multiple drawText calls for simplicity)
    const rows = [
        [eventDetails.name, 'نام نام خانوادگی'],
        [eventDetails.event, 'نام رویداد'],
        [date, 'تاریخ و زمان شروع']
    ];

    rows.forEach((row) => {
        yPosition -= 25; // Move down for the next row
        const field = row[1]; // Field name
        const value = row[0]; // Value

        // Calculate width of the field text to position the value text
        const fieldWidth = customFont.widthOfTextAtSize(field, 10);
        const xPosition = 500 - fieldWidth; // Adjust based on layout requirements
        // Draw the field (right aligned)
        page.drawText(field, {
            x: xPosition, // base x position
            y: yPosition,
            size: 10,
            font: customFont,
            color: rgb(0.569, 0.569, 0.553)
        });
        yPosition -= 20;
        const fieldWidthValue = customFont.widthOfTextAtSize(value, 12);
        const xPositionValue = 500 - fieldWidthValue; // Adjust based on layout requirements
        // Draw the value (right aligned)
        page.drawText(value, {
            x: xPositionValue,
            y: yPosition,
            size: 12,
            font: customFont,
            color: rgb(0, 0, 0)
        });
        yPosition -= 10;
        // Draw a line beneath each row
        page.drawLine({
            y: yPosition,
            start: { x: 100, y: yPosition - 5 }, // Start point of the line
            end: { x: 500, y: yPosition - 5 }, // End point of the line
            color: rgb(0, 0, 0), // Line color (black)
            thickness: 0.6 // Thickness of the line
        });
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const filePath = `./tickets/ticket_${employeeDetails.name}.pdf`;
    fs.writeFileSync(filePath, pdfBytes);
    const uploadedTicket = await sendRequest(environments.FILE_SERVER_SEND_DOCUMENT_URL, filePath);

    return uploadedTicket.document_url;
}

module.exports = { generateTicketPdf };
