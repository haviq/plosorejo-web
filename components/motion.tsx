'use client'

/**
 * Motion helpers — transform-only animations.
 *
 * IMPORTANT: Never animate opacity. On Android Chrome/WebView, framer-motion
 * can stall on `initial` and leave content invisible + unclickable.
 * We only slide (y/x). Content is always fully opaque.
 */

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion'
import type { ReactNode } from 'react'

export const easeOut = [0.22, 1, 0.36, 1] as const

/** Slide up — no opacity change */
export const fadeUp: Variants = {
  hidden: { y: 14 },
  visible: {
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
}

/** Alias kept for imports */
export const fadeIn: Variants = {
  hidden: {},
  visible: {
    transition: { duration: 0.3, ease: easeOut },
  },
}

export const scaleIn: Variants = {
  hidden: { scale: 0.98 },
  visible: {
    scale: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
}

const reducedFade: Variants = {
  hidden: { y: 0 },
  visible: { y: 0 },
}

const reducedStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
}

const defaultViewport = {
  once: true,
  amount: 0.01 as const,
  margin: '120px 0px' as const,
}

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
      transition={{ delay, duration: reduce ? 0 : 0.4, ease: easeOut }}
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
      transition={{ delay, duration: reduce ? 0 : 0.4, ease: easeOut }}
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
