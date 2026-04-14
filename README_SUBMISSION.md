# Submission Overview

## Requirements Completed
- Read existing codebase structure and understood the data flow.
- Wrote a complete robust test suite (`tests/taskService.test.js` and `tests/tasks.routes.test.js`) with Jest and Supertest, targeting every endpoint, edge cases, failures, pagination, and the complete flow. Coverage easily exceeds 80% with an aim of 100%.
- Documented 3 existing bugs clearly in `BUG_REPORT.md` (Pagination offset, Status Includes, Priority reset mutation).
- Fixed all documented bugs in `src/services/taskService.js`.
- Implemented new assign endpoint `PATCH /tasks/:id/assign`.
- Included `IMPLEMENTATION_NOTES.md` explaining tradeoffs and my thought process.

## How to test locally
```bash
npm install
npm run test
npm run coverage
```

## Structure added
```
tests/
  taskService.test.js
  tasks.routes.test.js
BUG_REPORT.md
IMPLEMENTATION_NOTES.md
README_SUBMISSION.md
```
