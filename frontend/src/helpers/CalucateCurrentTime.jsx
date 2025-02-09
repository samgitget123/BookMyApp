export  const calculateCurrentTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    if (
      targetDate.getFullYear() === now.getFullYear() &&
      targetDate.getMonth() === now.getMonth() &&
      targetDate.getDate() === now.getDate()
    ) {
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      return currentHours + currentMinutes / 60;
    }
    return 0; // For future dates, no restriction on time
  };