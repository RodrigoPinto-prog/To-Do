<script setup lang="ts">
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['create']);

const title = ref('');
const description = ref('');

function submit() {
    if (!title.value) return;
    emit('create', { title: title.value, description: description.value });
    title.value = '';
    description.value = '';
}
</script>

<template>
    <div class="mb-4 flex gap-2">
        <input v-model="title" placeholder="Title" class="flex-1 border p-2" />
        <input v-model="description" placeholder="Description" class="flex-1 border p-2" />
        <button @click="submit" class="bg-blue-600 px-4 text-white">Add</button>
    </div>
</template>
