# Konductor.AI - BYO AI Assistants

# Project Vision

Konductor.AI is a revolutionary SaaS platform that transforms business management through AI-powered teams. Users (Human Konductors) create and interact with specialized AI Minions organized into different teams, all within an immersive pixelart environment inspired by GatherTown and WorkAdventure.

## Core Concept

Unlike traditional text-based SaaS interfaces, Konductor.AI provides a 2D pixelart playground where users navigate through different rooms/departments to interact with AI Minions. Each minion has unique personas, training documents, and tool access (skills/integrations). We will attempt to use CSS and Javascript technique for character movements instead of relying on complex rendering or game engines that might not run well on mobile browsers.

## Key Features

## 🎮 Immersive Interface with Phaser Game Engine
- **Retro Pixelart Design**: Using 'Press Start 2P', 'Jersey 25' Google fonts and open-source assets
- **2D Navigation**: WASD/Arrow key movement like GatherTown, Touchscreen support
- **Mobile & Desktop Compatible**: Responsive design for all devices

# Technical Stack Planned
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Styling**: Pixelart theme with "Press Start 2P" as large Heading font, and "Jersey 25" as body font from Google Fonts
- **Game Assets**: Located in public/assets/* subfolders, including images, sprites, sounds, and other game assets
- **Authentication**: PocketBase with multi-provider support (Google, Facebook, LinkedIn)
- **Database**: PocketBase with SQLite to run on both ARM64 & VPS x86. Set via .env file (schema at pocketbase-schema.json)
- **Hosting**: Netlify for frontend, must pass `npm run build`
- **Backend**: Node-RED as backend server, to handle complex business logic, and integrate with other services.
