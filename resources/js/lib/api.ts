export function getToken(): string | null {
    return localStorage.getItem('api_token');
}

function apiUrl(path: string) {
    // API served from same origin under /api
    return `${window.location.origin}/api${path}`;
}

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
    } catch (e) {
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

export async function createTask(data: any) {
    return apiFetch('POST', '/tasks', data);
}

export async function updateTask(id: number, data: any) {
    return apiFetch('PUT', `/tasks/${id}`, data);
}

export async function deleteTask(id: number) {
    return apiFetch('DELETE', `/tasks/${id}`);
}
