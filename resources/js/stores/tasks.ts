import { defineStore } from 'pinia';

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        items: [] as any[],
        meta: {} as any,
    }),
    actions: {
        setTasks(payload: any) {
            this.items = payload.data || payload;
            this.meta = payload.meta || {};
        },
    },
});
