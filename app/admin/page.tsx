// app/admin/page.tsx – dashboard
import Link from "next/link";
export default function AdminHome(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="menu bg-base-100 rounded-box w-64">
        <li><Link href="/admin/peer">Manage Peers</Link></li>
        <li><Link href="/admin/journal">Publications</Link></li>
        <li><Link href="/admin/gallery">Gallery</Link></li>
      </ul>
    </div>
  );
}