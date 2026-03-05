---
title: Syncing Obsidian Tasks with Apple Reminders... The Hard Way
date: '2026-03-05'
excerpt: >-
  I wanted my Obsidian tasks to show up on my watch. Sounds simple, right? It wasn't. Here's how I built a bidirectional sync between Obsidian and Apple Reminders.
tags:
  - Obsidian
  - Apple
  - Automation
  - Python
---

Obsidian is my second brain. Everything I need to track, plan, or remember lives there. But there's a problem: I don't always have Obsidian open and opening it specially on mobile is not as fast as it should. What I do always have? My phone and my watch. And they all speak one language, Apple Reminders.

I wanted a simple thing: when I add a task in Obsidian with a due date, I want it to show up in Reminders. When I complete it in Reminders, I want Obsidian to reflect that. Sounds simple, right?

Spoiler: it wasn't.

---

## Why Not Just Use Reminders?

The short answer: Reminders is great for quick captures and time-based nudges, but terrible for context. My tasks live inside project notes, daily logs, and meeting notes in Obsidian. They have meaning because of where they are, not just what they say.

The Obsidian [Tasks plugin](https://publish.obsidian.md/tasks/Introduction) gives me everything I need: due dates, recurring schedules, filters, and queries across my vault. But it's only useful when I'm at my desk with Obsidian open. On the go, I need Reminders.

So I built a bridge.

## The Approach

The sync runs as a Python script on a 15-minute schedule via a macOS LaunchAgent. Here's what it does:

1. **Scans the Obsidian vault** for open tasks with `[due:: YYYY-MM-DD]` metadata
2. **Creates corresponding reminders** in a dedicated "Obsidian" list in Apple Reminders
3. **Syncs completions bidirectionally** complete in Reminders → marks done in Obsidian, and vice versa
4. **Syncs tags** `#hashtags` from Obsidian tasks become Reminders tags

The script uses JXA (JavaScript for Automation) to talk to Apple Reminders, since AppleScript is the only reliable way to create and manage reminders programmatically on macOS. For tags, it calls an Apple Shortcut via the `shortcuts` CLI because of course there's no proper API for that.

## The Ugly Parts

Nothing about this was straightforward. Here are the challenges I hit:

**State tracking without polluting Obsidian files.** My first approach embedded reminder IDs as HTML comments in the markdown (`<!-- rid:UUID -->`). Terrible idea. The Obsidian Tasks plugin choked on them, it uses strict regex patterns and anything unexpected in a task line breaks its queries. I switched to an external state file that maps tasks by content hash.

**Name matching is fragile.** When a task moves lines (because you edited the file above it), the state file's line number is wrong. I added fuzzy matching, if the title and due date match but the line shifted, it re-links instead of creating a duplicate.

**Tags are a second-class citizen in Apple's ecosystem.** Reminders tags aren't exposed in AppleScript, JXA, or even EventKit's public API. The only way to set them programmatically is through Apple Shortcuts. So the script writes a JSON file with the tag data and calls `shortcuts run "Tag Reminder"`, which reads the JSON and uses the Shortcuts "Add Tags" action. It works, but it's held together with duct tape.

**Recurring tasks are a trap.** When the Obsidian Tasks plugin handles a recurring task completion, it creates a new line with the next due date. But if you complete the reminder in Apple Reminders, the sync script has no way to trigger that plugin logic, it can only flip the checkbox. The next occurrence would never be created. My solution? Skip recurring tasks entirely. They stay in Obsidian only.

## What I Learned

Building this taught me something I keep relearning: **the gap between "this should be easy" and "this actually works" is where all the interesting engineering lives.** Apple's automation story is a maze of deprecated APIs, undocumented behaviors, and Shortcuts-as-a-workaround. Obsidian's plaintext philosophy is beautiful until you need to store metadata alongside your tasks.

But the result is worth it. I now have tasks syncing reliably between my vault and my wrist. I can ask Siri to show me what's due today, and it pulls from the same source of truth as my Obsidian daily notes. When I check something off on my watch during a walk, it's done in Obsidian by the time I'm back at my desk.

## The Stack

For anyone curious about the technical details:

- **Python 3** for the sync engine
- **JXA** (osascript) for Reminders CRUD
- **Apple Shortcuts** for tag management
- **LaunchAgent** for scheduling (every 15 minutes)
- **State file** (JSON) for tracking sync state without modifying Obsidian files
- **Fuzzy matching** for handling line shifts in markdown files

The code is "straightforward", a couple hundred lines of Python. The complexity isn't in the logic, it's in working around Apple's automation gaps.

## Would I Recommend This?

If you're deep in the Obsidian ecosystem and use Apple devices, absolutely. The peace of mind of having your tasks accessible everywhere, without giving up Obsidian's power, is very nice to have.

If you're expecting a polished, install-and-forget solution, not yet. This is a personal tool built for my workflow. But the approach is solid, and the core idea, bidirectional sync via external state tracking, could be adapted for other integrations.

Sometimes the best tool is the one you build yourself.
