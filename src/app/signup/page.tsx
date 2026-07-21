"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    setError(error.message);
    return;
  }

  router.push("/login");
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-xl bg-zinc-900 p-6"
      >
        <h1 className="text-2xl font-bold">Create Pipsoul Account</h1>

        <div className="relative">
  <Mail
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
  />

  <input
    className="
      w-full rounded-lg bg-zinc-800
      py-3 pl-10 pr-3
      outline-none
      border border-zinc-700
      focus:border-cyan-500
    "
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
        <div className="relative">
  <Lock
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
  />

  <input
    className="
      w-full rounded-lg bg-zinc-800
      py-3 pl-10 pr-10
      outline-none
      border border-zinc-700
      focus:border-cyan-500
    "
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="
      absolute right-3 top-1/2
      -translate-y-1/2
      text-zinc-400
      hover:text-white
    "
  >
    {showPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>


        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 p-3 font-semibold hover:bg-green-700"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-400">
  Already have an account?{" "}
  <Link
    href="/login"
    className="text-green-400 hover:text-green-300 font-semibold underline underline-offset-4"
  >
    Login
  </Link>
</p>
      </form>
    </div>
  );
}