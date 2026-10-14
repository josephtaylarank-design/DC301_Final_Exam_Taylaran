# WhistleHub

WhistleHub is a Vue 3 + Vite web app for managing referees and match assignments in a sports league.

## 1. Project Overview

**Problem statement**
League organizers currently track referees and scheduled matches using spreadsheets and chat messages, which leads to double-booked referees, missing contact details, and confusion over who is assigned to the game.

**Functional requirements**
- FR1: The system shall display a landing page with an overview and navigation.
- FR2: The user shall be able to create, view, edit, and delete referees.
- FR3: The user shall be able to create, view, edit, and delete matches.
- FR4: The user shall be able to assign a referee to a match.
- FR5: The system shall prevent assigning the same referee to two matches at the same date and time.
- FR6: The user shall be able to search or filter referees by name or level.
- FR7: Data shall persist after a page refresh.

**Pages**
- `/` – home landing page
- `/referees` – referee CRUD
- `/matches` – match CRUD
- `/assignments` – assignment management

**Data model**
- Referee: `id`, `name`, `email`, `level`, `status`
- Match: `id`, `title`, `venue`, `date`, `time`
- Assignment: `id`, `matchId`, `refereeId`, `role`

## 2. Technical Stack

- Vue 3 with Composition API (`<script setup>`)
- Vite
- Vue Router
- Pinia
- localStorage for persistence

## 3. Project Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## 4. Build

```bash
npm run build
```

## 5. Notes

This project stores all data in the browser using `localStorage`, so no backend or database is required for the exam scenario.
