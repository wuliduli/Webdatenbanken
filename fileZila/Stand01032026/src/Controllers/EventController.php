<?php

namespace App\Controllers;

use JWTHandler;
require_once 'JWTHandler.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Event;

class EventController
{
    public function getAllEvents(Request $request, Response $response): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');

        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $events = Event::getAll();
                $response->getBody()->write(json_encode($events));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            }

            $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getEventById(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');

        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $event = Event::getById((int) $args['id']);
                if ($event) {
                    $response->getBody()->write(json_encode($event));
                    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
                }

                $payload = ['error' => 'Event not found', 'code' => 404];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createEvent(Request $request, Response $response): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');

        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $data = json_decode($request->getBody()->getContents(), true);
                $newEvent = Event::create($data);
                $response->getBody()->write(json_encode($newEvent));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
            }

            $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function updateEvent(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');

        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $data = json_decode($request->getBody()->getContents(), true);
                $updatedEvent = Event::update((int) $args['id'], $data);
                $response->getBody()->write(json_encode($updatedEvent));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            }

            $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function deleteEvent(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');

        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                Event::delete((int) $args['id']);
                $payload = ['success' => 'Event was deleted', 'code' => 204];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
            }

            $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
