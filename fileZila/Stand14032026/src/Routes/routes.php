<?php


use Slim\App;
use App\Controllers\UserController;
use App\Controllers\TimeEntryController;
use App\Controllers\SignInController;
use App\Controllers\EventController;

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


     // CRUD-Routes for resource 'sign in' -singleEvent

    // Create an event sign in (CREATE)
    $app->post('/api/signin', [SignInController::class, 'createSignIn']);

    // Get all event sign in (READ)
    $app->get('/api/signin', [SignInController::class, 'getAllSignIn']);

    // Get single event sign in (READ) -allUserfuerEvent
    //Testing: wird zum Glück nicht verwendet. Aber die hat nicht funktioniert.
    $app->post('/api/signin/get', [SignInController::class, 'getSignInByIds']);
    
    // Get all event sign in by a user (READ) -allEventsforSingleUser
    //Debug: Methode zu GET und ID im Pfad.
    $app->get('/api/signin/user/{id}', [SignInController::class, 'getAllSignInByUserId']);

    // Get all event sign in by an event (READ) 
    //Debug: Methode zu GET und ID im Pfad.
    $app->get('/api/signin/event/{id}', [SignInController::class, 'getAllSignInByEventId']);

    // Update an event sign in (UPDATE) - updateTimestampLogginvonSingleUser
    $app->put('/api/signin', [SignInController::class, 'updateSignIn']);

    // Delete an event sign in (DELETE) -deleteTimeStampLoggingvonSingleUser
    $app->delete('/api/signin', [SignInController::class, 'deleteSignIn']);


    // CRUD-Routes for resource 'events'

    // Create a events (CREATE)
    $app->post('/api/events', [EventController::class, 'createEvent']);

    // Get all events (READ)
    $app->get('/api/events', [EventController::class, 'getAllEvents']);

    // Get single events (READ)
    $app->get('/api/events/{id}', [EventController::class, 'getEventById']);

    // Update an events (UPDATE)
    $app->put('/api/events/{id}', [EventController::class, 'updateEvent']);

    // Delete an event (DELETE)
    $app->delete('/api/events/{id}', [EventController::class, 'deleteEvent']);

};

