"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "If an account exists with this email, we've sent you a password reset link."
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <form
        onSubmit={handleResetRequest}
        className="
          w-full
          max-w-md
          space-y-5
          rounded-3xl
          border
          border-white/10
          bg-[#0B1220]
          p-6
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Enter your email and we'll send you a secure link to
            create a new password.
          </p>
        </div>

        {/* Email */}
        <div className="relative">
          <Mail
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#111827]
              py-3
              pl-10
              pr-3
              text-white
              outline-none
              transition
              placeholder:text-gray-500
              focus:border-cyan-400/50
            "
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Success */}
        {message && (
          <p className="text-sm text-green-400">
            {message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-cyan-500
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:bg-cyan-400
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Sending reset link..." : "Send reset link"}
        </button>

        {/* Back to login */}
        <Link
          href="/login"
          className="
            flex
            items-center
            justify-center
            gap-2
            text-sm
            text-gray-400
            transition
            hover:text-white
          "
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </form>
    </div>
  );
}