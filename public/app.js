const API_URL = '/tasks';

// State
let tasks = [];
let currentFilter = 'all';
let stats = { todo: 0, in_progress: 0, done: 0 };
let activeAssignTaskId = null;

// DOM Elements
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const statsContainer = document.getElementById('stats-container');
const filterBtns = document.querySelectorAll('.filter-btn');

const assignModal = document.getElementById('assign-modal');
const assigneeInput = document.getElementById('assignee-name');
const confirmAssignBtn = document.getElementById('confirm-assign');
const cancelAssignBtn = document.getElementById('cancel-assign');

// Init
async function init() {
    await fetchTasks();
    await fetchStats();
    setupListeners();
}

// API Calls
async function fetchTasks() {
    try {
        let url = API_URL;
        if (currentFilter !== 'all') url += `?status=${currentFilter}`;
        
        const res = await fetch(url);
        tasks = await res.json();
        renderTasks();
    } catch (e) {
        console.error('Error fetching tasks', e);
        taskList.innerHTML = '<div class="loading" style="color:var(--danger)">Failed to load tasks.</div>';
    }
}

async function fetchStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        stats = await res.json();
        renderStats();
    } catch (e) {
        console.error('Error fetching stats', e);
    }
}

async function createTask(title) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, status: 'todo' })
        });
        await reloadData();
    } catch (e) {
        alert('Failed to create task');
    }
}

async function completeTask(id) {
    try {
        await fetch(`${API_URL}/${id}/complete`, { method: 'PATCH' });
        await reloadData();
    } catch (e) {
        alert('Failed to complete task');
    }
}

async function assignTask(id, assignee) {
    try {
        await fetch(`${API_URL}/${id}/assign`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignee })
        });
        closeModal();
        await reloadData();
    } catch (e) {
        alert('Failed to assign task');
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await reloadData();
    } catch (e) {
        alert('Failed to delete task');
    }
}

async function reloadData() {
    await fetchTasks();
    await fetchStats();
}

// Rendering
function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="loading">No tasks found. Time to relax! 🍹</div>';
        return;
    }

    taskList.innerHTML = tasks.map(t => {
        const isDone = t.status === 'done';
        const assigneeHtml = t.assignee ? `<span class="assignee-badge">👤 ${escapeHtml(t.assignee)}</span>` : '';
        const priorityHtml = `<span>${t.priority} priority</span>`;
        
        return `
        <li class="task-item status-${t.status}">
            <div class="task-info">
                <span class="task-title">${escapeHtml(t.title)}</span>
                <div class="task-meta">
                    ${assigneeHtml}
                    ${priorityHtml}
                </div>
            </div>
            <div class="task-actions">
                <button class="icon-btn assign" onclick="openAssignModal('${t.id}')" title="Assign">👥</button>
                ${!isDone ? `<button class="icon-btn complete" onclick="completeTask('${t.id}')" title="Complete">✓</button>` : ''}
                <button class="icon-btn delete" onclick="deleteTask('${t.id}')" title="Delete">✕</button>
            </div>
        </li>
        `;
    }).join('');
}

function renderStats() {
    statsContainer.innerHTML = `
        <span class="stat-badge todo">${stats.todo || 0} To Do</span>
        <span class="stat-badge in-progress">${stats.in_progress || 0} In Progress</span>
        <span class="stat-badge done">${stats.done || 0} Done</span>
    `;
}

// Event Listeners
function setupListeners() {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskTitleInput.value.trim();
        if(title) {
            createTask(title);
            taskTitleInput.value = '';
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            fetchTasks(); // Fetch tasks filtered from backend
        });
    });

    cancelAssignBtn.addEventListener('click', closeModal);
    confirmAssignBtn.addEventListener('click', () => {
        const name = assigneeInput.value.trim();
        if(name && activeAssignTaskId) {
            assignTask(activeAssignTaskId, name);
        }
    });
}

// Ensure functions are in global scope for inline onclicks
window.openAssignModal = function(id) {
    activeAssignTaskId = id;
    assigneeInput.value = '';
    assignModal.classList.add('visible');
    assigneeInput.focus();
}

window.closeModal = function() {
    assignModal.classList.remove('visible');
    activeAssignTaskId = null;
}

window.completeTask = completeTask;
window.deleteTask = deleteTask;

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Bootstrap
init();
