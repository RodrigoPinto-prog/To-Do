<script setup lang="ts">
import TaskForm from '@/Components/TaskForm.vue';
import TaskItem from '@/Components/TaskItem.vue';
import { useTasksStore } from '@/stores/tasks';
import { onMounted, ref } from 'vue';
import { createTask, deleteTask, fetchTasks, getUser, updateTask } from '../lib/api';

const store = useTasksStore();
const error = ref<string | null>(null);
const user = ref<any | null>(null);

async function load() {
    // load tasks only if user is authenticated
    if (!user.value) return;
    const res = await fetchTasks();
    if (res.status === 200) store.setTasks(res.body);
    else error.value = 'Unable to fetch tasks';
}

// The low-level create/update/delete actions are handled inline by the
// TaskForm and TaskItem components and call the API directly. We keep
// `load()` to refresh state from server.

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
    <div class="mx-auto max-w-3xl p-6">
        <h1 class="mb-4 text-xl">Your tasks</h1>

        <!-- Guest hero -->
        <div v-if="!user" class="mb-6 rounded bg-gray-100 p-6">
            <h2 class="mb-2 text-2xl font-bold">Welcome to the To-Do page</h2>
            <p class="mb-3">Log in to access your tasks and start organizing your day.</p>
            <div class="flex gap-2">
                <a href="/login" class="inline-block rounded bg-blue-600 px-4 py-2 text-white">Log in</a>
                <a href="/register" class="inline-block rounded bg-green-600 px-4 py-2 text-white">Register</a>
            </div>
        </div>
        <div v-if="error" class="mb-2 text-red-600">{{ error }}</div>

        <!-- Creation form component (shown only to authenticated users) -->
        <TaskForm
            v-if="user"
            @create="
                async (payload) => {
                    error = null;
                    const res = await createTask({ ...payload, status: 'pending' });
                    if (res.status === 201) load();
                    else error = res.body?.message || 'Create failed';
                }
            "
        />

        <ul class="space-y-2">
            <TaskItem
                v-for="t in store.items"
                :key="t.id"
                :task="t"
                @edit="
                    async (payload) => {
                        error = null;
                        const res = await updateTask(payload.id, payload);
                        if (res.status === 200) load();
                        else error = res.body?.message || 'Update failed';
                    }
                "
                @delete="
                    async (id) => {
                        await deleteTask(id);
                        load();
                    }
                "
                @status-change="
                    async (p) => {
                        await updateTask(p.id, { status: p.status });
                        load();
                    }
                "
            />
        </ul>
    </div>
</template>

<!-- layout is applied via the <AppLayout> wrapper in the template; no default export needed -->
<script lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
export default { layout: AppLayout };
</script>
