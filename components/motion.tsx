'use client'

import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const easeOut = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: easeOut },
    },
}

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.45, ease: easeOut },
    },
}

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: easeOut },
    },
}

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
}

export const staggerFast: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.02,
        },
    },
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
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            transition={{ delay, duration: 0.55, ease: easeOut }}
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
    return (
        <motion.section
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={fadeUp}
            transition={{ delay, duration: 0.55, ease: easeOut }}
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
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={fast ? staggerFast : staggerContainer}
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
    return (
        <motion.div className={className} variants={fadeUp} {...props}>
            {children}
        </motion.div>
    )
}

export { motion }
