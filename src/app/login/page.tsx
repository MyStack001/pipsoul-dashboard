"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // Email validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError("Incorrect email or password. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-x-hidden
        overflow-y-auto
        bg-white
        px-4
        py-8
        text-gray-900
        transition-colors
        duration-500
        sm:px-6
        sm:py-12
        dark:bg-[#020817]
        dark:text-white
      "
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[360px]
          w-[360px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/10
          blur-[110px]
          sm:h-[500px]
          sm:w-[500px]
          sm:blur-[140px]
          dark:bg-cyan-500/10
        "
      />

      {/* Back to Home */}
      <Link
        href="/"
        className="
          absolute
          left-4
          top-4
          inline-flex
          min-h-10
          items-center
          gap-1.5
          rounded-lg
          px-1
          text-xs
          text-gray-500
          transition-colors
          hover:text-gray-900
          sm:left-6
          sm:top-6
          sm:gap-2
          sm:text-sm
          dark:text-gray-400
          dark:hover:text-white
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pipsoul
      </Link>

      {/* Auth Container */}
      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="mb-6 text-center sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 sm:gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
              <Image
                src="/Logo.png"
                alt="Pipsoul logo"
                width={44}
                height={44}
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                priority
              />
            </div>

            <span
              className="
                text-[22px]
                font-bold
                text-gray-900
                sm:text-2xl
                dark:text-white
              "
            >
              Pipsoul
            </span>
          </Link>

          <p
            className="
              mt-2.5
              text-xs
              text-gray-500
              sm:mt-3
              sm:text-sm
              dark:text-gray-500
            "
          >
            Trade. Reflect. Improve.
          </p>
        </div>

        {/* Card */}
        <div
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white/90
            p-5
            shadow-[0_30px_80px_rgba(15,23,42,0.10)]
            backdrop-blur-xl
            transition-all
            duration-500
            sm:rounded-3xl
            sm:p-8
            dark:border-white/10
            dark:bg-[#0B1220]/90
            dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          "
        >

          {/* Heading */}
          <div className="mb-6 sm:mb-7">
            <h1
              className="
                text-[22px]
                font-bold
                tracking-tight
                text-gray-900
                sm:text-2xl
                dark:text-white
              "
            >
              Welcome back
            </h1>

            <p
              className="
                mt-1.5
                text-sm
                leading-6
                text-gray-500
                sm:mt-2
                dark:text-gray-400
              "
            >
              Log in to continue managing your trading journey.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-4 sm:space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  className="
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-gray-400
                    dark:text-gray-500
                  "
                />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`
                    min-h-[50px]
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-12
                    pr-4
                    text-sm
                    text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    dark:border-white/10
                    dark:bg-[#08111F]
                    dark:text-white
                    dark:placeholder:text-gray-600
                    ${error ? "border-red-400/50" : ""}
                    focus:border-cyan-400/50
                    focus:ring-2
                    focus:ring-cyan-400/10
                  `}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="
                    shrink-0
                    text-xs
                    font-medium
                    text-cyan-500
                    transition-colors
                    hover:text-cyan-400
                  "
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  className="
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-gray-400
                    dark:text-gray-500
                  "
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`
                    min-h-[50px]
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-12
                    pr-12
                    text-sm
                    text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    dark:border-white/10
                    dark:bg-[#08111F]
                    dark:text-white
                    dark:placeholder:text-gray-600
                    ${error ? "border-red-400/50" : ""}
                    focus:border-cyan-400/50
                    focus:ring-2
                    focus:ring-cyan-400/10
                  `}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    min-h-10
                    min-w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-400
                    transition-colors
                    hover:text-gray-700
                    dark:text-gray-500
                    dark:hover:text-gray-300
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-400/5
                  px-4
                  py-3
                  text-sm
                  text-red-500
                  dark:text-red-400
                "
              >
                <span className="mt-0.5 shrink-0 text-base">
                  !
                </span>

                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                min-h-[50px]
                w-full
                rounded-xl
                bg-cyan-500
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_30px_rgba(6,182,212,0.18)]
                transition-all
                duration-300
                hover:bg-cyan-400
                hover:shadow-[0_15px_40px_rgba(6,182,212,0.25)]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Signup */}
          <div
            className="
              mt-6
              border-t
              border-gray-200
              pt-5
              text-center
              sm:mt-7
              sm:pt-6
              dark:border-white/10
            "
          >
            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-500
              "
            >
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="
                  font-semibold
                  text-cyan-500
                  transition-colors
                  hover:text-cyan-400
                "
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="
            mt-5
            text-center
            text-xs
            text-gray-400
            sm:mt-6
            dark:text-gray-600
          "
        >
          Welcome back to your trading workspace.
        </p>
      </div>
    </main>
  );
}