'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function MotionSection({ children, delay = 0, className }: MotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
