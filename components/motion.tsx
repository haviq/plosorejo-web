'use client'

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion'
import type { ReactNode } from 'react'

export const easeOut = [0.22, 1, 0.36, 1] as const

/**
 * Safe fade-up variants.
 * Never fully hide content (opacity:0) — some mobile WebViews / hydration
 * glitches leave framer-motion stuck on `initial`, which made the site look
 * blank (only hero mountain) and blocked clicks on invisible layers.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0.2, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0.2 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0.35, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0,
    },
  },
}

/** Instant-visible variants for reduced-motion users */
const reducedFade: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}

const reducedStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
}

/** Forgiving viewport — triggers earlier on mobile */
const defaultViewport = { once: true, amount: 0.05 as const, margin: '80px 0px' as const }

type MotionDivProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  className?: string
  delay?: number
}

export function MotionDiv({
  children,
  className,
  delay = 0,
  ...props
}: MotionDivProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={defaultViewport}
      variants={reduce ? reducedFade : fadeUp}
      transition={{ delay, duration: reduce ? 0 : 0.45, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionSection({
  children,
  className,
  delay = 0,
  ...props
}: MotionDivProps) {
  const reduce = useReducedMotion()
  return (
    <motion.section
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={defaultViewport}
      variants={reduce ? reducedFade : fadeUp}
      transition={{ delay, duration: reduce ? 0 : 0.45, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.section>
  )
}

export function Stagger({
  children,
  className,
  fast = false,
  ...props
}: MotionDivProps & { fast?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={defaultViewport}
      variants={reduce ? reducedStagger : fast ? staggerFast : staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  ...props
}: MotionDivProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={reduce ? reducedFade : fadeUp}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { motion }
