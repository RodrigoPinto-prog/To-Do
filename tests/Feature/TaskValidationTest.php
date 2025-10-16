<?php

use App\Models\User;

it('validates task creation input', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/tasks', [])->assertStatus(422);
});
