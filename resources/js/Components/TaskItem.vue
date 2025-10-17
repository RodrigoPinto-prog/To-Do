<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{ task: any }>();
const emit = defineEmits(['edit', 'delete', 'status-change']);

const editing = ref(false);
const title = ref(props.task.title);
const description = ref(props.task.description);

function startEdit() {
    editing.value = true;
}
function cancel() {
    editing.value = false;
    title.value = props.task.title;
    description.value = props.task.description;
}
function save() {
    emit('edit', { id: props.task.id, title: title.value, description: description.value });
    editing.value = false;
}
function remove() {
    emit('delete', props.task.id);
}
function statusChange(e: Event) {
    emit('status-change', { id: props.task.id, status: (e.target as HTMLSelectElement).value });
}
</script>

<template>
    <li class="flex items-center justify-between rounded border p-3">
        <div class="flex-1">
            <div v-if="!editing">
                <div class="font-medium">{{ task.title }}</div>
                <div class="text-sm text-gray-600">{{ task.description }}</div>
                <div class="mt-1 text-xs">Status: {{ task.status }}</div>
            </div>
            <div v-else class="space-y-2">
                <input v-model="title" class="w-full rounded border p-2" />
                <input v-model="description" class="w-full rounded border p-2" />
            </div>
        </div>
        <div class="flex items-center gap-2">
            <template v-if="!editing">
                <select :value="task.status" @change="statusChange" class="rounded border px-2 py-1">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <button @click="startEdit" class="rounded border px-3 py-1 text-blue-700 hover:bg-blue-50">Edit</button>
                <button @click="remove" class="rounded border px-3 py-1 text-red-700 hover:bg-red-50">Delete</button>
            </template>
            <template v-else>
                <button @click="save" class="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700">Save</button>
                <button @click="cancel" class="rounded border px-3 py-1 text-gray-600 hover:bg-gray-50">Cancel</button>
            </template>
        </div>
    </li>
</template>
