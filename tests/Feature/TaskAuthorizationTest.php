<?php

use App\Models\Task;
use App\Models\User;

it('prevents users from modifying others tasks', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $task = Task::factory()->for($owner)->create();

    $this->actingAs($other, 'sanctum')
        ->putJson("/api/tasks/{$task->id}", ['title' => 'x'])
        ->assertStatus(403);

    $this->actingAs($other, 'sanctum')
        ->deleteJson("/api/tasks/{$task->id}")
        ->assertStatus(403);
});
