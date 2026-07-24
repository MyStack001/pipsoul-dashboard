"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type CustomSelectProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function CustomSelect({
  value,
  options,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-gray-200/70
          dark:border-white/10
          bg-white
          dark:bg-[#111827]
          px-4
          py-3
          text-black
          dark:text-white
          shadow-sm
          transition-all
          hover:border-cyan-400
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500
        "
      >
        <span>{value}</span>

        <ChevronDown
          className={`
            w-5
            h-5
            transition-transform
            duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          absolute
          left-0
          right-0
          mt-2
          rounded-xl
          border
          border-gray-200/70
          dark:border-white/10
          bg-white
          dark:bg-[#111827]
          shadow-xl
          overflow-hidden
          z-50
          transition-all
          duration-200
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              onChange(option);
              setOpen(false);
            }}
            className={`
              w-full
              text-left
              px-4
              py-3
              transition-colors
              ${
                option === value
                  ? "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-medium"
                  : "hover:bg-cyan-50 dark:hover:bg-white/10 text-black dark:text-white"
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}