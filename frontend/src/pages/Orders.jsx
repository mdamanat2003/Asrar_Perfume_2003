import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { API_BASE } from '../api'

export default function Orders(){
  const [orders, setOrders] = useState([])

  useEffect(()=> {
    const token = localStorage.getItem('token')
    if(!token) return
    fetch(API_BASE + '/api/orders', { headers:{ Authorization:'Bearer '+token } })
      .then(r=>r.json()).then(setOrders).catch(()=>setOrders([]))
  }, [])

  return (
    <>
      
      <div className="container">
        <h2>Your Orders</h2>
        {orders.length === 0 ? <p>No orders yet.</p> : (
          orders.map(o=>(
            <div className="card" key={o._id} style={{marginBottom:8}}>
              <p><b>Order:</b> {o._id}</p>
              <p><b>Status:</b> {o.status}</p>
              <p className="small">Placed: {new Date(o.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}
