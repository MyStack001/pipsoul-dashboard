"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  name: string
  email: string
  trading_style: string
  account_type: string
  experience: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // READ
  async function fetchUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setUsers(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // CREATE
  async function createUser() {
    if (!name || !email) return

    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        trading_style: "Intraday",
        account_type: "Demo",
        experience: "Beginner",
      },
    ])

    if (!error) {
      setName("")
      setEmail("")
      fetchUsers()
    }
  }

  // DELETE
  async function deleteUser(id: string) {
    await supabase.from("users").delete().eq("id", id)
    fetchUsers()
  }

  return (
    <div className="p-6 space-y-6 text-black dark:text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Users CRUD</h1>
        <p className="text-gray-500">Live database connected</p>
      </div>

      {/* CREATE USER */}
      <div className="p-6 rounded-2xl border bg-white/60 dark:bg-white/5 space-y-4">
        <h2 className="text-xl font-semibold">Create User</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-3 w-full rounded-xl border"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 w-full rounded-xl border"
        />

        <button
          onClick={createUser}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-white"
        >
          Add User
        </button>
      </div>

      {/* USERS LIST */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users yet</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-5 rounded-2xl border bg-white/60 dark:bg-white/5 flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>

                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-500 rounded-full">
                    {user.trading_style}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                    {user.account_type}
                  </span>
                  <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-500 rounded-full">
                    {user.experience}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteUser(user.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}