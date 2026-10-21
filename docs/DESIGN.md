# Design and motion

## The concept

The page is a lab bench seen from above. The background is a grey anti-static mat with its printed grid. Things lie on it, and each kind of content is the object it would be in a real lab:

| Content | Object | Component |
| --- | --- | --- |
| Test reports, forms, datasheets | A sheet of paper | `Sheet`, `.sheet` |
| Lab notes | A ruled notebook page with a maroon margin line | `NotebookPage`, `.note-sheet` |
| Reference designs | A soldermask board with gold pads and silkscreen | `Board`, `BoardArt` |
| Tools and the hero scope | A bench instrument with a dark faceplate and screen | `Instrument`, `.screen` |
| Call to action | A maroon board band with silkscreen text | `BriefBand` |

The maroon is BuildIoT BD's brand colour, used here as soldermask, so the store and the lab read as one family.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `mat` | `#dce3e4` | Page background (the bench) |
| `sheet` | `#fbfcfb` | Paper |
| `ink` | `#14191c` | Text |
| `ink-2` | `#3e4a50` | Secondary text (7.0:1 on mat) |
| `ink-3` | `#56646a` | Labels and fine print (4.7:1 on mat) |
| `line` | `#b9c4c8` | Rules and borders |
| `mask` | `#661414` | Soldermask: primary buttons, boards, accents |
| `gold` | `#c9a24d` | ENIG pads: the one highlight (button pads, active markers) |
| `silk` | `#f4f2ee` | Silkscreen text on maroon (11.2:1) |
| `panel` | `#1a1f22` | Instrument faceplates and the footer |
| `screen` | `#0e1316` | Instrument screens |
| `ch1` | `#f2c94c` | Scope channel 1 trace |
| `ch2` | `#5cc6e0` | Scope channel 2: cursors and annotations |

Gold is never used for text on light backgrounds; it fails contrast. On dark panels it passes.

## Type

- **Archivo** (variable, width 62–125%, weight 100–900). Width is the expressive axis: headings are set wide (112–125%) like the legends on an instrument front panel; body text stays at 100%.
- **B612 Mono**, regular only, designed for aircraft cockpit displays. Used for codes (`BIL-TR-001`, `RD-01`), board silkscreen, notebook entry numbers and step numerals.

Scale (rem): 0.75, 0.875, 1, 1.125, 1.3125, 1.5, 2.25, 3, 4.5. Classes: `t-display`, `t-h1` to `t-h4`, `t-lead`, `t-label`, `t-fine`. Reading measure stays under 45rem.

## Motion

Motion answers an action or shows how something works. There is one orchestrated moment per page, and everything has a reduced-motion fallback.

| Moment | What happens | Timing |
| --- | --- | --- |
| Home load | The two headline lines rise from behind a mask; the lead, buttons and scope follow; the scope's overview sweeps, then the one-report trace draws with a glowing head | Lines 1100 ms `ease-out-expo`, scope starts at 650 ms, trace 1500 ms |
| Section change ("sweep") | A gold probe line wipes the old page off left to right, exposing the maroon stage, then the new page wipes on behind it. The header stays still | Off 560 ms `ease-in-out-quart`; on 620 ms `ease-out-expo` from 380 ms |
| Opening an object ("drill") | The report, board or notebook page morphs into its place on the new page, with a slight blur mid-flight; the rest cross-fades | Morph 560 ms; fade out 180 ms, in 320 ms from 140 ms |
| Menu | The maroon menu wipes down from the top; links rise in sequence | 520 ms; links staggered 35 ms |
| Brief form steps | Steps slide in the direction of travel | Out 200 ms; in 420 ms from 120 ms |
| Drawings ("plates") | Animate only while on screen: the RTOS playhead runs, the power trace draws, packets queue while the link is down, the prototype explodes | Loops of 6–8 s |
| Process | A maroon trace fills down the five steps as you scroll | Linked to scroll |
| Readouts | Numbers ease to their new value, in log space so µA to mA reads smoothly | 520–600 ms |

Implementation:

- Page transitions use React's `ViewTransition` with transition types set on links (`sweep`, `drill`). Browser back and forward switch instantly.
- React keeps the document root out of view transitions, so the maroon stage is a real element (`.vt-stage`) that takes a `view-transition-name` only while a sweep runs.
- Each page paints its own bench background (`.page-shell`), so snapshots are opaque.
- Reduced motion: a block at the end of `globals.css` zeroes view-transition durations and stops decorative animation. The canvas code checks the media query itself and draws the finished trace.

## Quality floor

- Visible focus on every control (maroon on light, gold on dark).
- Text contrast of at least 4.5:1, checked for every pair above.
- Works from 320 px wide with no horizontal scroll.
- Home page under 300 KB above the fold.
