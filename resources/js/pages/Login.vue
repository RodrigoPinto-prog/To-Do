<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { login } from '../lib/api';

const form = useForm({ email: '', password: '' });
const error = ref<string | null>(null);

async function submit() {
    error.value = null;
    const res = await login(form.email, form.password);
    if (res.status === 200 && res.body?.token) {
        localStorage.setItem('api_token', res.body.token);
        window.location.href = '/tasks';
        return;
    }
    error.value = res.body?.message || 'Login failed';
}
</script>

<template>
    <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl mb-4">Login</h1>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
    <div class="mb-2">
        <label class="block text-sm">Email</label>
        <input v-model="form.email" type="email" class="w-full border p-2" />
    </div>
    <div class="mb-4">
        <label class="block text-sm">Password</label>
        <input v-model="form.password" type="password" class="w-full border p-2" />
    </div>
    <button @click="submit" class="bg-blue-600 text-white px-4 py-2">Login</button>
    </div>
</template>

<script lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
export default { layout: AppLayout };
</script>
