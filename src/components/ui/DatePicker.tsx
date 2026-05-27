import "./DatePicker.css";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = "选择日期" }: DatePickerProps) {
  return (
    <div className="date-picker-wrapper">
      <span className="date-picker-icon">📅</span>
      <input
        type="date"
        className="date-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = dateStr.split("T")[0];
  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (dateOnly === todayStr) return "今天";
  if (dateOnly === tomorrowStr) return "明天";
  if (dateOnly === yesterdayStr) return "昨天";

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function isOverdue(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr.split("T")[0] < today;
}
