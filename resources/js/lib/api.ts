/**
 * Retrieve the stored API token from localStorage.
 * The frontend stores a Sanctum personal access token here after login.
 * Returns null when user is not authenticated.
 */
export function getToken(): string | null {
    return localStorage.getItem('api_token');
}

/**
 * Build a full API URL for a given API path.
 * The API is hosted under the same origin at the `/api` prefix.
 * Example: apiUrl('/tasks') -> https://localhost/api/tasks
 */
function apiUrl(path: string) {
    // API served from same origin under /api
    return `${window.location.origin}/api${path}`;
}

/**
 * Lightweight wrapper around fetch to call the Laravel API.
 * - Attaches Accept and Content-Type headers when needed
 * - Attaches Authorization: Bearer <token> when a token is present
 * - Parses JSON responses and returns an object with { status, body }
 *
 * Note: this intentionally returns raw API status codes so callers can
 * decide how to handle 401/403/422, etc.
 */
export async function apiFetch(method: string, path: string, body?: any) {
    const token = getToken();
    const headers: Record<string,string> = {
        'Accept': 'application/json',
    };
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(apiUrl(path), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    try {
        return { status: res.status, body: text ? JSON.parse(text) : null };
    } catch {
        // If response is not valid JSON, return the raw text body.
        return { status: res.status, body: text };
    }
}

export async function login(email: string, password: string) {
    return apiFetch('POST', '/login', { email, password });
}

export async function register(name: string, email: string, password: string) {
    return apiFetch('POST', '/register', { name, email, password });
}

export async function logout() {
    return apiFetch('POST', '/logout');
}

export async function getUser() {
    return apiFetch('GET', '/user');
}

export async function fetchTasks() {
    return apiFetch('GET', '/tasks');
}
/**
 * Fetch tasks with optional page parameter.
 * Returns the same paginated structure produced by Laravel's paginator.
 */
export async function fetchTasksPage(page?: number) {
    const path = page ? `/tasks?page=${page}` : '/tasks';
    return apiFetch('GET', path);
}

export async function createTask(data: any) {
    return apiFetch('POST', '/tasks', data);
}

export async function updateTask(id: number, data: any) {
    return apiFetch('PUT', `/tasks/${id}`, data);
}

export async function deleteTask(id: number) {
    return apiFetch('DELETE', `/tasks/${id}`);
}
