import { MaskedInputProps } from "@/lib/data/agentTypes";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const MaskedInput = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
}: MaskedInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        name={name}
        type={isVisible ? "text" : "password"}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={onBlur}
        autoComplete="off"
        spellCheck="false"
      />
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-brand-navy transition-colors cursor-pointer"
        tabIndex={-1}
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
