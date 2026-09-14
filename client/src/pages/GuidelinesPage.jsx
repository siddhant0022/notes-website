import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Ban, CheckCircle, Copyright, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    icon: Copyright,
    title: 'Intellectual Property & Copyright',
    items: [
      'All resources hosted on GCETNotes — including notes, PYQs, quantums, lab manuals, and other uploaded content — are the intellectual property of GCETNotes, its contributors, or the original content creators.',
      'You may NOT copy, reproduce, redistribute, republish, sell, or commercially exploit any resource from this platform without prior written permission from GCETNotes.',
      'Downloading a resource grants you a personal, non-transferable, non-commercial license to use it solely for your own academic study.',
      'Removing watermarks, author attributions, or platform branding from any resource is strictly prohibited.',
      'If you believe your copyrighted work has been uploaded without authorization, contact us immediately at gcetnotes@gmail.com with proof of ownership.',
    ],
  },
  {
    icon: Ban,
    title: 'Prohibited Uses',
    items: [
      'Uploading content you do not own or have explicit permission to share.',
      'Sharing, forwarding, or posting GCETNotes resources on third-party websites, Telegram channels, WhatsApp groups, or social media without permission.',
      'Using our resources to create competing platforms or repositories.',
      'Automated scraping, bulk downloading, or using bots to extract content from the platform.',
      'Misrepresenting GCETNotes content as your own original work in assignments, projects, or publications.',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Upload Guidelines',
    items: [
      'Only upload PDF files that are relevant to GCET/AKTU curriculum.',
      'Ensure content is accurate, readable, and properly formatted.',
      'Do not upload plagiarised, incomplete, or misleading material.',
      'Community uploads are subject to admin moderation — inappropriate content will be rejected.',
      'By uploading, you grant GCETNotes a non-exclusive license to host, display, and distribute your content on the platform.',
    ],
  },
  {
    icon: Scale,
    title: 'User Responsibilities',
    items: [
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'Report any misuse, copyright infringement, or inappropriate content to gcetnotes@gmail.com.',
      'Violations of these guidelines may result in account suspension or permanent ban.',
      'GCETNotes reserves the right to remove any content that violates these terms without prior notice.',
      'These guidelines may be updated at any time. Continued use of the platform constitutes acceptance of the latest version.',
    ],
  },
];

export function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Guidelines</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Platform Rules & Usage Policy
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Please read these guidelines carefully before using or sharing any resource on GCETNotes.
          By accessing this platform, you agree to comply with the terms outlined below.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-strong rounded-2xl p-5 border-amber-500/20 bg-amber-500/5 flex gap-4"
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-400 mb-1">Important Notice</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unauthorized copying, redistribution, or commercial use of GCETNotes resources is a
            violation of our terms and may result in legal action. When in doubt, always ask for
            permission first.
          </p>
        </div>
      </motion.div>

      <div className="space-y-5">
        {SECTIONS.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <section.icon className="w-4 h-4 text-accent" />
              <h2 className="font-display font-semibold">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                  <span className="text-accent shrink-0 mt-1">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-sm">Questions about these guidelines?</p>
            <p className="text-xs text-slate-500 mt-1">
              Contact us at{' '}
              <a href="mailto:gcetnotes@gmail.com" className="text-accent hover:underline">
                gcetnotes@gmail.com
              </a>
            </p>
          </div>
        </div>
        <Link
          to="/contact"
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors shrink-0"
        >
          Contact Us
        </Link>
      </motion.section>
    </div>
  );
}
