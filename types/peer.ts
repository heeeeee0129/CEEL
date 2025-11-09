// types/peer.ts – shared type
export type PeerRole = "Postdoctoral Researcher" | "Ph.D Course" | "Master Course";
export type Peer = {
  id: string;
  name: string;
  role: PeerRole;
  isAlumni: boolean;
  // current members
  photoUrl?: string;
  email?: string;
  interests?: string[];
  // alumni
  graduationYear?: number;
  currentPosition?: string;
};

