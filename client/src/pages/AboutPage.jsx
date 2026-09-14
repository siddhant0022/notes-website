import { motion } from 'framer-motion';
import { ExternalLink, Heart, Users } from 'lucide-react';

const TEAM = [
  {
    name: 'Siddhant',
    role: 'Co-Founder & Developer',
    url: 'https://siddhantnet.vercel.app/',
  },
  {
    name: 'Nishant',
    role: 'Co-Founder & Developer',
    url: 'https://whynishant.netlify.app/',
  },
];

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About Us</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Built for GCET students, by GCET students.
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          GCETNotes is a community-driven platform for sharing academic resources — class notes,
          AKTU PYQs, quantums, lab manuals, and more. We built it because finding reliable study
          material shouldn't be harder than the exams themselves.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-accent">
          <Heart className="w-4 h-4" />
          <h2 className="font-display font-semibold">Our Mission</h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          To create a single, trusted hub where GCET students can discover, preview, and download
          quality academic resources — while giving contributors a fair, moderated space to share
          their work with the community.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <h2 className="font-display font-semibold">The Team</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEAM.map((member, i) => (
            <motion.a
              key={member.name}
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 group block hover:border-accent/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-lg font-bold text-accent mb-4">
                {member.name.charAt(0)}
              </div>
              <h3 className="font-display font-semibold group-hover:text-accent transition-colors">
                {member.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">{member.role}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                Visit portfolio
                <ExternalLink className="w-3 h-3" />
              </span>
            </motion.a>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="font-display font-semibold mb-3">What We Offer</h2>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            Curated resources filtered by branch, semester, and subject
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            In-built PDF viewer with download support
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            Community uploads with admin moderation
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            Star and bookmark your favourite notes
          </li>
        </ul>
      </motion.section>
    </div>
  );
}
