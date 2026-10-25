interface MonthSelectorProps {
  value: string;
  onChange: (yearMonth: string) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">対象月</span>
      <input
        type="month"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2"
      />
    </label>
  );
}
