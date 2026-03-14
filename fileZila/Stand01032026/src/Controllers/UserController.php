<?php

namespace App\Controllers;

use JWTHandler;
require_once 'JWTHandler.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\User;

class UserController
{
    public function getAllUsers(Request $request, Response $response): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $users = User::getAll();
                $response->getBody()->write(json_encode($users));
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

    public function getUserById(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $user = User::getById($args['id']);
                if ($user) {
                    $response->getBody()->write(json_encode($user));
                } else {
                    $response = $response->withStatus(404)->withBody('User not found');
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

    public function createUser(Request $request, Response $response): Response
    {

        try {
            // $data = (array)$request->getParsedBody();
            $data = json_decode($request->getBody()->getContents(), true);
            $newUser = User::create($data);
            $response->getBody()->write(json_encode($newUser));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } catch (error) {
            $response->getBody()->write(error);
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }

    }

    public function updateUser(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                try {
                    // $data = (array)$request->getParsedBody();
                    $data = json_decode($request->getBody()->getContents(), true);
                    $updatedUser = User::update($args['id'], $data);
                    $response->getBody()->write(json_encode($updatedUser));
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

    public function deleteUser(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                User::delete($args['id']);
				$payload = ['success' => 'User has been deleted', 'code' => 204];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json');
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

    public function loginUser(Request $request, Response $response, array $args): Response
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            $tryLogin = User::login($data['email'], $data['password']);
            $response->getBody()->write(json_encode($tryLogin));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (error) {
            $response->getBody()->write(error);
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
