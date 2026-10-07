---
title: "Streetbees: Scaling Engineering Through a $12M Series A"
description: "(VP of Engineering at Streetbees) Built and scaled the engineering team behind a consumer-insights platform used by Unilever, PepsiCo and Coca-Cola, from seed to an Atomico-led Series A."
company: "Streetbees"
role: "Technical Lead, then VP of Engineering"
period: "2016 – 2018"
location: "London, UK"
technologies: ["Ruby on Rails", "iOS & Android", "Machine Learning", "Hiring"]
link: ""
featured: true
order: 2
---

**In short:** I joined Streetbees in March 2016 as Technical Lead and became VP of Engineering in July 2017. Over those two years the company grew from about 20 to about 75 people across London and Lisbon, raised a $5.1M seed and a $12M Series A led by Atomico, and its community of paid smartphone contributors passed one million people in more than 150 countries. My job was to build the engineering team and the platform that made that growth possible.

| | |
|---|---|
| **Company** | Streetbees, a London consumer-insights startup |
| **My role** | Technical Lead (2016–2017), VP of Engineering (2017–2018) |
| **Company size** | ~20 people (mid-2016) → ~75 people (March 2018) |
| **Funding while I was there** | $5.1M seed (BGF Ventures), $12M Series A (Atomico) |
| **Clients** | Unilever, PepsiCo, Coca-Cola, L'Oréal, Dyson, Vodafone |

## What was Streetbees?

Streetbees let global brands ask real people questions and get answers within hours instead of weeks. A brand posted a question; the Streetbees app sent it to a community of paid smartphone users, the "bees"; the bees answered with photos, videos and chat-style conversations; and the results streamed into a client dashboard.

It started as an app that paid people to photograph supermarket shelves. By 2016 it had moved to what it called *conversational research*: a messaging-style interface where bees answered open questions in the moment, and machine learning turned those answers into insight.

## What was the engineering challenge?

The product looked like a simple app. Underneath, it had to solve problems that most startups of 20 people never face:

- **Paying people in more than 80 countries within 24 hours.** Bees were paid per task, in local currencies, often in markets with weak banking infrastructure. Late or failed payouts destroyed trust in the community overnight.
- **Reaching people where SMS delivery is unreliable.** Verification and notifications had to work worldwide, across carriers that fail in different ways.
- **Handling photo and video at scale.** Uploads had to run in the background on cheap phones and poor connections, and the submitted images had to be checked and classified.
- **Turning unstructured answers into insight.** Brands didn't buy raw photos and chat logs; they bought patterns. That meant natural language processing and clustering on top of the research data.

And all of this had to ship weekly, with a team that was growing fast.

## What did I do?

**1. Built a hiring process that selected for builders.** In my first month I wrote the role descriptions and the take-home challenges for our lead Android and iOS hires. They were small, real apps rather than puzzles, so candidates showed how they would actually work. Hiring was the constraint on everything else, so I treated it as a product.

**2. Gave engineering a public identity.** I set up the Streetbees engineering site and edited our engineering publication on Medium. We open-sourced the tools we built: `sms_broker` (SMS delivery that fails over between Nexmo, Twilio and OpenMarket), `lost_in_translations` (internationalisation) and `form_stalker` (a FormStack API client). For a startup competing with London's big tech employers for engineers, being visibly good at engineering was a recruiting advantage.

**3. Built a second engineering hub in Lisbon.** London talent was scarce and expensive. A Lisbon team gave us strong engineers, overlapping time zones and room to grow. By the Series A, Streetbees described itself as a London and Lisbon company.

**4. Kept a weekly release cadence while the team grew.** Developers owned the quality of their own work instead of handing it to a separate QA stage. That kept releases small and frequent, which mattered for a two-sided product where both clients and bees noticed every change.

**5. Laid the ground for machine learning.** We moved from collecting answers to analysing them: natural language processing on open answers and clustering of consumer behaviour, which later became a core part of the Streetbees pitch.

## What were the results?

- **Growth.** The company grew from about 20 people in mid-2016 to about 75 in March 2018, with engineering teams in London and Lisbon.
- **Funding.** A $5.1M seed led by BGF Ventures (announced March 2017), then a $12M Series A led by Atomico with LocalGlobe, Octopus Ventures and BGF (closed around the end of 2017, announced March 2018). Investors named machine learning, data science and US expansion as the reasons to invest.
- **Scale.** More than one million bees in more than 150 countries by March 2018, working for clients including Unilever, PepsiCo, Coca-Cola, L'Oréal, Dyson and Vodafone.
- **Recognition.** In February 2018 CB Insights listed Streetbees among nine early-stage enterprise AI startups to watch.

## What did I learn?

**Hiring is the product before the product exists.** At 20 people, every engineer you hire changes the culture and the architecture. Time spent on the hiring process paid back more than any technical decision I made.

**Infrastructure is the trust layer of a marketplace.** In a two-sided product, a payout that arrives a day late is not a bug; it's a reason for someone to leave. The unglamorous systems (payments, delivery, uploads) carried more business risk than the features clients saw.

**Investors buy the roadmap your platform makes believable.** The Series A was raised on machine learning and global scale. Those claims were credible because the platform underneath already worked across 150 countries.

---

*Building a team or a platform through a funding round? [Work with me](/work-with-me).*
