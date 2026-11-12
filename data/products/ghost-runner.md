---
title: "Ghost Runner: Race Your Last Run"
description: "An iPhone and Apple Watch app that turns your Apple Health runs into routes, so you can race the ghost of your best time live on your wrist."
status: "TestFlight beta"
platform: "iPhone + Apple Watch"
technologies: ["SwiftUI", "HealthKit", "watchOS", "MapKit"]
link: "https://getghostrunner.com"
linkLabel: "JOIN THE BETA"
image: "https://getghostrunner.com/invitation-assets/landing-social.jpg"
featured: true
order: 2
---

**In short:** Ghost Runner turns the runs already in Apple Health into Routes. Next time you run one, your Apple Watch races you against the ghost of your best time. No account needed to race. It's in beta on TestFlight.

| | |
|---|---|
| **What it is** | Race your previous runs on the same route |
| **Status** | Beta on [TestFlight](https://getghostrunner.com) |
| **Platform** | iPhone with iOS 18, Apple Watch with watchOS 11 |
| **Privacy** | Your Health data stays on your iPhone; fitness and predictions stay off the server |

## What it does

- **Race your last run.** Same streets, same distance, your own time: your Apple Health runs become Routes, and you race the ghost of your best time.
- **Mid-race, on your wrist.** Up to six ghosts, or a course to follow. Leave the iPhone at home.
- **Every run, explained.** Splits by the kilometre, pace on the map, best efforts against your records and time in each heart-rate zone.
- **Are you getting fitter?** Every run as pace at the same heart rate, hill-adjusted, plus records from 1 km to the half marathon.
- **Race past you.** Race how you'd have run this Route on any day in the last 12 months, hills and all.
- **Race your friends.** Send a run as a challenge; friends race it on their own Apple Watch. Challenges share course and times, never heart rate.

## Under the hood

A native SwiftUI app for iPhone and Apple Watch. It reads runs from HealthKit, builds routes on MapKit, and keeps the phone and the Watch in sync with WatchConnectivity.
