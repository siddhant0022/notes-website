import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

const CONTACT = {
  email: 'gcetnotes@gmail.com',
  address: 'Knowledge Park 2, Greater Noida, India',
};

export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact Us</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Get in touch
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Have a question, feedback, or need to report an issue? We'd love to hear from you.
          Reach out and we'll get back to you as soon as we can.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ContactCard
          icon={Mail}
          title="Email"
          delay={0.1}
          href={`mailto:${CONTACT.email}`}
        >
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-accent hover:underline text-sm font-medium"
          >
            {CONTACT.email}
          </a>
          <p className="text-xs text-slate-500 mt-2">
            For general inquiries, upload issues, or copyright concerns.
          </p>
        </ContactCard>

        <ContactCard icon={MapPin} title="Address" delay={0.15}>
          <p className="text-sm font-medium">{CONTACT.address}</p>
          <p className="text-xs text-slate-500 mt-2">
            Galgotias College of Engineering & Technology campus area.
          </p>
        </ContactCard>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-accent">
          <MessageSquare className="w-4 h-4" />
          <h2 className="font-display font-semibold">What can we help with?</h2>
        </div>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            Reporting inappropriate or copyrighted content
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            Upload moderation status inquiries
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            Account or technical support
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            Partnership or collaboration requests
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            Feature suggestions and feedback
          </li>
        </ul>
      </motion.section>
    </div>
  );
}

function ContactCard({ icon: Icon, title, children, delay = 0, href }) {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Wrapper
        {...wrapperProps}
        className="glass rounded-2xl p-5 h-full block hover:border-accent/20 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center mb-4">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <h3 className="font-display font-semibold mb-2">{title}</h3>
        {children}
      </Wrapper>
    </motion.div>
  );
}
