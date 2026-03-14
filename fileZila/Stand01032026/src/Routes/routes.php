<?php


use Slim\App;
use App\Controllers\UserController;
use App\Controllers\TimeEntryController;

return function (App $app) {

    // CRUD-Routes for resource 'users'

    // Create a user (CREATE)
    $app->post('/api/users', [UserController::class, 'createUser']);

    // Get al users (READ)
    $app->get('/api/users', [UserController::class, 'getAllUsers']);

    // Get single user (READ)
    $app->get('/api/users/{id}', [UserController::class, 'getUserById']);

    // Update a user (UPDATE)
    $app->put('/api/users/{id}', [UserController::class, 'updateUser']);

    // Delete a user (DELETE)
    $app->delete('/api/users/{id}', [UserController::class, 'deleteUser']);
	// Login a user (LOGIN)
	$app->post('/api/users/login', [UserController::class, 'loginUser']);


    // CRUD-Routes for resource 'timeEntries'

    // Create an entry (CREATE)
    $app->post('/api/timeEntry', [TimeEntryController::class, 'createTimeEntry']);

    // Get all entries (READ)
    $app->get('/api/timeEntry', [TimeEntryController::class, 'getAllTimeEntries']);

    // Get single entry (READ)
    //$app->get('/api/timeEntry/{id}', [TimeEntryController::class, 'getTimeEntryById']);
    
    // Get user entries (READ)
    $app->get('/api/timeEntry/{uid}', [TimeEntryController::class, 'getAllTimeEntriesByUserId']);

    // Update an entry (UPDATE)
    $app->put('/api/timeEntry/{id}', [TimeEntryController::class, 'updateTimeEntry']);

    // Delete an entry (DELETE)
    $app->delete('/api/timeEntry/{id}', [TimeEntryController::class, 'deleteTimeEntry']);


};

