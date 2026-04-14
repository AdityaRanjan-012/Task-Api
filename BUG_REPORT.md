# Bug Report

## 1. Pagination Offset Logic Error
- **File**: `src/services/taskService.js`
- **Buggy Line/Function**: `const offset = page * limit;` inside `getPaginated`
- **Why**: The offset calculation multiplies `page` by `limit`. In pagination (assuming page starts from 1), the first page should have an offset of `0`. With `page = 1, limit = 10`, `1 * 10 = 10`, so the first 10 items are skipped on page 1.
- **Expected vs Actual**: Expected `page=1, limit=10` to return items 0-9. Actual returns items 10-19.
- **Resolution**: Fixed by changing offset logic to `const offset = (Math.max(1, page) - 1) * limit;`

## 2. Status Filter using Includes
- **File**: `src/services/taskService.js`
- **Buggy Line/Function**: `const getByStatus = (status) => tasks.filter((t) => t.status.includes(status));`
- **Why**: `includes` checks for substring presence instead of an exact match.
- **Expected vs Actual**: Filtering by `todo` correctly returns `todo`, but if there happened to be an invalid/other status containing the substring `do`, `includes` would incorrectly match it. Or vice-versa.
- **Resolution**: Fixed by changing `includes` to strict equality `t.status === status`.

## 3. Priority Reset on Task Completion
- **File**: `src/services/taskService.js`
- **Buggy Line/Function**: `priority: 'medium'` inside `completeTask`
- **Why**: The `completeTask` function forcefully mutates the priority of any completed task to `medium`.
- **Expected vs Actual**: Completing a 'high' priority task should change its status to 'done' but leave the priority as 'high'. Actual behavior inappropriately changes the priority to 'medium'.
- **Resolution**: Fixed by removing the `priority: 'medium'` override line inside `completeTask`.
