<?php

use App\Models\Task;
use App\Models\User;

it('allows authenticated user to create, update and delete a task', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/tasks', [
            'title' => 'Test task',
            'description' => 'A task',
            'status' => 'pending',
        ])->assertStatus(201)
        ->assertJsonPath('data.title', 'Test task');

    $task = Task::first();

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/tasks/{$task->id}", [
            'title' => 'Updated',
            'description' => 'Updated desc',
        ])->assertStatus(200)
        ->assertJsonPath('data.title', 'Updated');

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/tasks/{$task->id}")
        ->assertStatus(200);
});
