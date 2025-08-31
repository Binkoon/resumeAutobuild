import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: string; // 최소 날짜 (YYYY-MM-DD 형식)
  maxDate?: string; // 최대 날짜 (YYYY-MM-DD 형식)
}

export function DatePicker({ value, onChange, placeholder = "날짜 선택", className = "", disabled = false, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    const year = String(date.getFullYear()).slice(-2); // 2자리 연도
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateValid = (date: Date): boolean => {
    if (minDate) {
      const min = new Date(minDate);
      if (date < min) return false;
    }
    if (maxDate) {
      const max = new Date(maxDate);
      if (date > max) return false;
    }
    return true;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (!isDateValid(newDate)) {
      // 날짜가 유효하지 않으면 선택하지 않음
      return;
    }
    
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onChange(formatDate(today));
    setIsOpen(false);
  };

  const calculateDropdownPosition = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setDropdownPosition({
        top: rect.bottom + scrollTop + 5,
        left: rect.left + scrollLeft
      });
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // 이전 달의 마지막 날들
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
      const day = prevMonth.getDate() - i;
      days.push(
        <div key={`prev-${day}`} className="calendar-day prev-month">
          {day}
        </div>
      );
    }

    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isToday = new Date().toDateString() === dayDate.toDateString();
      const isValid = isDateValid(dayDate);
      
      days.push(
        <div
          key={day}
          className={`calendar-day current-month ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isValid ? 'disabled' : ''}`}
          onClick={() => isValid && handleDateSelect(day)}
          style={{ 
            cursor: isValid ? 'pointer' : 'not-allowed',
            opacity: isValid ? 1 : 0.3
          }}
        >
          {day}
        </div>
      );
    }

    // 다음 달의 첫 날들
    const remainingDays = 42 - days.length; // 6주 * 7일 = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day next-month">
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`date-picker ${className}`} ref={datePickerRef}>
      <input
        type="text"
        value={selectedDate ? formatDisplayDate(selectedDate) : ''}
        placeholder={placeholder}
        onClick={handleInputClick}
        readOnly
        disabled={disabled}
        className="date-input"
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      />
      
      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button onClick={goToPreviousMonth} className="nav-btn">
              ‹
            </button>
            <span className="current-month-year">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </span>
            <button onClick={goToNextMonth} className="nav-btn">
              ›
            </button>
          </div>
          
          <div className="calendar-weekdays">
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>
          
          <div className="calendar-days">
            {renderCalendar()}
          </div>
          
          <div className="calendar-footer">
            <button onClick={goToToday} className="today-btn">
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
