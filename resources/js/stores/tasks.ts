import { defineStore } from 'pinia';
import { fetchTasksPage, createTask, updateTask, deleteTask } from '../lib/api';

/**
 * Pinia store that centralizes task state and server interactions.
 *
 * State:
 * - items: array of task records for the current page
 * - meta: pagination metadata returned by Laravel (current_page, last_page, total, etc.)
 * - page: currently selected page number
 * - loading: boolean used by UI to indicate an ongoing fetch
 *
 * Actions intentionally return the API response object so callers can
 * handle status codes (for example 401/403/422) themselves.
 */
export const useTasksStore = defineStore('tasks', {
    state: () => ({
        // Tasks for the current page
        items: [] as any[],
        // Pagination metadata coming from Laravel's paginator
        meta: {} as any,
        // Current page number
        page: 1,
        // Loading flag for spinner/disabled states
        loading: false,
    }),
    actions: {
        /**
         * Replace the store items and meta with server data.
         * Accepts either a plain array or a paginated payload ({ data, meta }).
         */
        setTasks(payload: any) {
            this.items = payload.data || payload;
            this.meta = payload.meta || {};
        },

        /**
         * Fetch a specific page from the API and update state.
         * - Sets `loading` while the request is in-flight.
         * - On 200 replaces items/meta and updates `page`.
         * - Returns the raw API response so callers can inspect status/body.
         */
        async fetch(page = 1) {
            this.loading = true;
            try {
                const res = await fetchTasksPage(page);
                if (res.status === 200) {
                    this.page = page;
                    this.setTasks(res.body);
                }
                return res;
            } finally {
                this.loading = false;
            }
        },

        // Wrapper around createTask API helper. Returns API response. Same thing for update/delete.
        async create(payload: any) {
            return createTask(payload);
        },

        async update(id: number, payload: any) {
            return updateTask(id, payload);
        },

        async remove(id: number) {
            return deleteTask(id);
        },
    },
});
