'use client';
import { useEffect, useState } from 'react';
import type { Peer } from '@/types/peer';
import { PeerCard } from '@/components/PeerCard';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid md:grid-cols-3 gap-4">{children}</div>
    </section>
  );
}

export default function PeerPage() {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/peer', { cache: 'no-store' });
      const data = await res.json();
      setPeers(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  const current = peers.filter((p) => !p.isAlumni);
  const alumni = peers.filter((p) => p.isAlumni);
  const byRole = (role: Peer['role']) => current.filter((p) => p.role === role);

  return (
    <div>
      <Section title="Postdoctoral Researchers">
        {byRole('Postdoctoral Researcher').map((p) => (
          <PeerCard key={p.id} peer={p} />
        ))}
      </Section>
      <Section title="Ph.D Course">
        {byRole('Ph.D Course').map((p) => (
          <PeerCard key={p.id} peer={p} />
        ))}
      </Section>
      <Section title="Master Course">
        {byRole('Master Course').map((p) => (
          <PeerCard key={p.id} peer={p} />
        ))}
      </Section>
      <Section title="Alumni">
        {alumni.map((p) => (
          <PeerCard key={p.id} peer={p} />
        ))}
      </Section>
    </div>
  );
}