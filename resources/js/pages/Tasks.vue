<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchTasks, createTask, updateTask, deleteTask, getUser } from '../lib/api';

const tasks = ref([] as any[]);
const title = ref('');
const description = ref('');
const error = ref<string | null>(null);
const editingId = ref<number | null>(null);
const editTitle = ref('');
const editDescription = ref('');
const user = ref<any | null>(null);

async function load() {
    // load tasks only if user is authenticated
    if (!user.value) return;
    const res = await fetchTasks();
    if (res.status === 200) tasks.value = res.body.data || res.body;
    else error.value = 'Unable to fetch tasks';
}

async function add() {
    error.value = null;
    const res = await createTask({ title: title.value, description: description.value, status: 'pending' });
    if (res.status === 201) { title.value = ''; description.value = ''; load(); }
    else error.value = res.body?.message || 'Create failed';
}

async function remove(id:number) {
    await deleteTask(id);
    load();
}

async function onStatusChange(id: number, e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    await updateTask(id, { status: val });
    load();
}

function startEdit(task: any) {
    editingId.value = task.id;
    editTitle.value = task.title;
    editDescription.value = task.description;
}

function cancelEdit() {
    editingId.value = null;
    editTitle.value = '';
    editDescription.value = '';
}

async function saveEdit(id: number) {
    error.value = null;
    const res = await updateTask(id, {
        title: editTitle.value,
        description: editDescription.value
    });
    if (res.status === 200) {
        cancelEdit();
        load();
    } else {
        error.value = res.body?.message || 'Update failed';
    }
}

onMounted(async () => {
    // detect user
    const res = await getUser();
    if (res.status === 200) {
        user.value = res.body?.data || res.body;
    } else {
        user.value = null;
    }
    await load();
});
</script>

<template>
    <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-xl mb-4">Your tasks</h1>

    <!-- Guest hero -->
    <div v-if="!user" class="mb-6 p-6 bg-gray-100 rounded">
        <h2 class="text-2xl font-bold mb-2">Welcome to the To-Do page</h2>
        <p class="mb-3">Log in to access your tasks and start organizing your day.</p>
        <a href="/login" class="inline-block bg-blue-600 text-white px-4 py-2 rounded">Log in</a>
    </div>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>

    <div v-if="user" class="mb-4 flex gap-2">
        <input v-model="title" placeholder="Title" class="flex-1 border p-2" />
        <input v-model="description" placeholder="Description" class="flex-1 border p-2" />
        <button @click="add" class="bg-blue-600 text-white px-4">Add</button>
    </div>

    <ul class="space-y-2">
        <li v-for="t in tasks" :key="t.id" class="p-3 border rounded flex justify-between items-center">
            <div class="flex-1">
                <!-- Normal View -->
                <div v-if="editingId !== t.id">
                    <div class="font-medium">{{ t.title }}</div>
                    <div class="text-sm text-gray-600">{{ t.description }}</div>
                    <div class="text-xs mt-1">Status: {{ t.status }}</div>
                </div>
                <!-- Edit View -->
                <div v-else class="space-y-2">
                    <input
                        v-model="editTitle"
                        placeholder="Title"
                        class="w-full border p-2 rounded"
                    />
                    <input
                        v-model="editDescription"
                        placeholder="Description"
                        class="w-full border p-2 rounded"
                    />
                </div>
            </div>
            <div class="flex items-center gap-2">
                <!-- Debug: editingId = {{ editingId }}, task id = {{ t.id }} -->
                <!-- Normal Mode Buttons -->
                <template v-if="editingId !== t.id">
                    <select :value="t.status" @change="(e) => onStatusChange(t.id, e)" class="border px-2 py-1 rounded">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <button
                        @click="startEdit(t)"
                        class="px-3 py-1 bg-blue-300 text-white rounded hover:bg-blue-700"
                    >
                        Edit
                    </button>
                    <button @click="remove(t.id)" class="px-3 py-1 border text-red-400 rounded hover:bg-red-300">Delete</button>
                </template>
                <!-- Edit Mode Buttons -->
                <template v-else>
                    <button @click="saveEdit(t.id)" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    <button @click="cancelEdit" class="px-3 py-1 border text-gray-600 rounded hover:bg-gray-50">Cancel</button>
                </template>
            </div>
        </li>
    </ul>
    </div>
</template>

<!-- layout is applied via the <AppLayout> wrapper in the template; no default export needed -->
<script lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
export default { layout: AppLayout };
</script>
