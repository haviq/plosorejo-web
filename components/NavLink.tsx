'use client'

import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type LinkProps = ComponentPropsWithoutRef<typeof Link>

/**
 * NavLink — plain Next.js Link, no curtain/transition overlay.
 * Exported showCurtain/revealCurtain are kept as no-ops so any
 * remaining import sites don't break at build time.
 */
export function showCurtain(_label: string) {}
export function revealCurtain() {}

export default function NavLink({ href, children, ...rest }: LinkProps) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
