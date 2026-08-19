import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="responsive-header relative overflow-hidden" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {badge && (
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
            {badge}
          </motion.p>
        )}
        <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
