import type { Peer } from "@/types/peer";

export function PeerCard({ peer }: { peer: Peer }) {
  return (
    <div
      className="group relative rounded-2xl bg-white/60 backdrop-blur-lg shadow-md
                 hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1"
    >
      {/* 사진 영역 (현재 멤버만) */}
      {!peer.isAlumni && (
        <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32">
          {/* 은은한 그라데이션 링 */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200/70 via-indigo-200/60 to-blue-100/40
                       opacity-0 group-hover:opacity-100 blur-[1px] transition-opacity duration-300"
          />
          {peer.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={peer.photoUrl}
              alt={`${peer.name} profile photo`}
              className="relative w-full h-full rounded-full object-cover shadow-md
                         group-hover:shadow-xl transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div
              className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200
                         animate-pulse"
            />
          )}
        </div>
      )}

      {/* 텍스트 영역 */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{peer.name}</h3>
        <p className="text-sm text-gray-500">{peer.role}</p>

        {peer.isAlumni ? (
          <p className="mt-2 text-sm text-gray-600">
            {peer.graduationYear}
            {peer.currentPosition && ` · ${peer.currentPosition}`}
          </p>
        ) : (
          <>
            {peer.email && (
              <p className="mt-2 text-sm text-gray-600 break-all">{peer.email}</p>
            )}
            <div className="mt-3 flex max-h-32 flex-wrap justify-center gap-1.5 overflow-y-auto">
              {peer.interests?.map((i) => (
                <span
                  key={i}
                  className="max-w-[240px] rounded-lg bg-blue-50 px-2 py-1 text-xs leading-snug
                             text-blue-700 normal-case whitespace-pre-wrap break-words"
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