
// // export default convertSlotToTimeRange
// const convertSlotToTimeRange = (slot) => {
//   console.log("Received slot:", slot); // Debugging

//   // Ensure slot is a string and parse it
//   if (typeof slot === "string") {
//     const parsedSlot = slot.split(".").map(Number);
//     if (parsedSlot.length === 2) {
//       slot = parsedSlot; // Convert "6.0" → [6, 0], "6.5" → [6, 5]
//     } else {
//       console.error("Invalid slot format:", slot);
//       return "Invalid Slot";
//     }
//   }

//   // Ensure slot is an array with two numeric elements
//   if (!Array.isArray(slot) || slot.length !== 2 || isNaN(slot[0]) || isNaN(slot[1])) {
//     console.error("Invalid slot format:", slot);
//     return "Invalid Slot";
//   }

//   const [hours, half] = slot;

//   let startHour, startMinutes, endHour, endMinutes, period, endPeriod;

//   // Determine the start time
//   startHour = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
//   startMinutes = half === 0 ? "00" : "30";
//   period = hours < 12 ? "AM" : "PM"; // Determine AM/PM

//   // Determine the end time correctly
//   if (half === 0) {
//     endHour = startHour;
//     endMinutes = "30";
//     endPeriod = period;
//   } else {
//     endHour = startHour === 12 ? 1 : startHour + 1; // 12:30 should end at 1:00
//     endMinutes = "00";
//     endPeriod = hours + 1 < 12 ? "AM" : "PM"; // Handle AM/PM correctly
//   }

//   console.log(`Converted Time: ${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`);

//   return `${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`;
// };
// export default convertSlotToTimeRange;


const convertSlotToTimeRange = (slot) => {
  console.log("Received slot:", slot); // Debugging

  // Ensure slot is a string and parse it properly
  let hours, minutes;

  if (typeof slot === "string") {
    let parsedSlot = slot.split(".");
    hours = parseInt(parsedSlot[0], 10);
    minutes = parsedSlot[1] === "5" ? 30 : 0; // "6.5" → 6:30, "6.0" → 6:00
  } else if (Array.isArray(slot) && slot.length === 2) {
    hours = slot[0];
    minutes = slot[1] === 5 ? 30 : 0;
  } else {
    console.error("Invalid slot format:", slot);
    return "Invalid Slot";
  }

  // Compute end time
  let endHours = hours;
  let endMinutes = minutes + 30;
  
  if (endMinutes === 60) {
    endMinutes = 0;
    endHours += 1;
  }

  // Convert to 12-hour format and determine AM/PM
  const formatTime = (hr, min) => {
    let period = hr < 12 ? "AM" : "PM";
    let formattedHour = hr % 12 || 12; // 0 → 12 for AM
    let formattedMinute = min.toString().padStart(2, "0"); // Ensure two-digit minutes
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  console.log(`Converted Time: ${formatTime(hours, minutes)} - ${formatTime(endHours, endMinutes)}`);

  return `${formatTime(hours, minutes)} - ${formatTime(endHours, endMinutes)}`;
};

export default convertSlotToTimeRange;
