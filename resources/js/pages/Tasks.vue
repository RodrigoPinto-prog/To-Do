<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchTasks, createTask, updateTask, deleteTask } from '../lib/api';

const tasks = ref([] as any[]);
const title = ref('');
const description = ref('');
const error = ref<string | null>(null);

async function load() {
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



onMounted(load);
</script>

<template>
    <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-xl mb-4">Your tasks</h1>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>

    <div class="mb-4 flex gap-2">
        <input v-model="title" placeholder="Title" class="flex-1 border p-2" />
        <input v-model="description" placeholder="Description" class="flex-1 border p-2" />
        <button @click="add" class="bg-blue-600 text-white px-4">Add</button>
    </div>

    <ul class="space-y-2">
        <li v-for="t in tasks" :key="t.id" class="p-3 border rounded flex justify-between items-center">
            <div>
                <div class="font-medium">{{ t.title }}</div>
                <div class="text-sm text-gray-600">{{ t.description }}</div>
                <div class="text-xs mt-1">Status: {{ t.status }}</div>
            </div>
            <div class="flex items-center gap-2">
                <select :value="t.status" @change="(e) => onStatusChange(t.id, e)" class="border px-2 py-1">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <button @click="remove(t.id)" class="px-3 py-1 border text-red-600">Delete</button>
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
