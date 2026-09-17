---
name: NOCTIS
description: A night-issue fashion advertorial turned by the scroll; one amber-lit bottle crosses every spread.
colors:
  ink-0: "#080706"
  ink-1: "#110d0a"
  ink-2: "#1a120d"
  ink-3: "#2a1d14"
  amber: "#a96418"
  amber-deep: "#5a2f0b"
  gold: "#c79a55"
  gold-soft: "#d9b98a"
  cream: "#e9ddce"
  text: "#f3ece4"
  text-dim: "#b8aa98"
  text-faint: "#8d8070"
  lit-cream: "#fff4e4"
  hairline: "rgb(199 154 85 / 0.28)"
  hairline-faint: "rgb(199 154 85 / 0.14)"
typography:
  masthead:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "clamp(5rem, 19.5vw, 25rem)"
    fontWeight: 400
    lineHeight: 0.8
    letterSpacing: "0.05em"
  display:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "clamp(3.4rem, 7.2vw, 8.6rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.012em"
  display-heart:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "clamp(4rem, 14vw, 17rem)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "-0.01em"
    fontVariation: "\"opsz\" 22"
  headline:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "clamp(2.2rem, 3.8vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 0.95
  lede-italic:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.7rem)"
    fontWeight: 400
    lineHeight: 1.35
  title:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "1.3rem"
    fontWeight: 400
    letterSpacing: "0.14em"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 500
    letterSpacing: "0.28em"
  folio:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.58rem"
    fontWeight: 400
    letterSpacing: "0.3em"
    fontFeature: "\"tnum\""
rounded:
  none: "0px"
  round: "50%"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4.5rem)"
  touch: "44px"
  stack: "1.6rem"
  panel: "2rem"
components:
  button-solid:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink-0}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 2.3rem"
    height: "52px"
  button-solid-hover:
    backgroundColor: "{colors.gold-soft}"
    textColor: "{colors.ink-0}"
  button-line:
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0"
    height: "44px"
  nav-cta:
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.1rem"
  drawer:
    backgroundColor: "{colors.ink-1}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    width: "min(460px, 100vw)"
  menu-sheet:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.text}"
    padding: "1.1rem clamp(1.25rem, 4vw, 4.5rem) 3rem"
---

# Design System: NOCTIS

## Overview

**Creative North Star: "The Night Issue"**

NOCTIS is a fashion-magazine perfume advertorial printed on warm black stock and lit by a single amber source. Every chapter is a double-page spread; the bottle is the only object allowed to cross the centre fold. Type does the work that containers do elsewhere: a huge, tight Didone set as masthead and headline, and a small, widely tracked grotesk for captions, credits and controls. Nothing is boxed. Structure comes from hairline rules, plate credits, registration crosses and a running folio, the furniture of a printed page.

Density is low and deliberate: one idea per viewport, with generous black around it. Light is the only ornament. The amber halo, the pool on the product floor and the falloff inside the liquid are all the same light behaving physically, never a colour wash laid over the page. Motion is the page turning: one scrubbed timeline measured in viewport-heights of scroll, with two house curves.

Rejected, as brand commitments: glassmorphism, card grids and bento, purple or blue gradients, glow on everything, testimonial or "trusted by" template sections.

**Key Characteristics:**
- Warm black stock (ink-0 to ink-3) with one amber light and one metal, brushed gold.
- Bodoni Moda with its optical-size axis, from 25rem masthead to 1.3rem plate titles; Hanken Grotesk for every caption and control.
- Square corners everywhere; round only for points of light and shadow.
- Print furniture instead of containers: hairlines, registration crosses, plate numbers, folio.
- A single continuous object on a z-ordered stage; type sits behind and in front of it.
- One GSAP scrub timeline (scrub 0.6) in vh-of-scroll units; a linear static reading for reduced motion.

## Colors

A warm black and cream print palette lit by one amber source, with brushed gold as the only metal.

### Primary
- **Brushed Gold** (gold): the single metal. Active underline of line buttons, registration crosses and annotation dots, focus outlines, note glyph strokes, the preloader progress rule, the active-nav dot. Always thin: a 1px line, a 3px dot, a stroke.
- **Pale Gilt** (gold-soft): the active or hover state of gold things. Hovered solid button, active note name, active annotation title, bag count, menu current page, the product kind line.

### Secondary
- **Lamp Amber** (amber): the light source, never a fill. It exists only as radial falloff: the scene halo, the product floor pool, the footer horizon, the drawer thumbnail glow.
- **Burnt Resin** (amber-deep): the outer shoulder of the amber falloff where light dies into the stock.

