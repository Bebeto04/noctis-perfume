# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the user's written brief (2026-09-17). The user asked not to be consulted on design decisions, so no interview round was held. Every fact below comes from that brief; nothing was invented.

## Platform

web

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS 4. GSAP + ScrollTrigger own the scroll narrative; Motion is allowed only for small hovers, menus, drawers. No Three.js, React Three Fiber, WebGL or 3D models (binding).

## Users

Primary audience is the user's prospective clients and reviewers: people evaluating a creative-developer portfolio piece. Inside the fiction, the visitor is someone discovering a luxury eau de parfum online.

## Product Purpose

A fictional luxury perfume house, NOCTIS, launching NOCTIS I. The site is a scroll-driven digital campaign where the bottle is the protagonist, ending in a working (frontend-only) bag and checkout entry. Success: it reads as agency-grade creative development.

## Positioning

Depth without 3D: a single, continuous bottle assembled from six separately rendered layers travels through the whole page, opens up into an exploded view and reassembles, all with 2D techniques.

## Capabilities and Constraints

- Frontend cart (add, quantity, remove, subtotal); no real payment.
- One continuous perfume component across the narrative; clones only for the add-to-bag flight.
- Must respect prefers-reduced-motion, keyboard, screen readers, touch (no hover-only interactions).
- Target viewports: 1920x1080, 1440x900, 1024x768, 390x844.

## Brand Commitments

- Name: NOCTIS. Product: NOCTIS I, Eau de Parfum, 100 ML, Woody · Amber · Floral, R$ 589 (fictional).
- Tagline (original): "SCENT IS A MEMORY YOU CAN WEAR." → site: "Perfume é uma memória que se veste." Footer: "Deixe algo para trás."
- Notes: opening Bergamot, Pink Pepper, Saffron; heart Jasmine, Cedarwood, Iris.
- Copy language: Brazilian Portuguese (user request, 2026-09-17; the brief's copy was English). Brand and product names stay: NOCTIS, NOCTIS I, Eau de Parfum.
- Palette reference given by the user: #080706, #110D0A, #1A120D, #A96418, #C79A55, #E9DDCE, #F3ECE4.
- Type: sophisticated editorial serif + modern sans; never wedding-invitation or old-luxury.
- Anti-references: purple/blue gradients, glow everywhere, card grids, bento, glassmorphism, "trusted by", testimonials, template sections.

## Evidence on Hand

Rendered product assets supplied by the user (in public/images/noctis/): cap, atomizer, collar, glass body, liquid, name plaque, and one labelled exploded-view reference. No assembled-bottle render, no ingredient photography, no lifestyle photography. Instagram/Journal/Stores/Contact have no real URLs.

## Product Principles

1. The bottle is the protagonist; everything else supports its motion.
2. One object, one continuous journey; never a second copy pretending to be the same bottle.
3. Restraint over spectacle: every effect subtle enough to feel expensive.
4. Content stays reachable without motion.
