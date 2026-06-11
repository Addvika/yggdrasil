"use client";

import React from "react";

export type EntryType = "Reflection" | "Gratitude" | "Dream" | "Event" | "Other" | null;

interface EntryTypeSelectorProps {
  selectedType: EntryType;
  onChange: (type: EntryType) => void;
}

const ENTRY_TYPES: NonNullable<EntryType>[] = [
  "Reflection",
  "Gratitude",
  "Dream",
  "Event",
  "Other",
];

export function EntryTypeSelector({ selectedType, onChange }: EntryTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        Tag this entry (Optional)
      </span>
      <div className="flex flex-wrap gap-2">
        {ENTRY_TYPES.map((type) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => onChange(isSelected ? null : type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                isSelected
                  ? "bg-[#1A3C2E] text-white border-[#1A3C2E]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
