"use client"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { register } from "@/store/auth-slice"
import { dummyUser, userList } from "@/constants"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

function isStrongPassword(pw: string) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw)
}

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Check if user exists
    const exists = userList.some(
      (u: any) => u.email === email || u.phone === phone
    )
    if (exists) {
      toast.warning({
        title: "Account Exists",
        description: "Email or phone already registered.",
        duration: 2500,
      })
      return
    }
    if (!isStrongPassword(password)) {
      toast.error({
        title: "Weak Password",
        description: "Password must be 8+ chars, include uppercase, lowercase, number, and special character.",
        duration: 3500,
      })
      return
    }
    if (password !== confirm) {
      toast.error({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        duration: 2500,
      })
      return
    }
    // Add user to localStorage
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
    }
    // Update userList in localStorage
    let users = []
    try {
      users = JSON.parse(localStorage.getItem("zenvirae-users") || "[]")
    } catch {}
    users.push(newUser)
    localStorage.setItem("zenvirae-users", JSON.stringify(users))
    dispatch(register(newUser))
    toast.success({
      title: "Account Created!",
      description: `Welcome, ${name}`,
      duration: 2500,
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl shadow-xl bg-gradient-to-br from-muted/60 to-background/80 backdrop-blur-lg p-8 border border-border/30">
        <h1 className="font-serif text-3xl font-bold text-center mb-6 text-foreground">Create Account</h1>
        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Mobile Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
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
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow hover:bg-primary/90 transition-transform active:scale-95"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:underline">
            Already have an account? <span className="font-semibold text-primary">Login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
