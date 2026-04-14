const taskService = require('../src/services/taskService');

describe('Task Service', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('create', () => {
    it('should create a task with default values', () => {
      const task = taskService.create({ title: 'Test Task' });
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
    });
  });

  describe('getAll', () => {
    it('should return empty array when no tasks exist', () => {
      expect(taskService.getAll()).toEqual([]);
    });

    it('should return all tasks', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      expect(taskService.getAll().length).toBe(2);
    });
  });

  describe('findById', () => {
    it('should return task by id', () => {
      const created = taskService.create({ title: 'Task 1' });
      const found = taskService.findById(created.id);
      expect(found).toEqual(created);
    });

    it('should return undefined if task not found', () => {
      expect(taskService.findById('invalid-id')).toBeUndefined();
    });
  });

  describe('getByStatus', () => {
    it('should return tasks with specific status', () => {
      taskService.create({ title: 'Task 1', status: 'todo' });
      taskService.create({ title: 'Task 2', status: 'done' });
      const todos = taskService.getByStatus('todo');
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Task 1');
    });
    
    it('should handle exact status match', () => {
      taskService.create({ title: 'Task 1', status: 'todo' });
      expect(taskService.getByStatus('tod').length).toBe(0);
    });
  });

  describe('getPaginated', () => {
    it('should paginate tasks properly', () => {
      for(let i=0; i<15; i++) taskService.create({ title: `Task ${i+1}` });
      const page1 = taskService.getPaginated(1, 10);
      expect(page1.length).toBe(10);
      const page2 = taskService.getPaginated(2, 10);
      expect(page2.length).toBe(5);
    });
    it('should fallback to empty array if page is out of bounds', () => {
      for(let i=0; i<5; i++) taskService.create({ title: `Task ${i+1}` });
      const page2 = taskService.getPaginated(2, 10);
      expect(page2.length).toBe(0);
    });
    it('should handle page less than 1 correctly', () => {
      for(let i=0; i<5; i++) taskService.create({ title: `Task ${i+1}` });
      const page0 = taskService.getPaginated(0, 5);
      expect(page0.length).toBe(5);
    });
  });

  describe('getStats', () => {
    it('should return correct counts', () => {
      taskService.create({ title: 'T1', status: 'todo' });
      taskService.create({ title: 'T2', status: 'done' });
      taskService.create({ title: 'T3', status: 'done' });
      const stats = taskService.getStats();
      expect(stats.todo).toBe(1);
      expect(stats.done).toBe(2);
      expect(stats.in_progress).toBe(0);
    });
    it('should return overdue count correctly', () => {
      taskService.create({ title: 'T1', status: 'todo', dueDate: new Date(Date.now() - 1000000).toISOString() }); // overdue
      taskService.create({ title: 'T2', status: 'done', dueDate: new Date(Date.now() - 1000000).toISOString() }); // not overdue because done
      const stats = taskService.getStats();
      expect(stats.overdue).toBe(1);
    });
  });

  describe('update', () => {
    it('should update task properly', () => {
      const task = taskService.create({ title: 'Old Title' });
      const updated = taskService.update(task.id, { title: 'New Title' });
      expect(updated.title).toBe('New Title');
    });
    it('should return null for non-existent task', () => {
      expect(taskService.update('non-existent', { title: 'T' })).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete existing task and return true', () => {
      const task = taskService.create({ title: 'T' });
      expect(taskService.remove(task.id)).toBe(true);
      expect(taskService.getAll().length).toBe(0);
    });
    it('should return false for non-existent task', () => {
      expect(taskService.remove('non-existent')).toBe(false);
    });
  });

  describe('completeTask', () => {
    it('should complete task and not modify priority', () => {
      const task = taskService.create({ title: 'T', priority: 'high', status: 'todo' });
      const completed = taskService.completeTask(task.id);
      expect(completed.status).toBe('done');
      expect(completed.priority).toBe('high');
      expect(completed.completedAt).not.toBeNull();
    });
    it('should return null for non-existent task', () => {
      expect(taskService.completeTask('non-existent')).toBeNull();
    });
  });

  describe('assignTask', () => {
    it('should assign a task to a user', () => {
      const task = taskService.create({ title: 'T' });
      const assigned = taskService.assignTask(task.id, 'John Doe');
      expect(assigned.assignee).toBe('John Doe');
    });
    it('should return null for non-existent task', () => {
      expect(taskService.assignTask('non-existent', 'John Doe')).toBeNull();
    });
  });
});
