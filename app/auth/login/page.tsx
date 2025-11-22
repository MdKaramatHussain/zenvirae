"use client"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { login } from "@/store/auth-slice"
import { dummyUser, userList } from "@/constants"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Find user by email or phone
    const user = userList.find(
      (u: any) =>
        (u.email === identifier || u.phone === identifier) &&
        u.password === password
    )
    if (user) {
      dispatch(login(user))
      toast.success({
        title: "Login Successful!",
        description: `Welcome, ${user.name}`,
        duration: 2500,
      })
      router.push("/")
    } else {
      toast.error({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        duration: 2500,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl shadow-xl bg-gradient-to-br from-muted/60 to-background/80 backdrop-blur-lg p-8 border border-border/30">
        <h1 className="font-serif text-3xl font-bold text-center mb-6 text-foreground">Welcome Back</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email or Mobile Number</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow hover:bg-primary/90 transition-transform active:scale-95"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/signup" className="text-sm text-muted-foreground hover:underline">
            Don’t have an account? <span className="font-semibold text-primary">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
