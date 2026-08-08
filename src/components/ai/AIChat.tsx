"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";
import AIMessage from "./AIMessage";
import AIQuickActions from "./AIQuickActions";
import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content:
        "Hey 👋 I'm your Pipsoul trading companion. Ask me about risk management, trading psychology, discipline, or anything related to becoming a better trader.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message?: string) => {
    const trimmed = (message ?? input).trim();

    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Pipsoul AI session:", session);

      if (!session?.access_token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I couldn't respond right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-gray-200/70
        bg-white
        shadow-sm
        dark:border-white/10
        dark:bg-[#0B1220]
        dark:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
      "
    >
      {/* AI Header */}
      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-gray-200/70
          px-5
          py-4
          dark:border-white/10
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-2xl
            border
            border-cyan-400/20
            bg-cyan-400/10
            text-cyan-400
          "
        >
          <Bot className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Pipsoul AI
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Trading companion
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className={`
              h-2 w-2 rounded-full
              ${loading ? "bg-yellow-400" : "bg-green-400"}
            `}
          />

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {loading ? "Thinking..." : "Online"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-[480px] space-y-5 p-5">
        {messages.map((message) => (
          <AIMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {/* Thinking indicator */}
        {loading && (
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
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

            <div
              className="
                rounded-2xl
                rounded-tl-md
                bg-gray-100
                px-4
                py-3
                dark:bg-[#111827]
              "
            >
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200/70 px-5 pt-4 dark:border-white/10">
        <AIQuickActions onSelect={handleQuickAction} />
      </div>

      {/* Input */}
      <div className="p-5">
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            p-2
            transition
            focus-within:border-cyan-400/40
            dark:border-white/10
            dark:bg-[#111827]
          "
        >
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask Pipsoul AI..."
            className="
              min-w-0
              flex-1
              bg-transparent
              px-3
              py-2
              text-sm
              text-gray-900
              outline-none
              placeholder:text-gray-400
              dark:text-white
              dark:placeholder:text-gray-500
            "
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-cyan-500
              text-white
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] text-gray-400 dark:text-gray-500">
          Pipsoul AI provides educational guidance and does not provide
          financial advice.
        </p>
      </div>
    </div>
  );
}