### Neutral
- **Night Stock** (ink-0): the page. Scene, footer, preloader, menu sheet, text on cream buttons, theme-color.
- **Umber Stock** (ink-1): the one raised panel, the bag drawer.
- **Warm Shadow** (ink-2): the lit centre of the scene background gradient.
- **Scorched Edge** (ink-3): scrollbar thumb; the darkest visible tone above stock.
- **Pressed Cream** (cream): solid button face, the "Who is" display words, and (at 94% alpha) the masthead.
- **Cream Ink** (text): default text and headlines.
- **Dim Ink** (text-dim): secondary lines, spec, captions, nav links at rest.
- **Faint Ink** (text-faint): folio, plate numbers, hints, legal, counts.
- **Lamplit Cream** (lit-cream): text set inside the amber liquid chapter, where cream must read against a bright orange field.
- **Gold Hairline** (hairline): control rules, the base line under line buttons, the product buy rule, quantity stepper outline, caption rules.
- **Faint Gold Hairline** (hairline-faint): panel seams, nav bottom border, drawer head and foot, menu head. Drawer rows and reduced-motion section breaks go fainter still (0.1 alpha).

### Named Rules
**The One Light Rule.** Amber appears only as light: radial falloff that fades to transparent. It never fills a button, a block, text, or a flat background.

**The One Metal Rule.** Gold is the only accent and there is no second metal or hue. In the interface it is hairline-weight: 1px rules, strokes, crosses, 3px dots. In type it appears only as the italic counter-voice of the giant personality words and as Pale Gilt active states.

## Typography

**Display Font:** Bodoni Moda (with Didot, Times New Roman, serif), loaded via next/font with the `opsz` axis and italic.
**Body Font:** Hanken Grotesk (with ui-sans-serif, system-ui, sans-serif).

**Character:** A fashion-masthead Didone set enormous and tight, against a quiet grotesk that behaves like caption type in a magazine: small, uppercase, widely tracked.

### Hierarchy
- **Masthead** (400, clamp(5rem, 19.5vw, 25rem), line-height 0.8, +0.05em): the NOCTIS wordmark behind the bottle's cap, and at 17vw / 10% cream alpha in the footer. Tracked-out marks compensate with an equal negative right margin so they stay optically centred.
- **Display** (400, clamp(3.4rem, 7.2vw, 8.6rem) for chapter titles, 0.88 to 0.9 line-height, slight negative tracking): "Crafted to last.", "The Opening", the product name. Personality words run larger still (clamp(6rem, 16vw, 21rem), uppercase, alternating roman cream and italic gold).
- **Display Heart** (400, clamp(4rem, 14vw, 17rem), 0.82, uppercase, `opsz` pinned at 22): the heart-note names inside the liquid. Iris runs at clamp(6rem, 22vw, 26rem).
- **Headline** (400, clamp(2.2rem, 3.8vw, 4.6rem), 0.95): secondary chapter headings such as "Who is NOCTIS?".
- **Lede Italic** (400 italic, clamp(1.1rem, 1.6vw, 1.7rem)): family line, footer sign-off, reveal whispers, the "feel like?" framing. Italic Didone is the house voice for quiet asides.
- **Title** (400, 1.3rem, +0.14em, uppercase): annotation part names, drawer line names (1.35rem, +0.04em, sentence case).
- **Body** (400, 1rem, 1.55): annotation descriptions (0.82rem), drawer notes, reduced-motion prose.
- **Label** (500, 0.68 to 0.74rem, +0.24 to +0.3em, uppercase): buttons, nav links, spec lines, note facets, heart lines (600, 0.86rem).
- **Folio / Plate** (400, 0.58rem, +0.3 to +0.32em, uppercase, tabular numerals): running folio "NOCTIS I — Anatomy / p. 05" and plate credits "PL. 01".

### Named Rules
**The Optical Size Rule.** Bodoni Moda runs with automatic optical sizing, so the masthead gets maximum hairline contrast and small titles get sturdier strokes. The single override is display text set over the bright amber liquid: optical sizing off, `opsz` 22, so the hairlines survive the glare at 17rem.

**The Caption Voice Rule.** Every non-display word is Hanken Grotesk, small, uppercase and tracked at least +0.16em, except running prose and prices. Numbers that count (price, quantity, page, percentage) are tabular.

**The Two Faces Rule.** Didone speaks, grotesk labels. Never set a control in Bodoni or a headline in Hanken.

## Layout

The page is one sticky full-viewport stage (`100vh`) pinned inside an 1880vh story. Chapters are not stacked sections; they are states of the same stage, positioned absolutely against a fluid side gutter of clamp(1.25rem, 4vw, 4.5rem). Copy anchors to the gutters and the lower third (hero copy at 9vh from the bottom, folio at 2vh) while the bottle holds the centre or slides to ±20vw.

