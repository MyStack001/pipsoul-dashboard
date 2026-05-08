"use client";

import { useState } from "react";

type JournalEntry = {
  id: number;
  text: string;
  date: string;
};

export default function JournalPage() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const addEntry = () => {
    if (!text.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString(),
    };

    setEntries([newEntry, ...entries]);
    setText("");
  };

  return (
    <div className="p-6 space-y-6 text-black dark:text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Trading Journal</h1>
        <p className="text-sm text-gray-500">
          Write your thoughts after each trade
        </p>
      </div>

      {/* INPUT */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What happened in this trade? Why did you enter? What did you learn?"
          className="
            w-full h-32 p-3 rounded-lg
            bg-white/70 dark:bg-white/10
            border border-white/20 dark:border-white/10
            backdrop-blur-md
            focus:outline-none focus:ring-2 focus:ring-cyan-400
          "
        />

        <button
          onClick={addEntry}
          className="
            px-4 py-2 rounded-lg
            bg-cyan-500 text-white
            hover:bg-cyan-600 transition
          "
        >
          Save Journal
        </button>
      </div>

      {/* ENTRIES */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-gray-500">No journal entries yet...</p>
        )}

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="
              p-4 rounded-lg
              bg-white/60 dark:bg-white/5
              border border-white/20 dark:border-white/10
            "
          >
            <p className="text-sm text-gray-500">{entry.date}</p>
            <p className="mt-1">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
