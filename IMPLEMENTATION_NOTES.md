# Implementation Notes

Found multiple logic issues through test-first debugging, especially pagination and status filtering.

Fixed pagination because it directly impacts API correctness and user-facing behavior. Also took the liberty to fix the status filter and the erroneous priority reset bug within `completeTask`.

### Design Decisions & validation choices
- **Test-first Approach**: Started by outlining test scenarios focusing on happy paths, validations, empty responses, and edge cases (especially pagination bounds).
- **Validation**: Added a new validation function `validateAssignTask` to maintain the existing validation structure in `src/utils/validators.js`. It explicitly checks for type and empty string trimmings.
- **New Feature (`PATCH /tasks/:id/assign`)**: Implemented within the existing RESTful standards of the API, returning a 404 if the task is missing and returning the updated task data otherwise. Validations appropriately throw a 400 Bad Request error if missing assigning.

### Tradeoffs
- A tradeoff was made to store data in an in-memory array (`tasks = []`). This simplifies setup and assignment checks but means that state is not persistent or safe for multi-threaded/cluster deployments. For scaling, a real database (like PostgreSQL or MongoDB) should be integrated.

### What should be tested next
- Load testing for high concurrency, specifically around concurrent updates to the same task.
- Authentication/Authorization rules (e.g., ensuring a user can only assign tasks they own or have permission to modify).
- Integration tests using a persistent database in a staging environment.
