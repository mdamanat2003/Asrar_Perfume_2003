import React, { useState } from 'react'
import { API_BASE } from '../api'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [form, setForm] = useState({ email:'', password:'' })
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const url = API_BASE + '/api/auth/login'
      const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if(res.ok){
        if(data.user && data.user.isAdmin){
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          navigate('/admin')
        } else {
          alert('Not an admin account')
        }
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err);
      alert('Network error')
    }
  }

  return (
    <>
      
      <div className="container" style={{maxWidth:520}}>
        <h2>Admin Login</h2>
        <form onSubmit={submit}>
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn" type="submit">Login as Admin</button>
          </div>
        </form>
      </div>
    </>
  )
}
