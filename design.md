---
version: "1.0.0"
name: "Aura AI System"
description: "Visual system for AI-centric landing pages utilizing high-depth stacks and neon-tinted dark surfaces."
colors:
  background: "#ececea"
  foreground: "#111111"
  accent: "#DF5C46"
  surface: "#0a0a0a"
  muted: "#6f6f6f"
  border: "#e4e4e1"
  success: "#34d399"
  card-fintech: "#0b0d12"
  card-luma: "#080c09"
typography:
  headings:
    family: "Urbanist"
    weights: ["600", "700", "800"]
    tracking: "-0.025em"
  body:
    family: "Inter"
    weights: ["400", "500"]
  accent:
    family: "Caveat"
    weights: ["500"]
  mono:
    family: "monospace"
    size: "12px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "64px"
  section: "112px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "28px"
  full: "999px"
components:
  buttons:
    radius: "999px"
    shadow: "0 10px 20px rgba(0,0,0,0.2)"
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
  cards:
    radius: "28px"
    border: "1px solid rgba(255,255,255,0.12)"
    shadow: "0 30px 60px -12px rgba(0,0,0,0.5)"
  badges:
    radius: "999px"
    padding: "8px 16px"
motion:
  reveal: "blur-to-sharp 900ms ease"
  stack: "scroll-scale 100ms linear"
  marquee: "linear constant-scroll"
layout:
  maxWidth: "1240px"
  grid: "8px"
---

# Aura AI System

Visual system for AI-centric landing pages utilizing high-depth stacks and neon-tinted dark surfaces.

## Overview

Aura is a performance-oriented visual system designed for SaaS marketing. It features a "dark glass" aesthetic paired with a high-impact primary orange accent. The system relies on depth, stacking effects, and micro-interactions to signify modern AI capabilities.

## Colors

The palette is rooted in a neutral stone background (`#ececea`) that pivots to deep obsidian surfaces (`#0a0a0a`) for primary feature areas. The signature **Aura Red** (`#DF5C46`) is used sparingly for primary actions, critical labels, and interactive highlights.

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#ececea` | Page canvas |
| `foreground` | `#111111` | Primary text on light |
| `accent` | `#DF5C46` | CTAs, labels, highlights |
| `surface` | `#0a0a0a` | Dark feature bands |
| `muted` | `#6f6f6f` | Secondary text |
| `border` | `#e4e4e1` | Dividers on light |
| `success` | `#34d399` | Success states |
| `card-fintech` | `#0b0d12` | Dark card variant |
| `card-luma` | `#080c09` | Dark card variant |

## Typography

- **Urbanist** — primary display face for high-impact headers (weights 600–800, tracking `-0.025em`).
- **Inter** — legible, functional body copy (400 / 500).
- **Caveat** — organic annotations to humanize AI context (max **one** per section).
- **Monospace** — technical identifiers / tags (`12px`).

## Spacing

Strict **8px grid**. Section gutters use `--section` (`112px`) so floating fragments and depth layers can breathe.

| Token | Value |
|-------|-------|
| `xs` | `8px` |
| `sm` | `16px` |
| `md` | `24px` |
| `lg` | `32px` |
| `xl` | `64px` |
| `section` | `112px` |

## Layout

- Centered max-width: **1240px**.
- Shared content column for header, hero, sections, and footer (one left edge).
- Prefer a staggered / stacked narrative where dark bands and light bands alternate; avoid competing left indents.

## Elevation & Depth

- Radial gradients at the bottom-center of dark containers (floor lighting).
- Soft shadows; accent-tinted shadows on primary buttons (`#DF5C46` ~30% opacity).
- Z-layering: ambient background `z-0`, interactive fragments `z-30+`.

## Shapes

| Token | Value | Typical use |
|-------|-------|-------------|
| `sm` | `8px` | Inputs, small chips |
| `md` | `12px` | Small fragments |
| `lg` | `20px` | Medium panels |
| `xl` | `28px` | Cards / containers |
| `full` | `999px` | Nav + action pills |

## Components

- **Nav** — minimal; persistent pill CTA.
- **Hero** — large Urbanist headline, short lede, accent pill CTA; optional word reveal.
- **Feature / problem / steps / benefits** — light canvas or dark surface bands; generous section spacing.
- **Testimonial / case studies** — dark glass surface with soft border.
- **Demo form / CTA** — high-depth radial dark container; inset glass inputs.
- **FAQ** (when present) — accordion with subtle border hover.
- **Marquee** (when present) — constant-scroll social proof strip.

## Motion

- **Reveal**: `translateY(24px)` + `blur(12px)` → clear over `900ms`.
- Prefer calm transitions (`300ms` cubic-bezier on buttons).
- Respect `prefers-reduced-motion`.

## Do's and Don'ts

**Do**

- Use radial gradients (dark → deeper dark) for focus inside containers.
- Use Aura Red sparingly for primary actions.
- Keep one shared horizontal content alignment.

**Don't**

- Use sharp corners or thin hard borders; prefer soft / glass edges.
- Use more than one Caveat annotation per section.
- Flood the page with accent orange.

## Accessibility

- Maintain ≥ 4.5:1 contrast for body text on dark and light surfaces.
- Label interactive controls (aria or visible text).
- Smooth scroll; avoid rapid flashing in marquees.
