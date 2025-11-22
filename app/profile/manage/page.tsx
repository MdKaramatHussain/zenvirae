"use client"

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateProfile, addAddress, deleteAddress } from '@/store/auth-slice'
import { useToast } from '@/hooks/use-toast'
import { userList } from '@/constants'

export default function ManageProfilePage() {
  const dispatch = useDispatch()
  const { user, isLoggedIn } = useSelector((s: RootState) => s.auth)
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [showAddForm, setShowAddForm] = useState(false)
  const [addr, setAddr] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    state: '',
    city: '',
    house: '',
    area: '',
  })

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
    }
  }, [user])

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="rounded-2xl shadow-lg bg-background p-8 text-center">
          <h2 className="text-xl font-semibold">You need to be logged in to manage your profile.</h2>
        </div>
      </div>
    )
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedPhone = phone.trim()
    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.warning({ title: 'Name required', description: 'Please enter your full name.' })
      return
    }

    // Check duplicate phone in constants/dummy users (excluding current user's phone)
    const phoneExists = userList.some((u: any) => u.phone === trimmedPhone && u.email !== user.email)
    if (trimmedPhone && phoneExists) {
      toast.warning({ title: 'Mobile number already exists', description: 'Mobile number already exists. Please use a different number.' })
      return
    }

    dispatch(updateProfile({ name: trimmedName, phone: trimmedPhone }))
    toast.success({ title: 'Profile updated', description: 'Your profile was updated successfully.' })
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    const required = ['fullName', 'phone', 'pincode', 'state', 'city', 'house', 'area']
    for (const k of required) {
      // @ts-ignore
      if (!addr[k] || !addr[k].toString().trim()) {
        toast.warning({ title: 'Missing fields', description: 'Please fill all required address fields.' })
        return
      }
    }

    const newAddress = {
      id: Date.now().toString(),
      ...addr,
    }

    dispatch(addAddress(newAddress as any))
    toast.success({ title: 'Address added', description: 'New address saved successfully.' })
    setAddr({ fullName: '', phone: '', pincode: '', state: '', city: '', house: '', area: '' })
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    const addresses = user.addresses ?? []
    if (addresses.length <= 1) {
      toast.error({ title: 'Cannot delete address', description: 'Cannot delete the last remaining address.' })
      return
    }

    dispatch(deleteAddress(id))
    toast.success({ title: 'Address removed', description: 'Address deleted successfully.' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Profile Info */}
        <section className="rounded-2xl bg-gradient-to-br from-white/60 to-secondary/5 p-6 shadow-soft overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email (cannot edit)</label>
              <Input value={user.email} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="pt-2">
              <Button type="submit" className="rounded-xl">Save Changes</Button>
            </div>
          </form>
        </section>

        {/* Right: Address Management */}
        <section className="rounded-2xl bg-gradient-to-br from-white/60 to-secondary/5 p-6 shadow-soft overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Addresses</h3>
            <div>
              <Button variant="ghost" onClick={() => setShowAddForm((s) => !s)} className="rounded-xl">
                {showAddForm ? 'Cancel' : 'Add New Address'}
              </Button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAddress} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <Input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pincode</label>
                <Input value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <Input value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">House No / Flat No</label>
                <Input value={addr.house} onChange={(e) => setAddr({ ...addr, house: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Area / Street</label>
                <Input value={addr.area} onChange={(e) => setAddr({ ...addr, area: e.target.value })} />
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" className="rounded-xl">Save Address</Button>
              </div>
            </form>
          )}

          <div className="mt-6 space-y-3">
            {(user.addresses ?? []).map((a) => (
              <div key={a.id} className="rounded-xl p-4 bg-white/60 shadow-sm border border-border flex justify-between items-start">
                <div>
                  <div className="font-medium">{a.fullName}</div>
                  <div className="text-sm text-muted-foreground">{a.phone} • {a.house}, {a.area}, {a.city} - {a.pincode}</div>
                  <div className="text-sm text-muted-foreground">{a.state}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
