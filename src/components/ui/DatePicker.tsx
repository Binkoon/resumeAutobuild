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
  const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
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

  const goToYearMonth = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
    setShowYearMonthPicker(false);
  };

  const generateYearOptions = (): number[] => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startYear = minDate ? new Date(minDate).getFullYear() : currentYear - 50;
    const endYear = maxDate ? new Date(maxDate).getFullYear() : currentYear + 10;
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const generateMonthOptions = (): { value: number; label: string }[] => {
    const months = [
      { value: 0, label: '1월' },
      { value: 1, label: '2월' },
      { value: 2, label: '3월' },
      { value: 3, label: '4월' },
      { value: 4, label: '5월' },
      { value: 5, label: '6월' },
      { value: 6, label: '7월' },
      { value: 7, label: '8월' },
      { value: 8, label: '9월' },
      { value: 9, label: '10월' },
      { value: 10, label: '11월' },
      { value: 11, label: '12월' }
    ];

    // minDate/maxDate가 있을 때 해당 월들만 필터링
    if (minDate || maxDate) {
      return months.filter(month => {
        const testDate = new Date(currentDate.getFullYear(), month.value, 1);
        return isDateValid(testDate);
      });
    }

    return months;
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
      setShowYearMonthPicker(false);
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

  const renderYearMonthPicker = () => {
    const years = generateYearOptions();
    const months = generateMonthOptions();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return (
      <div className="year-month-picker">
        <div className="year-month-header">
          <button 
            onClick={() => setShowYearMonthPicker(false)}
            className="back-btn"
          >
            ← 캘린더로 돌아가기
          </button>
        </div>
        
        <div className="year-month-content">
          <div className="year-section">
            <h4>연도 선택</h4>
            <div className="year-grid">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => goToYearMonth(year, currentMonth)}
                  className={`year-btn ${year === currentYear ? 'selected' : ''}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          <div className="month-section">
            <h4>월 선택</h4>
            <div className="month-grid">
              {months.map(month => (
                <button
                  key={month.value}
                  onClick={() => goToYearMonth(currentYear, month.value)}
                  className={`month-btn ${month.value === currentMonth ? 'selected' : ''}`}
                >
                  {month.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
          {showYearMonthPicker ? (
            renderYearMonthPicker()
          ) : (
            <>
              <div className="calendar-header">
                <button onClick={goToPreviousMonth} className="nav-btn">
                  ‹
                </button>
                <span 
                  className="current-month-year clickable"
                  onClick={() => setShowYearMonthPicker(true)}
                  title="연/월 선택"
                >
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
