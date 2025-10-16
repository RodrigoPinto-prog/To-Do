<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import { getUser, logout } from '../lib/api';

const user = ref<any | null>(null);

async function loadUser() {
    const res = await getUser();
    if (res.status === 200) user.value = res.body?.data || res.body;
    else user.value = null;
}

async function doLogout() {
    await logout();
    localStorage.removeItem('api_token');
    user.value = null;
    // navigate to login
    window.location.href = '/login';
}

onMounted(loadUser);
</script>

<template>
    <div>
        <header class="bg-gray-100 p-4 mb-6">
            <nav class="max-w-4xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <Link href="/" class="font-bold">To-Do</Link>
                    <Link href="/tasks" class="text-sm text-gray-700">Tasks</Link>
                </div>
                <div>
                    <div v-if="!user" class="flex items-center space-x-3">
                        <Link href="/login" class="text-sm text-gray-700">Login</Link>
                        <Link href="/register" class="text-sm text-gray-700">Register</Link>
                    </div>
                    <div v-else class="flex items-center space-x-3">
                        <span class="text-sm text-gray-700">{{ user.name }}</span>
                        <button @click="doLogout" class="text-sm text-red-600">Logout</button>
                    </div>
                </div>

            </nav>
        </header>
        <main class="max-w-4xl mx-auto">
            <slot />
        </main>
    </div>
</template>
