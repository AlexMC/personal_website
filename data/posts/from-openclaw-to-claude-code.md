---
title: 'From OpenClaw to Claude Code: Migrating My AI Assistant Setup to Anthropic'
date: '2026-04-08'
excerpt: >-
  I spent months building a personal AI assistant with OpenClaw. cron jobs, 
  Telegram integration, smart home control, the works. Then Claude Code shipped 
  Channels and I migrated the whole thing in a weekend. Here's how it went.
tags:
  - AI
  - Claude Code
  - Automation
  - Productivity
bsky:
  uri: 'at://did:plc:e5jrggjpsfusibn5ejp6ajte/app.bsky.feed.post/3mixzrwyraq2b'
  author: alexmcpt.bsky.social
---

It started with a networking problem I couldn't solve.

I'd been running [OpenClaw](https://openclaw.ai/) for months as my personal AI assistant. a setup I'd affectionately named "Jasper." It handled everything from morning briefings to overnight creative builds, managed my smart home, checked my homelab health, and pinged me on Telegram when things needed attention. It wasn't trivial to set up, but once it worked, it *worked*. Jasper felt like a team member who happened to never sleep.

Then I had to switch models, and things started falling apart.

---

## The Breaking Point

Here's the thing about OpenClaw: the way it handles memory and session management means token usage is *extremely* high. Every interaction carries a lot of context, and that context adds up fast. Running Anthropic models on OpenClaw was burning through tokens at a rate that wasn't sustainable for a personal setup. So I switched to Kimi 2.5, which was the next best option at a fraction of the cost.

Kimi was decent for everyday tasks. But when I hit a complex networking configuration on my homelab, the kind of multi-site, multi-VLAN setup that requires precise understanding of routing, firewall rules, and DNS resolution, it just wasn't cutting it. It would get close, then confidently suggest configurations that broke things in subtle, hard-to-debug ways. I spent an entire day going in circles.

Out of frustration, I opened Claude Code with Opus 4.6 and described the problem. It fixed it in minutes. Not approximately, not "here's a suggestion". it read my existing config, understood the constraints across all three sites, and produced a working solution. The gap in capability was jarring.

