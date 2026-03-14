<?php

namespace App\Controllers;

use JWTHandler;
require_once 'JWTHandler.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\TimeEntry;

class TimeEntryController
{
    public function getAllTimeEntries(Request $request, Response $response): Response
    {

        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $timeEntries = TimeEntry::getAll();
                $response->getBody()->write(json_encode($timeEntries));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            } else {
                $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
            }

        } else {
            $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }

    public function getAllTimeEntriesByUserId(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $timeEntries = TimeEntry::getByUserId($args['uid']);
                $response->getBody()->write(json_encode($timeEntries));
                return$response->withHeader('Content-Type', 'application/json')->withStatus(200);
            } else {
                $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
            }

        } else {
            $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }

    public function getTimeEntryById(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $timeEntry = TimeEntry::getById($args['tid']);
                if ($timeEntry) {
                    $response->getBody()->write(json_encode($timeEntry))->withStatus(200);
                } else {
                    $response = $response->withStatus(404)->withBody('Entry not found');
                }
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
            }

        } else {
            $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }

    public function createTimeEntry(Request $request, Response $response): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                try {
                    // $data = (array)$request->getParsedBody();
                    $data = json_decode($request->getBody()->getContents(), true);
                    $newTimeEntry = TimeEntry::create($data);
                    $response->getBody()->write(json_encode($newTimeEntry));
                    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
                } catch (error) {
                    $response->getBody()->write(error);
                    return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
                }
            } else {
                $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
            }

        } else {
            $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }

    public function updateTimeEntry(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                try {
                    // $data = (array)$request->getParsedBody();
                    $data = json_decode($request->getBody()->getContents(), true);
                    $updatedTimeEntry = TimeEntry::update($args['id'], $data);
                    $response->getBody()->write(json_encode($updatedTimeEntry));
                    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
                } catch (error) {
                    $response->getBody()->write(error);
                    return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
                }
            } else {
                $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
            }

        } else {
            $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }

    public function deleteTimeEntry(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                TimeEntry::delete($args['id']);
				$payload = ['success' => 'Time Entry was deleted', 'code' => 204];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
                //return $response->withStatus(204);
            } else {
                $payload = ['error' => 'Unauthorized. Missing or invalid token 1.', 'code' => 401];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
            }

        } else {
            $payload = ['error' => 'Unauthorized. Missing or invalid token 2.', 'code' => 401];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }
}
