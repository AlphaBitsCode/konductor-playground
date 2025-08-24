# Technical Stack Planned

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Styling**: Pixelart theme with "Press Start 2P" as large Heading font, and "Jersey 25" as body font from Google Fonts
- **Game Assets**: Located in public/assets/* subfolders, including images, sprites, sounds, and other game assets
- **Authentication**: PocketBase with multi-provider support (Google, Facebook, LinkedIn)
- **Database**: PocketBase with SQLite to run on both ARM64 & VPS x86. Set via .env file (schema at pocketbase-schema.json)
- **Hosting**: Netlify for frontend, must pass `npm run build`

# Marketing Website Content

## Teaser Website (Live at beta.konductor.ai)

- **Teaser**: Show a scrolling parallax teaser page with waitlist form at the end, which will trigger the waitlist signup process

# Konductor Master Modules

## Onboarding Module (/welcome)

- Name your Assistant: Tim
- Explain How Konductor.AI Works, user will get a personalised AI at @konductor_ai_bot
- To talk to Tim on this platform, and or connect with Telegram: Say Hi to @konductor_ai_bot (send /start) to begin connecting with Konductor AI Personal Assistant
- Show final page to show connected status, clearly state this idea: Telegram linked @[user_telegram_handle], Tim will assist you via @konductor_ai_bot from now, let's begin

## Admin Module (Konductor Office, Require super user admin access, Responsive Web Interface)

### Office Portal Layout (admin portal /office)

- Use a typical side bar layout with 2-level navigation to different modules. Admin profile icon and logout button at the bottom
- Show a dashboard with overview of the system, including number of users, number of minions, number of documents, number of conversations

### Communication Channels (/channels)

- Allow connecting to Telegram to get user's Telegram handle, and allow system's Concierge bot to be able to assist user via @konductor_ai_bot (if not already connected in the onboarding steps)
- Allow connecting with Gmail inboxes to read/send/draft emails, read and manage calendar events, and send notifications via Google APIs (GCP App)
- Allow connecting with WhatsApp (by scanning QR code, server-hosted session) to read personal and group messages, create groups, list groups
- Allow connecting with Zalo OA/Zalo (by scanning QR code, server-hosted session) to read personal and group messages and send notification
- Allow connecting with Slack workspaces to read/send/draft messages via Slack API (GCP App)

### Message Threads (/messages)

- Show a log of all incoming data from emails, Telegram, Zalo, WhatsApp
- Group by different type of communication channels, e.g. Individual and Group Conversation History for Zalo, WhatsApp
- Allow users to mark conversations or senders to ignore, to filter out noise
- Allow user to group emails and email threads into Topics

### Knowledge Library (/library)

- A front-end interface to upload, manage, and search knowledge documents similar to Google Notebook LM
- Show document metadata, including as title, last fetched date, original friendly file size, number of tokens consumed in vector database (fetched from database)
- Ability to add YouTube video links
- Integration with Google Drive to allow user to upload documents from their Google Drive
- Integration with Google Docs, Google Sheets to allow user to select which documents to import and monitor, similar to NotebookLM
- Make it look like a table, with a search bar, a list of documents, and a preview of each document; clearly categories between different type of source
- Ability to set auto-refresh interval/schedule for each of the online sources, e.g. Manual (click to refresh), hourly, daily, weekly on custom days, monthly

### Task Lists and Reminders (/tasks)

- Simple built-in Task Lists to store the requests and tasks to be done, instructed by user from various platforms
- Allow users to set reminders for tasks, e.g. "Remind me to buy groceries on Friday", "Remind me to call John at 10 AM"
- Allow users to set due dates for tasks, e.g. "Finish project by the end of the month", "Submit report by 2023-12-31"
- Allow users to set priority for tasks, e.g. "High", "Medium", "Low"
- Allow users to set tags for tasks, e.g. "Work", "Personal", "Urgent"

### Calendar View (/calendar)

- Typical Calendar view to show user's schedule, with events from different sources
- Allow users to add events to the calendar, e.g. "Meeting with John at 10 AM", "Buy groceries on Friday"
- Allow users to set reminders for events, e.g. "Remind me to buy groceries on Friday", "Remind me to call John at 10 AM"
- Allow users to set due dates for events, e.g. "Finish project by the end of the month", "Submit report by 2023-12-31"

### Minion Workshop (Create and Manage Minions /workshop)

- **Workshop**: List the minions in a horizontal game-like player selection layout, with their names, titles, short bio below
- **Craft Minions**: Users can create their own AI Minions, with different capabilities and personalities
  - **name**: Users can set the name of the minions
  - **title**: Users can set the title of the minions, such as "Assistant", "Writer", "Comedian" (dropdown menu with custom text option)
  - **persona**: Users can set the personality of their AI Minions (textarea with provided Templates, such as being a helpful assistant, a creative writer, or a funny comedian)
  - **back_story**: Users can set the backstory of their AI Minions (textarea with provided Templates)
  - **meta**: JSON field, for other custom properties in the future
  - **document_access**: Array of documents from Library this AI Minions can use as context (default to All document)

# Playground Module (/town using Phaser.js 3 Game Engine)

- **Game Play**: The main game play area, where users can interact with AI Minions, partially implemented with 2D navigation, WASD/Arrow key movement like GatherTown, Touchscreen support, and responsive design for all devices
- **Minion Interaction**: Users can interact with AI Minions, such as speaking, moving, and using their capabilities, responses to be handled by the backend and LLM API requests
