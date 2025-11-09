
// app/admin-login/page.tsx – simple password -> cookie via /api/admin (as discussed)
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin(){
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function submit(){
    const res = await fetch("/api/admin", { method: "POST", body: JSON.stringify({ password }) });
    if(res.ok) router.push("/admin"); else alert("Wrong password");
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card bg-base-100 shadow w-full max-w-sm">
        <div className="card-body">
          <h1 className="card-title">Admin Login</h1>
          <input type="password" className="input input-bordered" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary" onClick={submit}>Login</button>
        </div>
      </div>
    </div>
  );
}

