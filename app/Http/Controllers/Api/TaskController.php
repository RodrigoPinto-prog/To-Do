<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        /**
         * List tasks for the authenticated user with pagination.
         * Returns a paginated TaskResource collection.
         */
        $tasks = $request->user()->tasks()->latest()->paginate(5);
        return TaskResource::collection($tasks)->response()->setStatusCode(200);
    }

    public function store(StoreTaskRequest $request)
    {
        /**
         * Create a new task for the authenticated user.
         * Validation is handled by StoreTaskRequest.
         */
        $task = $request->user()->tasks()->create($request->validated());
        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function show(Request $request, Task $task)
    {
        /**
         * Return a single task after authorization check.
         */
        $this->authorizeTask($request->user()->id, $task);
        return (new TaskResource($task))->response()->setStatusCode(200);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        /**
         * Update a task after authorization. Validation via UpdateTaskRequest.
         */
        $this->authorizeTask($request->user()->id, $task);
        $task->update($request->validated());
        return (new TaskResource($task))->response()->setStatusCode(200);
    }

    public function destroy(Request $request, Task $task)
    {
        /**
         * Delete a task after authorization.
         */
        $this->authorizeTask($request->user()->id, $task);
        $task->delete();
        return response()->json(['message' => 'Task deleted'], 200);
    }

    protected function authorizeTask($userId, Task $task)
    {
        if ($task->user_id !== $userId) {
            abort(response()->json(['message' => 'Forbidden'], 403));
        }
    }
}
