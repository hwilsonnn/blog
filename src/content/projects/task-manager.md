---
title: "Full-Stack Task Manager"
date: "2023-06-20"
tags: ["node.js", "react", "postgresql", "fullstack"]
excerpt: "A production-grade task manager with teams, projects, and real-time updates."
github: "https://github.com/yourname/task-manager"
demo: ""
---

# Full-Stack Task Manager

A full-stack task management app inspired by Linear and Notion.

## Tech Stack

### Frontend
- React + TypeScript
- Zustand for state management
- Tailwind CSS

### Backend
- Node.js + Express
- PostgreSQL with Prisma ORM
- JWT authentication
- WebSockets for real-time updates

## Features

- 👥 Team workspaces with role-based access
- 📋 Kanban and list views
- 🔔 Real-time updates via WebSockets
- 🔗 Task dependencies and subtasks
- 📈 Progress tracking and reports

## Architecture

I used a clean architecture approach with domain/application/infrastructure layers, which made testing significantly easier.
