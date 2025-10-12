# TODO: Refactor Score App to Role-Based API-Driven App

## Information Gathered
- Current app uses localStorage for data persistence, no backend integration.
- Existing pages: Login (judge-only), Config (static config), ScoreEntry (hard-coded scoring), Results (local data display).
- Theme context exists for light/dark/event themes.
- Components: AnalyticsPanel, ChartComponent for data visualization.
- Backend is solid per user, focus on frontend refactor.

## Plan
- Install dependencies: @mui/material, @emotion/react, @emotion/styled, @reduxjs/toolkit, react-redux (or use Context for simplicity).
- Create AppContext for global state: events, teams, judges, categories, evaluations.
- Update Login.js: Support roles (admin, judge, viewer) with authentication.
- Refactor App.js: Role-based routing (AdminDashboard, CategoryManager, JudgeInterface, ResultsPage).
- Create AdminDashboard.js: Manage events, teams, judges (CRUD operations with API).
- Create CategoryManager.js: Dynamic category management (add/edit/delete categories).
- Refactor ScoreEntry.js to JudgeInterface.js: Dynamic forms based on categories from API.
- Update Results.js to ResultsPage.js: Fetch normalized scores from API, interactive table with sorting/filtering.
- Add API integration: Fetch/post to endpoints like /api/events, /api/teams, /api/scores.
- Improve UX: Use Material UI for responsive, mobile-friendly design.
- Update components: Make AnalyticsPanel and ChartComponent API-driven.

## Dependent Files to be edited
- package.json: Add new dependencies.
- src/App.js: Update routing and providers.
- src/pages/Login.js: Add role selection and auth.
- src/pages/Config.js: Integrate into AdminDashboard or remove.
- src/pages/ScoreEntry.js: Rename and refactor to JudgeInterface.js.
- src/pages/Results.js: Refactor to ResultsPage.js.
- src/context/ThemeContext.js: Keep as is.
- New files: src/context/AppContext.js, src/pages/AdminDashboard.js, src/pages/CategoryManager.js, src/pages/JudgeInterface.js (renamed), src/pages/ResultsPage.js (updated).

## Followup steps
- Install dependencies and restart dev server.
- Test role-based login and navigation.
- Test API integration (assume backend running).
- Verify responsive design on mobile.
- Update TODO.md with progress.
