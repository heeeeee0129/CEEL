// lib/mock-db.ts – temporary in-memory store (dev only)
import type { Peer } from "@/types/peer";

let peers: Peer[] = [
  { id: "1", name: "Alice Kim", role: "Ph.D Course", isAlumni: false, email: "alice@skku.edu", interests: ["C1 chemistry","CO2 removal"] },
  { id: "2", name: "Bob Lee", role: "Master Course", isAlumni: true, graduationYear: 2024, currentPosition: "LG Chem" },
];

export const MockDB = {
  listPeers() { return peers; },
  getPeer(id: string) { return peers.find(p=>p.id===id) || null; },
  addPeer(data: Omit<Peer, "id">) { const p = { id: crypto.randomUUID(), ...data }; peers = [p, ...peers]; return p; },
  updatePeer(id: string, patch: Partial<Peer>) { peers = peers.map(p => p.id===id ? {...p, ...patch} : p); return this.getPeer(id); },
  deletePeer(id: string) { peers = peers.filter(p=>p.id!==id); }
};