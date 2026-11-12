---
title: "SetScout: Never Overpay for LEGO Again"
description: "A LEGO price tracker that watches 90+ retailers all day, alerts you when a set you want drops, and ranks the whole catalogue for people buying to hold."
status: "Live"
platform: "Web"
technologies: ["React", "Node.js", "PostgreSQL", "AI vision"]
link: "https://setscout.app"
linkLabel: "OPEN SETSCOUT"
image: "https://setscout.app/og-image.png"
featured: true
order: 1
---

**In short:** SetScout tracks the price of more than 17,000 LEGO sets across 90+ retailers, checked throughout the day, and tells you when one you care about drops. It is free to start: track five sets without a card.

| | |
|---|---|
| **What it is** | A LEGO price tracker with alerts and an investor screener |
| **Status** | Live at [setscout.app](https://setscout.app) |
| **Platform** | Web |
| **Catalogue** | 17,000+ sets, 90+ retailers |

## Why I built it

I kept overpaying for LEGO. Prices swing a lot between retailers and over time, and retired sets behave more like an asset than a toy, but nothing showed both sides in one place.

## What it does

- **Set the rule once, the deal finds you.** Build an alert in 30 seconds, with a live preview of what it would fire on today. Then forget it: the email arrives when a price crosses your line.
- **See LEGO? Know everything about it.** Snap a photo and SetScout identifies the set, tells you its value, whether the price is good, and how it scores as an investment.
- **The Investor Terminal.** Not tips, a screener: deterministic ranks built from entry price, expected net return, liquidity, catalysts and data quality, each showing its evidence and the counter-evidence.

## Under the hood

A React front end and a Node.js back end on PostgreSQL, with a queue of scrapers that check retailer prices throughout the day, and AI models for identifying sets from photos.
