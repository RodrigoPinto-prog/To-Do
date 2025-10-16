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
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->latest()->paginate(15);
        return TaskResource::collection($tasks)->response()->setStatusCode(200);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->validated());
        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorizeTask($request->user()->id, $task);
        return (new TaskResource($task))->response()->setStatusCode(200);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorizeTask($request->user()->id, $task);
        $task->update($request->validated());
        return (new TaskResource($task))->response()->setStatusCode(200);
    }

    public function destroy(Request $request, Task $task)
    {
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
