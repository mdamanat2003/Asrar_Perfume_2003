import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { API_BASE } from '../api'
import { Link } from 'react-router-dom'

export default function Wishlist(){
  const [items, setItems] = useState([])

  useEffect(()=> {
    const token = localStorage.getItem('token')
    if(!token) return
    fetch(API_BASE + '/api/wishlist', { headers:{ Authorization:'Bearer '+token } })
      .then(r=>r.json()).then(setItems).catch(()=>setItems([]))
  }, [])

  async function remove(id){
    const token = localStorage.getItem('token')
    await fetch(API_BASE + '/api/wishlist/'+id, { method:'DELETE', headers:{ Authorization:'Bearer '+token } })
    setItems(items.filter(i=>i._id !== id))
  }

  return (
    <>
      
      <div className="container">
        <h2>Your Wishlist</h2>
        {items.length === 0 ? <p>No items. <Link to="/home">Shop now</Link></p> : (
          <div className="grid">
            {items.map(p=>(
              <div className="card" key={p._id}>
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p className="small">₹{p.price}</p>
                <div style={{display:'flex',gap:8}}>
                  <Link to={'/product/'+p._id}><button className="btn">View</button></Link>
                  <button className="btn" style={{background:'#a00'}} onClick={()=>remove(p._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
