interface EditableFieldProps {
  label: string;
  value: string | number | null | undefined;
  fieldKey: string;
  type?: "text" | "number" | "select" | "date";
  options?: { value: string; label: string }[];
  suffix?: string;
  isEditing: boolean;
  onChange: (fieldKey: string, value: any) => void;
  disabled?: boolean;
  formatDisplay?: (value: any) => string;
  htmlFor?: string;
}

const DEFAULT_EMPTY = "No hay información";

export function EditableField({
  label,
  value,
  fieldKey,
  type = "text",
  options,
  suffix = "",
  isEditing,
  onChange,
  disabled = false,
  formatDisplay,
  htmlFor,
}: EditableFieldProps) {
  const displayValue = (() => {
    if (formatDisplay) return formatDisplay(value);
    if (value === undefined || value === null || value === "" || value === 0)
      return DEFAULT_EMPTY;
    return `${value}${suffix}`;
  })();

  const inputClasses =
    "w-full text-xs text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-colors";
  const labelClasses =
    "flex items-center gap-2 font-medium select-none text-xs text-gray-600";

  if (!isEditing || disabled) {
    return (
      <div>
        <label data-slot="label" className={labelClasses} htmlFor={htmlFor}>
          {label}
        </label>
        <p className="text-xs text-gray-900 mt-1">{displayValue}</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let newValue: string | number = e.target.value;
    if (type === "number" && newValue !== "") {
      newValue = parseFloat(newValue);
      if (isNaN(newValue)) return;
    }
    onChange(fieldKey, newValue);
  };

  return (
    <div>
      <label data-slot="label" className={labelClasses} htmlFor={htmlFor}>
        {label}
      </label>
      {type === "select" && options ? (
        <select
          className={inputClasses}
          value={value?.toString() ?? ""}
          onChange={handleChange}
        >
          <option value="">— Seleccionar —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={
            type === "number" ? "number" : type === "date" ? "date" : "text"
          }
          className={`${inputClasses} mt-1`}
          value={value?.toString() ?? ""}
          onChange={handleChange}
          placeholder={label}
          step={type === "number" ? "any" : undefined}
        />
      )}
    </div>
  );
}
