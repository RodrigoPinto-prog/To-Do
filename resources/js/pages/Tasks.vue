<script setup lang="ts">
import TaskForm from '@/Components/TaskForm.vue';
import TaskItem from '@/Components/TaskItem.vue';
import { useTasksStore } from '@/stores/tasks';
import { onMounted, ref } from 'vue';
import { createTask, deleteTask, fetchTasks, getUser, updateTask } from '../lib/api';

const store = useTasksStore();
const error = ref<string | null>(null);
const user = ref<any | null>(null);

// Array of page numbers used to render pagination buttons. Built from
// the `meta.last_page` value provided by the backend paginator.
const pages = ref<number[]>([]);

/**
 * Build the `pages` array from the store meta. If `last_page` is missing
 * the pages array becomes empty. This helper is deliberately simple
 * — for large numbers of pages a sliding window would be preferred.
 */
function updatePages() {
    const last = store.meta?.last_page || 0;
    pages.value = Array.from({ length: last }, (_, i) => i + 1);
}

/**
 * Navigate to a given page number.
 * Guard clauses prevent invalid requests and avoid re-fetching the
 * same page. After fetching we rebuild the `pages` array because
 * pagination metadata can change when items are added/removed.
 */
function goto(page: number) {
    if (page < 1 || page === store.page) return;
    store.fetch(page).then(() => updatePages());
}

/**
 * Load the first page of tasks from the server. This is intentionally
 * only performed for authenticated users — guests do not have tasks.
 * Errors are reported via the `error` ref which the template displays.
 */
async function load() {
    // load tasks only if user is authenticated
    if (!user.value) return;
    const res = await fetchTasks();
    if (res.status === 200) store.setTasks(res.body);
    else error.value = 'Unable to fetch tasks';
}

// Note on component responsibilities:
// - TaskForm emits a `create` event which calls createTask and then
//   refreshes the list via `load()`.
// - TaskItem emits `edit`, `delete`, and `status-change` events which
//   call the respective API helpers and then call `load()` to refresh.

onMounted(async () => {
    // detect user; getUser returns 200 when the user is authenticated.
    const res = await getUser();
    if (res.status === 200) {
        // API may wrap user inside { data: user }
        user.value = res.body?.data || res.body;
    } else {
        user.value = null;
    }
    // load user tasks and build pagination controls
    await load();
    updatePages();
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
        <!-- Pagination controls -->
        <div v-if="store.meta && store.meta.last_page" class="mt-4 flex items-center justify-center gap-2">
            <button @click="goto(store.page - 1)" :disabled="store.page <= 1" class="rounded border px-3 py-1">Previous</button>
            <template v-for="p in pages" :key="p">
                <button @click="goto(p)" :class="{ 'font-bold': store.page === p }" class="px-2">{{ p }}</button>
            </template>
            <button @click="goto(store.page + 1)" :disabled="store.page >= store.meta.last_page" class="rounded border px-3 py-1">Next</button>
        </div>
    </div>
</template>

<!-- layout is applied via the <AppLayout> wrapper in the template; no default export needed -->
<script lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
export default { layout: AppLayout };
</script>
