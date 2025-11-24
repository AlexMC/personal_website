---
title: "/self-hosting"
slug: "self-hosting"
description: "Services and tools I self-host"
updatedAt: '2025-11-24'
order: 10
---

# Self-Hosting

## What I Self-Host

This is done as a hobby, to learn, but also because I like tinkering with hardware and software. As a result, the only optimisation I do is maximising my fun while putting this stuff together.

### Infrastructure

Currently comprised of **3 distinct locations**, in each I have a server.
The locations are interconnected by a **tailscale network layer**.

#### Location 1 Server:
- Case: Fractal Design Node 304 BlacK
- Storage:
    - 2x Crucial MX500 - 2,5",  1TB Sata SSD
    - 2x Seagate Exos X18 - Sata HDD - 16TB
- Ram: Crucial DDR4 3200MHz 32GB (2x16) (small format)
- Motherboard and CPU:
    - [Celeron N5105 ITX](https://pt.aliexpress.com/item/1005004752259038.html?gatewayAdapt=glo2bra)
        - 4 Cores, 4 threads
	    - Low power consumption
		- 4x 2.5Gbps LAN
		- 6 Sata ports

#### Location 2 Server:
- Beelink EQ 12
    - N100 cpu
    - 16 GB DDR5
    - 500 GB SSD
    - Extra external storage:
        -  2x 8TB Western Digital HDD

#### Location 3 Server:
- ZimaCube Pro
    - 12th Gen Intel Core i5 1235U (10-cores 4.4GHz)
    - 16 GB DDR5
    - 256 GB SSD
    - Storage:
        -  2x 16TB Western Digital HDD
        - 5TB Seagate HDD


### Services

#### Server 1:

- **[Proxmox VE](https://proxmox.com/en/products/proxmox-virtual-environment/overview)** 
  - **[VM] [TrueNAS](https://www.truenas.com/truenas-community-edition/):**
  - **[VM] [Portainer](https://www.portainer.io/)**
    - **[Docker] [Romm](https://romm.app/):** My retrogame collection.
    - **[Docker] [Immich](https://immich.app/):** All my photos on my own storage.
    - **[Docker] [Watchtower](https://github.com/containrrr/watchtower):** Keeping my containers up to date.
    - **[Docker] [Mealie](https://mealie.io/) (testing):** Figuring out if I will actually use it.
    - **[Docker] [Syncthing](https://syncthing.net/):** Mostly used for syncing save files between my gaming devices.
    - **[Docker] [Glances](https://github.com/nicolargo/glances) (testing)**
    - **[Docker] [Homebox](https://homebox.software/en/) (testing):** Just discovered this as an inventory management.
  - **[VM] [Home Assistant OS](https://www.home-assistant.io/)** 
  - **[LXC] [Jellyfin](https://jellyfin.org/)**
  - **[LXC] [adGuard](https://adguard.com/en/welcome.html)**
  - **[LXC] [Traefik](https://traefik.io/traefik)**
  - **[LXC] [Uptime Kuma](https://uptimekuma.org/)**
  - **[LXC] [Ntfy](https://ntfy.sh/)**
  - **[LXC] [Proxmox Backup Server](https://www.proxmox.com/en/products/proxmox-backup-server/overview)**
  - **[LXC] [Homepage](https://gethomepage.dev/):** Just a simple way to keep all my hosted services accessible from one place.
  - **[LXC] [Calibre web](https://github.com/janeczku/calibre-web):** Keeping the digital books I own accessible to all family members.
  - **[LXC] [Archivebox](https://archivebox.io/) (testing)**
  - **[LXC] [Pulse](https://github.com/rcourtman/Pulse):** Just discovered, amazing way to keep tabs on all the proxmox and docker instances resource consumption.
  
#### Server 2

- **[Proxmox VE](https://proxmox.com/en/products/proxmox-virtual-environment/overview)** 
  - **[LXC] [Scrypted](https://www.scrypted.app/):** A great way to manage my security camera footage, works great with Home Assistant.
  - **[VM] [Home Assistant OS](https://www.home-assistant.io/)**
  
#### Server 3

- **[Proxmox VE](https://proxmox.com/en/products/proxmox-virtual-environment/overview)** 
  - **[LXC] [Scrypted](https://www.scrypted.app/)**
  - **[VM] [Home Assistant OS](https://www.home-assistant.io/)**
  - **[VM] [OpenMedaVault](https://www.openmediavault.org/)**

### Backup strategy

1. My macbook backs up daily to my TrueNAS
2. I use TrueNAS to store all files I want to keep for the long term (like photos, documents, ...)
3. I use TrueNAS to rSync all the backups to Server 3 OMV (most of them daily)
4. I use PBS to backup all VMs and LXC containers to Server 3 OMV (daily)

Both TrueNAS and OMV are on top of a [ZFS](https://openzfs.org/) storage pool in a mirrored configuration for redundancy and performance.
