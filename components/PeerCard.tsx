import type { Peer } from "@/types/peer";

export function PeerCard({ peer }: { peer: Peer }) {
  return (
    <div className="group relative bg-white/60 backdrop-blur-lg shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
      {!peer.isAlumni && (
        peer.photoUrl ? (
          <img
            src={peer.photoUrl}
            alt={`${peer.name} profile photo`}
            className="w-24 h-24 object-cover rounded-full mx-auto shadow-md group-hover:shadow-lg transition"
            loading="lazy"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
        )
      )}
      <div className="text-center mt-4">
        <h3 className="font-semibold text-lg text-gray-800">{peer.name}</h3>
        <p className="text-sm text-gray-500">
          {peer.role}
        </p>
        {peer.isAlumni ? (
          <p className="text-sm mt-2 text-gray-600">
            {peer.graduationYear}{peer.currentPosition && ` · ${peer.currentPosition}`}
          </p>
        ) : (
          <>
            {peer.email && <p className="text-sm mt-2 text-gray-600">{peer.email}</p>}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {peer.interests?.map((i) => (
               <span
                  key={i}
                  className="text-xs bg-blue-50 text-blue-700 rounded-lg px-2 py-1
                            normal-case whitespace-pre-wrap break-words max-w-[240px] h-auto leading-snug"
                >
                  {i}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}