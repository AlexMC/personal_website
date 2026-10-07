// Renders 1200x630 social preview cards (Open Graph / LinkedIn / X) as PNG,
// styled like the site: black CRT background, phosphor green, JetBrains Mono.

import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { site } from '../lib/site.mjs'

const WIDTH = 1200
const HEIGHT = 630
const PAD = 72
const COLORS = { bg: '#000000', primary: '#00FF9E', light: '#00AB70', medium: '#00734A', dark: '#003B24' }
// JetBrains Mono advances every glyph by 0.6em, so wrapping can count characters.
const CHAR_WIDTH_EM = 0.6

const FONT_DIR = path.join(process.cwd(), 'scripts/fonts')
const FONT_FILES = ['JetBrainsMono-Regular.ttf', 'JetBrainsMono-Bold.ttf'].map((f) => path.join(FONT_DIR, f))
const headshot = `data:image/jpeg;base64,${fs
  .readFileSync(path.join(process.cwd(), 'public', site.image))
  .toString('base64')}`

const escapeXml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function wrap(text, fontSize, maxWidth, maxLines) {
  const maxChars = Math.floor(maxWidth / (fontSize * CHAR_WIDTH_EM))
  const lines = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maxChars) {
      line = candidate
    } else {
      if (line) lines.push(line)
      line = word.length > maxChars ? `${word.slice(0, maxChars - 1)}…` : word
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    const last = kept[maxLines - 1]
    kept[maxLines - 1] = `${last.length >= maxChars ? last.slice(0, maxChars - 1) : last}…`
    return kept
  }
  return lines
}

const frame = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="${COLORS.primary}" fill-opacity="0.05"/>
    </pattern>
    <filter id="glow" x="-10%" y="-30%" width="120%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="mono"><feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="${COLORS.bg}"/>
  <rect width="100%" height="100%" fill="url(#scan)"/>
  <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" fill="none" stroke="${COLORS.dark}" stroke-width="2"/>
  ${body}
</svg>`

const portrait = (x, y, size) => `
  <image href="${headshot}" x="${x}" y="${y}" width="${size}" height="${size}" filter="url(#mono)" opacity="0.9"/>
  <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${COLORS.medium}" stroke-width="2"/>`

const text = (x, y, size, weight, color, content, extra = '') =>
  `<text x="${x}" y="${y}" font-family="JetBrains Mono" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${escapeXml(content)}</text>`

function render(svg) {
  return new Resvg(svg, {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'JetBrains Mono' },
  })
    .render()
    .asPng()
}

export function renderPostCard({ title, date, label = '> blog' }) {
  const titleSize = 60
  const lines = wrap(title, titleSize, WIDTH - PAD * 2, 3)
  const titleSvg = lines
    .map((line, i) => text(PAD, 205 + i * 78, titleSize, 700, COLORS.primary, line))
    .join('\n  ')
  return render(
    frame(`
  ${text(PAD, 120, 28, 400, COLORS.light, label)}
  <g filter="url(#glow)">
  ${titleSvg}
  </g>
  ${portrait(PAD, 446, 112)}
  ${text(PAD + 140, 492, 30, 700, COLORS.primary, site.name.toUpperCase())}
  ${text(PAD + 140, 532, 22, 400, COLORS.light, site.tagline.toUpperCase())}
  ${date ? text(WIDTH - PAD, 532, 22, 400, COLORS.medium, date, 'text-anchor="end"') : ''}`),
  )
}

export function renderDefaultCard() {
  return render(
    frame(`
  ${text(PAD, 120, 28, 400, COLORS.light, '> whoami')}
  <g filter="url(#glow)">
  ${text(PAD, 250, 62, 700, COLORS.primary, site.name.toUpperCase())}
  </g>
  ${text(PAD, 310, 27, 400, COLORS.primary, site.tagline.toUpperCase())}
  ${text(PAD, 392, 25, 400, COLORS.light, `Founder & CEO, ${site.company.name}`)}
  ${text(PAD, 432, 25, 400, COLORS.light, "Ex-CPTO, Metaphysic.ai (Zemeckis' Here)")}
  ${text(PAD, 540, 25, 400, COLORS.medium, new URL(site.url).host)}
  ${portrait(WIDTH - PAD - 280, 175, 280)}`),
  )
}
