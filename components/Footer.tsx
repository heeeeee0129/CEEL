// components/Footer.tsx
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200/40 bg-gray-100/70 backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Contact (compact) */}
          <div className="rounded-2xl bg-white/70 border border-gray-200/50 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Address</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
              #25420, #25422 (Lab.) / #25433A (Student office), Engineering Building 2<br />
              #85696 (Lab.) / #85695 (Student office), Cooperative Center<br />
              Sungkyunkwan University 2066 Seobu-ro, Suwon-si Jangan-gu, Gyeonggi-do, 16419, Republic of Korea
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-[13px]">
              <div>
                <div className="text-slate-500">Call Us On</div>
                <a href="tel:+82312907321" className="text-slate-800 hover:underline">
                  +82-31-290-7321
                </a>
              </div>
              <div>
                <div className="text-slate-500">Email Us</div>
                <a href="mailto:finejw@skku.edu" className="text-slate-800 hover:underline break-all">
                  finejw@skku.edu
                </a>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              © {year} CEEL — Catalysis for Eco-friendly Energy Laboratory
            </p>
          </div>

          {/* Right: Small Google Map */}
          <div className="rounded-2xl overflow-hidden bg-white/70 border border-gray-200/50 shadow-sm">
            <div className="px-3 pt-3 pb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Google Maps</span>
              <a
                href="https://maps.google.com/?q=Sungkyunkwan+University+Engineering+Building+2"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
              >
                Open
              </a>
            </div>
            <iframe
              title="CEEL Map"
              className="w-full h-[200px] md:h-[260px] border-t border-slate-200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={"https://www.google.com/maps?q=Sungkyunkwan%20University%20Engineering%20Building%202&output=embed"}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}