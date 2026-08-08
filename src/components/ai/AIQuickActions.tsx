"use client";

type AIQuickActionsProps = {
  onSelect: (message: string) => void;
};

const actions = [
  {
    label: "Risk management",
    message: "Give me a reminder about proper risk management.",
  },
  {
    label: "Trading psychology",
    message: "Give me some advice about controlling my emotions while trading.",
  },
  {
    label: "Avoid overtrading",
    message: "Remind me how to avoid overtrading.",
  },
  {
    label: "Stay disciplined",
    message: "Give me a short reminder to stay disciplined today.",
  },
];

export default function AIQuickActions({
  onSelect,
}: AIQuickActionsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.message)}
          className="
            shrink-0
            rounded-full
            border
            border-gray-200
            bg-gray-50
            px-3
            py-2
            text-xs
            font-medium
            text-gray-600
            transition
            hover:border-cyan-400/30
            hover:bg-cyan-400/5
            hover:text-cyan-500
            dark:border-white/10
            dark:bg-white/[0.03]
            dark:text-gray-400
            dark:hover:bg-cyan-400/5
            dark:hover:text-cyan-400
          "
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}