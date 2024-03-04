import React, { useState } from "react";
import toast from "react-hot-toast";

export interface DateRange {
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

interface DatePickerProps {
  bookingData: (dateRange: DateRange) => void;
  setTotalDays: (days: number) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  bookingData,
  setTotalDays,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    checkInDate: null,
    checkOutDate: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const changeMonth = (num: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + num, 1)
    );
  };

  const daysInMonth = () => {
    const weeks: JSX.Element[] = [];
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    const numberOfDays = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week: JSX.Element[] = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || day > numberOfDays) {
          week.push(<td key={`empty-${i}-${j}`} className="empty"></td>);
        } else {
          const dayDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const isSelected =
            dateRange.checkInDate &&
            dateRange.checkOutDate &&
            dayDate >= dateRange.checkInDate &&
            dayDate <= dateRange.checkOutDate;
          week.push(
            <td
              key={`day-${day}`}
              className={`day ${isSelected ? "selected" : ""}`}
              onClick={() => selectDate(dayDate)}
            >
              {day}
            </td>
          );
          day++;
        }
      }
      weeks.push(<tr key={`week-${i}`}>{week}</tr>);
      if (day > numberOfDays) break;
    }

    return weeks;
  };

  const selectDate = (date: Date) => {
    const isDatePast = isDateBeforeToday(date);
    if (!isDatePast) {
      let newDateRange = { ...dateRange };
      if (
        !dateRange.checkInDate ||
        (dateRange.checkInDate && dateRange.checkOutDate) ||
        date < dateRange.checkInDate
      ) {
        newDateRange = { checkInDate: date, checkOutDate: null };
      } else {
        newDateRange = { ...dateRange, checkOutDate: date };
      }
      setDateRange(newDateRange);
      bookingData(newDateRange);
      const total = countDaysBetweenDates(
        newDateRange.checkInDate,
        newDateRange.checkOutDate
      );
      setTotalDays(total);
    } else {
      toast.error("Please choose different date");
    }
  };

  const countDaysBetweenDates = (
    startDate: Date | null,
    endDate: Date | null
  ): number => {
    if (!startDate || !endDate) {
      return 0;
    }

    const timeDifference = endDate.getTime() - startDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24) + 1;
    return Math.ceil(dayDifference);
  };

  const isDateBeforeToday = (selectedDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDateObj = new Date(selectedDate);

    return selectedDateObj < today;
  };

  return (
    <div className="calendar">
      <div className="calendar-per-header">
        <button
          className="arrow-button"
          onClick={() => changeMonth(-1)}
        ></button>
        <span>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </span>
        <button
          className="right-arrow-button"
          onClick={() => changeMonth(1)}
        ></button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{daysInMonth()}</tbody>
      </table>
      <div className="calendar-footer">
        Check-In: {dateRange.checkInDate?.toLocaleDateString()}
        <br />
        Check-Out: {dateRange.checkOutDate?.toLocaleDateString()}
      </div>
    </div>
  );
};

export default DatePicker;
