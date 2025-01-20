---
title: "LinkedCare EHR and PHR"
description: "(CTPO at Crowdcare) Personal Health Record (PHR) and Electronic Health Record (EHR)"
technologies: ["Python", "TypeScript", "Tailwind"]
link: "https://github.com/yourusername/project1"
image: "/images/linkedcare.png"
featured: true
---

## Overview

As CTO and Head of Product at Crowdcare, I led the development of a Personal Health Record and Electronic Health Record (EHR) solution, initially focused on private healthcare providers in Portugal and later expanded to the US market.

## Key Features

![ProLinkedcare](/images/cembe.png)

- **Scalable micro-services architecture**: Built a scalable architecture with 10s of micro-services communicating trough a resilient queue system.
- **Real-time Mecical decision support system**: Trough a logical inference service combined with a socket based UI we achieved a real-time desision support system that warned about potential heallth risks (like conflict of medications) or advised exam or analysis perscriptions, leaving the doctor free to focus on patient communication and enabling single press treatment selection. 
- **Remote face to face consultations**: Created a real-time video conferencing system that allowed patients to consult with their doctors remotely, integrating different UIs and data analysys in each side, allowing both for the patient to easely digest the information and for the doctor to reduce the data input time by automatically parsing and categorizing the data from the patient interaction.
- **Annonymous medication data processing**: Developed a platform that collected medication prescription, utilization and outcomes into a data lake and provided health intervineants with real-time insights and analytics.

## Technical Details

### Architecture

The system is built on a microservices architecture using:
- Ruby microservices;
- Rails framework from client applications;
- RabbitMQ as a message broker;
- Native iOS and Android clients.

![MyLinkedcare](/images/mylinkedcare.png)