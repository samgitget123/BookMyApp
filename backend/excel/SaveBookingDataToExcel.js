import Booking from "../models/Booking";
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
      { header: "User Name", key: "user", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Time Slot", key: "timeSlot", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    // Add rows
    bookings.forEach((booking) => {
      worksheet.addRow({
        _id: booking._id,
        ground: booking.groundName,
        user: booking.userName,
        date: booking.date,
        timeSlot: booking.timeSlot,
        amount: booking.amount,
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

  export default saveBookingDataToExcel;