That same week, I read [Federico Viticci's MacStories article](https://www.macstories.net/club/macstories-weekly-issue-505/) about recreating his OpenClaw setup with Claude Code and its new [Channels](https://code.claude.com/docs/en/channels) feature. native Telegram integration. That was the push I needed. If the model was better *and* the tooling was catching up, why was I still running OpenClaw?

So I decided to give it a try. A weekend later, I hadn't looked back.

---

## Why Migrate at All?

Beyond the model quality gap, OpenClaw had a few pain points that had been bugging me:

- **The gateway process was heavy.** OpenClaw's always-on gateway consumed 1.3GB of RAM just sitting there. On a laptop that's running other things, that adds up.
- **MCP bridging was fragile.** I was using `mcporter` to bridge MCP servers to OpenClaw, which added a layer of complexity that broke in subtle ways.
- **Updates were unpredictable.** OpenClaw moved fast, and not every update played nicely with my custom setup.
- **Model quality vs. cost.** OpenClaw's token-heavy architecture forced me off Anthropic models and onto cheaper alternatives. Claude Code's flat-rate Pro subscription means I get Opus and Sonnet without watching a usage meter.

Claude Code was already my daily driver for coding. The idea of consolidating my AI assistant into the same tool I used for development was appealing. fewer moving parts, one ecosystem, and Anthropic's shipping velocity gave me confidence the remaining gaps would close quickly.

---

## The Migration Plan

I didn't want to lose anything. Jasper had accumulated months of configuration: skills, cron jobs, memory files, credential integrations, and a personality baked into a carefully crafted system prompt. So I approached this methodically.

### Step 1: Audit What Exists

Before touching anything, I had Claude Code itself scan my entire OpenClaw setup. the `AGENTS.md`, `USER.md`, `TOOLS.md`, skills directory, cron configurations, and scripts. The goal was a complete inventory with a difficulty rating for each component: easy to migrate, hard, or impossible.

About 75% fell into the "easy" bucket. Skills were mostly prompt files that needed minor tool name updates. Scripts were bash. they didn't care who called them. The remaining 25% was where things got interesting.

### Step 2: Recreate the Workspace

I created an `openclaude` directory (Anthropic, please don't sue me. it's a personal nickname) as the new home base. The structure mirrors what OpenClaw had, mapped to Claude Code's conventions:

```
openclaude/
├── .claude/
│   ├── settings.json      # Hooks and permissions
│   └── skills/            # Migrated skills
├── CLAUDE.md              # The brain. system prompt + instructions
├── cron/
│   ├── plists/            # macOS LaunchAgents
│   └── scripts/           # Cron job scripts
├── credentials/           # Gitignored, obviously
└── memory/                # Persistent context across sessions
```

The `CLAUDE.md` file is where the magic lives. It's the equivalent of OpenClaw's user configuration files, but consolidated into a single markdown file that Claude Code reads automatically. Everything from my communication preferences ("brevity is mandatory") to reactive workflows (send a food photo, get it logged to my fitness tracker) lives here.

### Step 3: Solve the Cron Problem

This was the biggest challenge. OpenClaw had built-in scheduled task support. Claude Code's scheduled tasks auto-expire after three days. not useful for something that needs to run every morning at 7 AM indefinitely.

The workaround? Good old `launchd`. Each cron job became a macOS LaunchAgent that spawns a headless `claude -p` session with a specific prompt, runs the task, and sends the result to Telegram using the Bot API directly.

```bash
# Morning brief. spawns Claude, gathers data, sends via Telegram
RESULT=$(timeout --kill-after 60 1800 claude -p "$PROMPT" \
  --model sonnet \
  --allowedTools "Bash,Read" \
  --output-format json | jq -r '.result // empty')

"$SCRIPT_DIR/telegram-send.sh" "$RESULT"
```

The `telegram-send.sh` script reads the same bot token used by Channels and makes one-shot API calls. It never polls, so it never conflicts with the live Telegram session. Multiple processes can send via the same bot token simultaneously. Telegram doesn't limit that.

I currently run five scheduled jobs:
- **Morning Brief** (7 AM). email summary, homelab health, overnight discovery link
- **Task Review** (2 PM). checks in on my day, suggests what to tackle next
- **MindBridge Daily Summary** (6 PM). aggregates Zulip, Linear, GitHub, and email for my main project
- **End-of-Day Sync** (9 PM). syncs memory and wraps up the day
- **Overnight Discovery** (3:30 AM). the fun one: builds an interactive web page while I sleep

### Step 4: Wire Up the Integrations

This was surprisingly smooth:

- **1Password CLI**. Already worked via service account token. Same `op read` commands, different caller. No changes needed.
- **Home Assistant**. Long-lived access tokens stored in 1Password. Claude Code can control my smart locks, lights, and sensors across three locations via the HA REST API.
- **Himalaya** (email). A local CLI email client that the morning brief and MindBridge summary use to scan my inbox. No OAuth dance, no token refresh headaches.
- **Telegram**. Channels gave me bidirectional messaging. The cron jobs handle outbound-only via Bot API. Both work simultaneously without conflict.

### Step 5: Kill OpenClaw

Once everything was running stable for a few days, I pulled the plug. Backed up the config (`tar -czf`), unloaded the LaunchAgent, `npm uninstall -g openclaw`, and `rm -rf` the data directories. About 800MB freed, plus 1.3GB of RAM back.

---

## What I Gained

**Consolidation.** One tool for coding, assistant tasks, and automation. No more context-switching between Claude Code for development and OpenClaw for everything else.

**Better models.** OpenClaw was model-agnostic, which sounds great until you realize you're managing API keys for multiple providers. Claude Code gives me Opus and Sonnet without thinking about it, and the quality is consistently excellent.

**Native tool access.** File editing, grep, glob, bash. all first-class citizens. No MCP bridging, no adapter layers. When Jasper needs to read a file or run a command, it just does it.

**The Chrome integration.** Claude Code's browser automation tools let Jasper interact with web pages directly. That wasn't something I had before, and it's opened up workflows I hadn't considered.

---

## What I Lost (For Now)

**Telegram topics.** OpenClaw supported Telegram groups with different topics per agent. I had separate "rooms" for different contexts. Channels currently ties to a single conversation per session. I expect Anthropic will add this. it's an obvious feature gap.

**Audio messages.** I can't send voice notes to Jasper yet. I've worked around this by using Whisper for transcription when audio files arrive, but native voice support would be better.

**A persistent daemon.** The Channels integration requires a running Claude Code session in a terminal. It's not a background service. If the terminal closes, Jasper goes offline. I keep a dedicated terminal tab open on my laptop, which works but isn't elegant.

---

## Lessons Learned

**Migration is easier than you think.** The hard part isn't moving files. it's understanding what your setup actually does. Once I had Claude Code audit the existing config, the migration was mostly mechanical.

**`launchd` is underrated.** macOS LaunchAgents are rock-solid for scheduled tasks. They survive reboots, handle logging, and Apple isn't going to deprecate them anytime soon. If you're on a Mac and need cron jobs, skip `crontab` and go straight to `launchd`.

**Always add `--kill-after` to `timeout`.** I learned this the hard way when an overnight discovery process hung for 5+ hours. `timeout` sends SIGTERM by default, which claude may ignore. Adding `--kill-after 60` escalates to SIGKILL. Don't skip this.

**Your AI assistant is only as good as its instructions.** The `CLAUDE.md` file is the single most important piece of the setup. I've iterated on it extensively. communication style, safety guardrails, reactive workflows, integration details. Treat it like code: version it, review it, refine it.

---

## The Setup Today

Jasper runs on my laptop. I message him on Telegram from my phone. whether I'm at home, at the office, or at our place in Cercal do Alentejo. He reads my email, monitors my homelab, manages my calendar context, logs my meals and workouts, builds me a surprise interactive web page every night, and helps me ship code faster.

The entire configuration lives in a single Git repo. No cloud dependencies for the core setup. Secrets in 1Password. Everything reproducible.

If you're running OpenClaw and considering the switch, my honest advice: just do it. The migration took a weekend, and I haven't looked back. Anthropic is shipping features at a pace that makes the remaining gaps shrink by the week. And there's something satisfying about having your AI assistant built into the same tool you use to write code. it's not two separate systems awkwardly bolted together. It's one thing that does both, and it does both well.

---

*The irony of having an AI assistant help write a blog post about that AI assistant is not lost on me. Yes, Jasper helped draft this. No, I'm not sorry about it.*
