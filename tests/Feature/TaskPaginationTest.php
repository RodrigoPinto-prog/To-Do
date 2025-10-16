<?php

use App\Models\Task;
use App\Models\User;

it('returns paginated tasks for authenticated user', function () {
    $user = User::factory()->create();
    // create 30 tasks for this user
    Task::factory()->count(30)->for($user)->create();

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/tasks?page=1')
        ->assertStatus(200)
        ->assertJsonStructure([
            'data',
            'meta' => ['current_page','from','last_page','per_page','to','total'],
        ]);
});
