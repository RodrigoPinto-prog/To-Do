<script setup lang="ts">
import { ref } from 'vue';
import { register } from '../lib/api';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

async function submit() {
    error.value = null;
    const res = await register(name.value, email.value, password.value);
    if (res.status === 201 && res.body?.token) {
        localStorage.setItem('api_token', res.body.token);
        window.location.href = '/tasks';
        return;
    }
    error.value = res.body?.message || 'Register failed';
}
</script>

<template>
    <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl mb-4">Register</h1>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
    <div class="mb-2">
        <label class="block text-sm">Name</label>
        <input v-model="name" type="text" class="w-full border p-2" />
    </div>
    <div class="mb-2">
        <label class="block text-sm">Email</label>
        <input v-model="email" type="email" class="w-full border p-2" />
    </div>
    <div class="mb-4">
        <label class="block text-sm">Password</label>
        <input v-model="password" type="password" class="w-full border p-2" />
    </div>
    <button @click="submit" class="bg-green-600 text-white px-4 py-2">Register</button>
    </div>
</template>

<script lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
export default { layout: AppLayout };
</script>
