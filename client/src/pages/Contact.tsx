import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config/config"

export const Contact = () => {
  const [message, setMessage] = useState('')
  useEffect(()=>{
    axios.get(`${BACKEND_URL}contact`)
    .then(res => setMessage(res.data.message))
  },[])
  return(
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">{message}</h1>
        </div>
      </div>
    </div>
  )
}