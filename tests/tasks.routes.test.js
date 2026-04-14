const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API Routes', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('POST /tasks', () => {
    it('should create a new task successfully', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'My Task', status: 'todo' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('My Task');
      expect(res.body.status).toBe('todo');
      expect(res.body.id).toBeDefined();
    });
    it('should fail if title is missing', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ status: 'todo' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('title is required');
    });
    it('should fail if status is invalid', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'T', status: 'invalid_status' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('status must be one of');
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks (empty initially)', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all tasks correctly', async () => {
      taskService.create({ title: 'Task 1' });
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Task 1');
    });

    it('should filter by status', async () => {
      taskService.create({ title: 'T1', status: 'todo' });
      taskService.create({ title: 'T2', status: 'done' });
      const res = await request(app).get('/tasks?status=todo');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].status).toBe('todo');
    });
    
    it('should handle pagination with exact limit', async () => {
      for(let i=0; i<15; i++) taskService.create({ title: `T${i}` });
      const res = await request(app).get('/tasks?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
      
      const res2 = await request(app).get('/tasks?page=2&limit=10');
      expect(res2.status).toBe(200);
      expect(res2.body.length).toBe(5);
    });

    it('should return empty list when page exceeds items', async () => {
      for(let i=0; i<5; i++) taskService.create({ title: `T${i}` });
      const res = await request(app).get('/tasks?page=2&limit=10');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /tasks/stats', () => {
    it('should retrieve stats correctly', async () => {
      taskService.create({ title: 'T1', status: 'done' });
      const res = await request(app).get('/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body.done).toBe(1);
      expect(res.body.todo).toBe(0);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task successfully', async () => {
      const task = taskService.create({ title: 'Old' });
      const res = await request(app)
        .put(`/tasks/${task.id}`)
        .send({ title: 'New' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New');
    });
    it('should return 400 for invalid update data', async () => {
      const task = taskService.create({ title: 'Old' });
      const res = await request(app)
        .put(`/tasks/${task.id}`)
        .send({ status: 'invalid' });
      expect(res.status).toBe(400);
    });
    it('should return 404 for missing task ID', async () => {
      const res = await request(app)
        .put('/tasks/fake-id')
        .send({ title: 'New' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task successfully', async () => {
      const task = taskService.create({ title: 'To Delete' });
      const res = await request(app).delete(`/tasks/${task.id}`);
      expect(res.status).toBe(204);
    });
    it('should return 404 for invalid ID to delete', async () => {
      const res = await request(app).delete('/tasks/fake-id');
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    it('should mark task as completed without resetting priority', async () => {
      const task = taskService.create({ title: 'Task to Complete', priority: 'high' });
      const res = await request(app).patch(`/tasks/${task.id}/complete`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('done');
      expect(res.body.priority).toBe('high');
      expect(res.body.completedAt).not.toBeNull();
    });
    it('should return 404 for invalid ID', async () => {
      const res = await request(app).patch('/tasks/invalid-id/complete');
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    it('should successfully assign user to task', async () => {
      const task = taskService.create({ title: 'Task to Assign' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: 'Jane Smith' });
      expect(res.status).toBe(200);
      expect(res.body.assignee).toBe('Jane Smith');
    });

    it('should fail with 400 for empty assignee', async () => {
      const task = taskService.create({ title: 'Task' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: '   ' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('must be a non-empty string');
    });
    
    it('should fail with 400 for missing assignee field', async () => {
      const task = taskService.create({ title: 'Task' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should fail with 404 for invalid task ID assignment', async () => {
      const res = await request(app)
        .patch('/tasks/invalid-id/assign')
        .send({ assignee: 'Jane Smith' });
      expect(res.status).toBe(404);
    });
  });
});