On desktop a faint centre fold (18vw soft shadow with a 1px gold rule) marks the spread and the folio runs along the foot. Layout switches in lockstep with the timeline's `layoutFor()`: desktop at 1024px and up, tablet 700 to 1023px, mobile below 700px. Below 1024px the fold and folio disappear, nav links collapse into a full-screen menu sheet, and each chapter stacks with the bottle high and copy low. Below 700px the nav CTA hides and the scroll cue moves to the right on the CTA's baseline.

Rhythm: stack gaps of 1.6rem inside copy groups, 2rem panel padding in the drawer (1.3rem on phones), 44px minimum touch targets throughout, and vh-based vertical placement so compositions scale with the viewport, not the content.

**The Spread Rule.** Each chapter reads as one magazine spread: a single headline, one supporting line, the bottle. If a viewport needs two headlines, it is two chapters.

## Elevation & Depth

Depth is theatrical, not material. Nothing on the interface is lifted with a shadow; depth comes from a fixed z-order on the stage and from light. All layers are siblings inside one isolated scene: 1 halo and fold, 2 product surface, 10 type behind the bottle, 11 note glyphs, 20 the bottle, 30 type in front, 31 personality, 32 annotations, 33 folio, 40 the inside-the-liquid layer, 41 the reveal. Fixed chrome sits above: nav 60, bag flight 70, grain 90 (4.5% film grain), preloader 100, skip link 200.

On fine pointers the bottle tilts at most ±2.5 degrees with per-part parallax (cap 1.6, label 1.35, atomizer 1.2, collar 1.1, body 0.4, liquid 0) and the halo drifts the opposite way.

### Shadow Vocabulary
- **Contact shadow** (`radial-gradient(closest-side, rgb(0 0 0 / 0.55), transparent)`): where the cap meets the glass shoulder.
- **Floor shadow** (`radial-gradient(closest-side, rgb(0 0 0 / 0.75), transparent)`): under the bottle, breathing with the 7.5s float.
- **Flight shadow** (`filter: drop-shadow(0 18px 30px rgb(0 0 0 / 0.5))`): only on the bottle clone flying to the bag.
- **Legibility halo** (`text-shadow: 0 2px 24px rgb(20 8 2 / 0.85)`): reveal whispers over the silk texture.

### Named Rules
**The Object-Only Shadow Rule.** Shadows belong to the physical bottle (contact, floor, flight) and to type over photography. Interface elements never cast one.

## Shapes

Square and printed. Every control, panel, rule and outline has a 0px radius. Round shapes are reserved for things that are light or shadow: halos, pools, contact and floor shadows, liquid motes, the 3px active dot. Lines are 1px and gold-tinted. The recurring geometry is the registration cross (a 12px plus drawn with hairline stroke) and the elbowed leader line from a part to its caption column.

## Components

### Buttons
Print-weight controls: a caption with a rule, or a cream block.
- **Shape:** square corners (0px).
- **Solid:** Pressed Cream face with Night Stock label, 52px tall, 0 2.3rem padding, 600 weight label type. Used once per context: Add to bag, checkout, menu CTA.
- **Solid hover / active:** face warms to Pale Gilt over 240ms on fine pointers; press scales to 0.97 on noctis.out over 140ms.
- **Line:** caption type on a 44px hit area with a 1px Gold Hairline base and a brushed gold rule over it; on hover the gold rule retracts to 35% from the right (420ms, noctis.out). Used for secondary moves: Discover the scent, Continue browsing.
- **Nav CTA:** caption in a 1px hairline box (0.7rem 1.1rem); hover turns the border gold with an 8% gold wash.
- **Quiet link:** faint uppercase caption with a hairline underline offset 5px, for destructive-light actions like Remove.

### Navigation
- **Style:** fixed, transparent over the cover; after scrolling, a Night Stock bar at 92% with a faint gold bottom hairline appears and compresses via transform (scaleY 0.7, content lifts 0.75rem), never by animating padding. Over the amber chapter the bar tints to burnt brown at 55%.
- **Typography:** NOCTIS wordmark in Bodoni at 1.15rem, +0.34em; links in 0.68rem label type, Dim Ink at rest, Cream Ink on hover.
- **Active:** Cream Ink plus a 3px gold dot beneath, never a colour bar or underline.
- **Bag:** inline 20x22 stroke SVG with a tabular Pale Gilt count; on add it bumps (scale 1.22, 420ms) or, with reduced motion, only shifts to Pale Gilt.
- **Mobile:** a text "Menu" button opens a full-screen native `<dialog>` sheet on Night Stock, fading in 320ms; chapters listed in 2.6 to 4.4rem Bodoni with tabular folio numbers, current page in Pale Gilt, a full-width solid CTA at the foot.

