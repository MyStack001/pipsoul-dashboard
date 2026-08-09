"use client";

import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    const setupRecoverySession = async () => {
      /*
       * Supabase will process the recovery link and emit
       * PASSWORD_RECOVERY when the user arrives here.
       */
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) return;

          if (event === "PASSWORD_RECOVERY" && session) {
            setRecoveryReady(true);
            setCheckingSession(false);
          }
        }
      );

      /*
       * Check whether a recovery session is already available.
       * This also handles cases where the session was established
       * before the listener fired.
       */
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setRecoveryReady(true);
      } else {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }

      setCheckingSession(false);

      return subscription;
    };

    let subscription:
      | { unsubscribe: () => void }
      | undefined;

    setupRecoverySession().then((sub) => {
      if (sub) {
        subscription = sub;
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!recoveryReady) {
      setError(
        "Your password reset session is not ready. Please open the reset link from your email again."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Your password has been updated successfully."
    );

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#020817]
        px-6
        py-12
        text-white
      "
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/10
          blur-[140px]
        "
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-cyan-500
                text-lg
                font-bold
                text-white
                shadow-[0_0_35px_rgba(6,182,212,0.25)]
              "
            >
              P
            </div>

            <span className="text-2xl font-bold">
              Pipsoul
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Trade. Reflect. Improve.
          </p>
        </div>

        {/* Card */}
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-[#0B1220]/90
            p-7
            shadow-[0_30px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight">
              Create a new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Choose a new password for your Pipsoul account.
            </p>
          </div>

          {/* Checking recovery session */}
          {checkingSession ? (
            <div className="rounded-xl border border-white/10 bg-[#08111F] px-4 py-4 text-center text-sm text-gray-400">
              Verifying your password reset link...
            </div>
          ) : !recoveryReady ? (
            <div className="space-y-4">
              <div
                className="
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-400/5
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-red-400
                "
              >
                {error ||
                  "This password reset link is invalid or has expired."}
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/forgot-password")
                }
                className="
                  w-full
                  rounded-xl
                  bg-cyan-500
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:bg-cyan-400
                "
              >
                Request a new reset link
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleUpdatePassword}
              className="space-y-5"
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-300
                  "
                >
                  New password
                </label>

                <div className="relative">
                  <Lock
                    className="
                      absolute
                      left-4
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      text-gray-500
                    "
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-[#08111F]
                      py-3.5
                      pl-12
                      pr-12
                      text-sm
                      text-white
                      placeholder:text-gray-600
                      outline-none
                      transition-all
                      focus:border-cyan-400/50
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      transition-colors
                      hover:text-gray-300
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-300
                  "
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <Lock
                    className="
                      absolute
                      left-4
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      text-gray-500
                    "
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-[#08111F]
                      py-3.5
                      pl-12
                      pr-12
                      text-sm
                      text-white
                      placeholder:text-gray-600
                      outline-none
                      transition-all
                      focus:border-cyan-400/50
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      transition-colors
                      hover:text-gray-300
                    "
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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
                  className="
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/5
                    px-4
                    py-3
                    text-sm
                    text-red-400
                  "
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  className="
                    rounded-xl
                    border
                    border-green-400/20
                    bg-green-400/5
                    px-4
                    py-3
                    text-sm
                    text-green-400
                  "
                >
                  {success}
                </div>
              )}

              {/* Update Password */}
              <button
                type="submit"
                disabled={loading || !!success}
                className="
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
                {loading
                  ? "Updating password..."
                  : success
                  ? "Password updated"
                  : "Update password"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Securely manage your Pipsoul account.
        </p>
      </div>
    </main>
  );
}