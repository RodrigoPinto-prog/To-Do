<?php

it('blocks unauthenticated access to tasks endpoints', function () {
    $this->getJson('/api/tasks')->assertStatus(401);
    $this->postJson('/api/tasks', [])->assertStatus(401);
    $this->putJson('/api/tasks/1', [])->assertStatus(401);
    $this->deleteJson('/api/tasks/1')->assertStatus(401);
});