### Bag Drawer
A native `<dialog>` opened with `showModal()`: focus trapped, Esc closes, background inert. Umber Stock panel, min(460px, 100vw) wide, full dynamic height, faint gold left hairline, no radius. Slides from the right on the drawer curve, 460ms to open and 280ms to close; backdrop darkens to 62%. Rows are separated by hairlines rather than boxed: 72px thumbnail on a small amber glow, Bodoni name, faint caption meta, a square hairline quantity stepper with 40px cells, tabular prices. Footer carries a tracked subtotal and a full-width solid button.

### Exploded-View Annotations (signature)
The anatomy plate. Each part gets a 3px gold dot on the object, a 1px gold leader (62% alpha) that runs out and elbows into a right-hand caption column, and a registration cross at the elbow. The caption block stacks a Bodoni uppercase title, a Dim Ink description, and a faint plate credit ("PL. 01"). Rows keep a 96px minimum pitch. Leaders draw in by stroke-dashoffset on noctis.inOut; text and cross rise on noctis.out. Focusing, hovering or tapping a part lights its title in Pale Gilt and dims the other parts to 30% with desaturation. Below 1024px annotations go compact: a 14px tick and a small grotesk name beside each part, with the description moved into a bottom caption.

### Folio
The running foot of the spread: "NOCTIS I — [Chapter]" left, "p. 0N" right, in folio type and Faint Ink. It is how chapter state is shown. It hides on the cover, inside the liquid and on the reveal, and is desktop only.

### Note Glyphs
Opening-note marks drawn as 56px inline SVG with a 1px non-scaling gold stroke and optional soft gold fill. The active note turns its glyph Pale Gilt, rotates 18 degrees and scales 1.12; the note name shifts right 0.18em in Pale Gilt while other notes recede to 34% opacity.

### Motion Grammar
- **Curves:** noctis.out `0.23, 1, 0.32, 1` for arrivals, reveals and state changes; noctis.inOut `0.77, 0, 0.175, 1` for the bottle travelling between poses, disassembly, leaders and the preloader wipe; drawer `0.32, 0.72, 0, 1`; breath `0.37, 0, 0.63, 1` for idle float. Exits use power1.in.
- **Timeline:** one GSAP ScrollTrigger timeline with scrub 0.6 and default ease none. Time is measured in vh of scroll: a tween on [100, 180] plays while the visitor scrolls from 100vh to 180vh. The whole story is 1780 units; every range lives in the story config, never in components. The one bottle is posed per layout (x as a fraction of viewport width, y of height, scale, rotation).
- **Idle life:** 7.5s float of ±0.6%, a 9s sheen pass across the glass, a 9s halo breath.
- **Reduced motion:** the scrubbed stage is not mounted at all. The same content renders as a linear static reading with the assembled bottle, a static exploded plate, and all actions available; no preloader, no bag flight, drawer and menu fade in 200ms, nav and bag feedback become colour only.

## Do's and Don'ts

### Do:
- **Do** keep amber as radial light that fades to transparent (halo, floor pool, horizon, liquid falloff).
- **Do** draw structure with 1px gold hairlines, registration crosses, plate credits and the folio.
- **Do** keep every control and panel square (0px) and every touch target at least 44px.
- **Do** set headlines in Bodoni Moda at 400 with tight leading (0.8 to 0.95) and captions in uppercase Hanken Grotesk tracked +0.16em or more.
- **Do** pin `opsz` low (22) when giant Didone sits on a bright field.
- **Do** move the bottle only on noctis.inOut and bring text in on noctis.out, with ranges in vh-of-scroll units kept in config.
- **Do** ship a complete static reading for prefers-reduced-motion rather than a slowed-down animation.
- **Do** use native `<dialog>` for the drawer and the menu sheet.

### Don't:
- **Don't** use glassmorphism: no backdrop-filter blur panels or frosted bars. The glass is the bottle's, not the interface's.
- **Don't** put content in cards, tiles or bento grids; separate with hairlines and space.
- **Don't** use gradients as decoration: no colour-to-colour washes, gradient text, or gradient buttons, and never purple or blue.
- **Don't** add glow to interface elements; light belongs to the scene.
- **Don't** add a second accent colour or a second metal.
- **Don't** show chapter state with a coloured bar or pill; use the folio and the 3px dot.
- **Don't** cast shadows from UI; shadows belong to the physical bottle.
- **Don't** duplicate the bottle on the page; the only clone is the transient add-to-bag flight.
