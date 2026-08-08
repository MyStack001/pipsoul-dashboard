"use client";

import { Bot, User } from "lucide-react";

type AIMessageProps = {
  role: "user" | "ai";
  content: string;
};

export default function AIMessage({
  role,
  content,
}: AIMessageProps) {
  const isAI = role === "ai";

  return (
    <div
      className={`flex gap-3 ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {isAI && (
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-cyan-400/20
            bg-cyan-400/10
            text-cyan-400
          "
        >
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`
          max-w-[80%]
          rounded-2xl
          px-4
          py-3
          text-sm
          leading-6
          ${
            isAI
              ? "rounded-tl-md bg-gray-100 text-gray-700 dark:bg-[#111827] dark:text-gray-300"
              : "rounded-tr-md bg-cyan-500 text-white"
          }
        `}
      >
        {content}
      </div>

      {!isAI && (
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gray-200
            text-gray-600
            dark:bg-white/10
            dark:text-gray-300
          "
        >
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}