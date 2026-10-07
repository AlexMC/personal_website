---
title: "LinkedCare: Electronic and Personal Health Records, from Lisbon to the US"
description: "(CTPO at LinkedCare) Led product and engineering for a microservices EHR/PHR platform with real-time clinical decision support, and its expansion from Portugal into the US market."
company: "LinkedCare"
role: "Chief Technology & Product Officer"
period: "2013 – 2016"
location: "Lisbon, Portugal"
technologies: ["Ruby", "Rails", "RabbitMQ", "Microservices"]
image: "/images/linkedcare.png"
featured: true
order: 4
---

## Overview

As CTPO (CTO and Head of Product) at LinkedCare, I led the development of a Personal Health Record and Electronic Health Record (EHR) solution, initially focused on private healthcare providers in Portugal and later expanded to the US market.

## Key Features

![ProLinkedcare](/images/cembe.png)

- **Scalable microservices architecture**: Built a scalable architecture with tens of microservices communicating through a resilient queue system.
- **Real-time medical decision support system**: Through a logical inference service combined with a socket-based UI, we achieved a real-time decision support system that warned about potential health risks (like medication conflicts) or advised exam and analysis prescriptions, leaving the doctor free to focus on patient communication and enabling single-press treatment selection.
- **Remote face-to-face consultations**: Created a real-time video conferencing system that allowed patients to consult with their doctors remotely, integrating different UIs and data analysis on each side, allowing the patient to easily digest the information and the doctor to reduce data input time by automatically parsing and categorizing the data from the patient interaction.
- **Anonymous medication data processing**: Developed a platform that collected medication prescription, utilization and outcome data into a data lake and provided health stakeholders with real-time insights and analytics.

## Technical Details

### Architecture

The system is built on a microservices architecture using:
- Ruby microservices;
- Rails framework from client applications;
- RabbitMQ as a message broker;
- Native iOS and Android clients.

![MyLinkedcare](/images/mylinkedcare.png)