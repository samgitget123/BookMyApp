import React from 'react';

const AvailableSlots = () => {
  const allSlots = [
    "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5",
    "10.0", "10.5", "11.0", "11.5", "12.0", "12.5", "13.0", "13.5",
    "14.0", "14.5", "15.0", "15.5", "16.0", "16.5", "17.0", "17.5",
    "18.0", "18.5", "19.0", "19.5", "20.0", "20.5", "21.0", "21.5",
    "22.0", "22.5", "23.0", "23.5", "24.0", "24.5", "0.0", "0.5",
    "1.0", "1.5"
  ];

  // Function to convert slot value to time string format (e.g., "6.0" to "6:00 AM - 6:30 AM")
  const convertSlotToTimeRange = (slot) => {
    const hour = Math.floor(slot);
    const minutes = (slot % 1) * 60;

    // Create start time
    const startTime = new Date();
    startTime.setHours(hour);
    startTime.setMinutes(minutes);

    // Create end time (30 minutes after the start time)
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30);

    const formatTime = (time) => {
      const hours12 = time.getHours() % 12 || 12; // 12-hour format
      const minutesStr = time.getMinutes() === 0 ? '00' : time.getMinutes();
      const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
      return `${hours12}:${minutesStr} ${ampm}`;
    };

    return {
      range: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      startTimeInDecimal: slot,
    };
  };

  // Get current time in hours and minutes (in decimal format)
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentDecimalTime = currentHours + currentMinutes / 60;

  console.log('Current Time in Decimal:', currentDecimalTime); // Log current time in decimal format

  // Convert all slots to time ranges and include their decimal values
  const slotsWithRange = allSlots.map((slot) => {
    const slotDetails = convertSlotToTimeRange(parseFloat(slot));
    console.log(`Slot: ${slot} => Time Range: ${slotDetails.range}`); // Log each slot conversion
    return {
      original: slot,
      formattedRange: slotDetails,
      timeInDecimal: parseFloat(slot),
    };
  });

  return (
    <div>
      <h3>Available Slots</h3>
      <ul>
        {slotsWithRange.map((slot, index) => {
          // Check if the slot is earlier than the current time
          const isPastSlot = slot.timeInDecimal < currentDecimalTime;
          
          return (
            <li
              key={index}
              style={{
                color: isPastSlot ? '#999' : '#000', // Grayed-out color for past slots
                textDecoration: isPastSlot ? 'line-through' : 'none', // Line-through for past slots
                cursor: isPastSlot ? 'not-allowed' : 'pointer', // Disabled cursor for past slots
              }}
            >
              {slot.formattedRange.range}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AvailableSlots;
