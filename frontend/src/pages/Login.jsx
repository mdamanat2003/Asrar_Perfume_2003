import React, { useState } from 'react'
import Header from '../components/Header'
import { API_BASE } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const url = API_BASE + '/api/auth/' + (isRegister ? 'register' : 'login')
      const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if(res.ok){
        // save token and user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/') // go to home
      } else {
        alert(data.message || 'Login/Register failed')
      }
    } catch (err) {
      console.error(err);
      alert('Network error')
    }
  }

  return (
    <>
      
      <div className="container" style={{maxWidth:520}}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={submit}>
          {isRegister && <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />}
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn" type="submit">{isRegister ? 'Register' : 'Login'}</button>
            <button type="button" onClick={()=>setIsRegister(!isRegister)}>{isRegister ? 'Switch to Login' : 'Switch to Register'}</button>
          </div>
        </form>
        <hr />
        <div style={{marginTop:12}}>
          <a href="/admin-login">Admin Login</a>
        </div>
      </div>
    </>
  )
}
