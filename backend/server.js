import express from 'express';
import dotenv from 'dotenv';
import cron from "node-cron";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
dotenv.config();
import cors from 'cors';
import connectDB from './config/db.js';
//const groundRoutes = require('./routes/groundRoutes'); 
import groundRoutes from './routes/groundRoutes.js';
import booking from './routes/bookingRoutes.js';
import Payment from './routes/paymentRoutes.js'
import userRoutes from './routes/userRoutes.js';
import Booking from './models/Booking.js';
//import saveBookingDataToExcel from './excel/SaveBookingDataToExcel.js';
import { notfound, errorHandler } from './middleware/errorMiddleware.js';
import { upload } from './middleware/upload.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
// Configure CORS options to allow only your frontend domain
// const corsOptions = {
//   origin: 'http://localhost:5000',
//   optionsSuccessStatus: 200, // For legacy browser support
// };

app.use(cors()); // Enable CORS for all routes
const port = process.env.PORT || 5000;
connectDB();
console.log(cron, 'cron')
console.log(cron.getTasks(), 'crontasks'); // Log active cron tasks

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Image upload route
// Image upload route
// app.post('/upload', upload.single('image'), (req, res) => {
//   try {
//     if (!req.file) {
//       console.log("No file received in the request.");
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     console.log("File received:", req.file);

//     const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
//     res.json({ imageUrl }); // Send back the image URL
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ message: 'Error uploading image' });
//   }
// });
const saveBookingDataToExcel = async () => {
  try {
    // Fetch bookings from MongoDB
    const bookings = await Booking.find();

    if (!bookings.length) {
      console.log("No bookings found for today.");
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bookings");

    // Define columns
    worksheet.columns = [
      { header: "Booking ID", key: "_id", width: 20 },
      { header: "Ground Name", key: "ground", width: 20 },
      { header: "Name", key: "user", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Time Slot", key: "timeSlot", width: 15 },
      { header: "Advance", key: "advance", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    // Add rows
    bookings.forEach((booking) => {
      worksheet.addRow({
        _id: booking?.book?.booking_id,
        ground: booking.ground_id,
        user: booking.name,
        date: booking.date,
        timeSlot: booking.slots,
        advance: booking.prepaid,
        amount: booking?.book?.price,
      });
    });

   
    const reportsDirectory = "C:/booking_reports"; // Absolute path to the directory in C drive

    // Check if the directory exists, and create it if not
    if (!fs.existsSync(reportsDirectory)) {
      fs.mkdirSync(reportsDirectory, { recursive: true });
    }

    // Define the file path in C drive
    const filePath = path.join(reportsDirectory, `Bookings_${new Date().toISOString().slice(0, 10)}.xlsx`);

    // Save the file locally
    await workbook.xlsx.writeFile(filePath);
    console.log(`Excel file saved successfully: ${filePath}`);
  } catch (error) {
    console.error("Error generating Excel file:", error);
  }
};

// Run daily at midnight (00:00)
cron.schedule('* * * * *', async () => {
  console.log('Cron job triggered every minute.'); // Log when the cron job runs
  try {
    await saveBookingDataToExcel();
  } catch (error) {
    console.error('Error generating Excel file:', error);
  }
});

//User Routes
app.use('/api/user', userRoutes)
//Ground Routes
app.use('/api/ground', groundRoutes)

//Booking Route
app.use('/api/booking', booking);

//payment Routes
app.use('/api/payment', Payment);

//make it for build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html')));
} else {
  app.get('/', (req, res) => {
    res.send('Api is Running.....');
  });
}
//Error handlers
app.use(notfound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on port ${port}`));