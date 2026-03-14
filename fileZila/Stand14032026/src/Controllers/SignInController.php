<?php

namespace App\Controllers;

use JWTHandler;
require_once 'JWTHandler.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Sign_In;

class SignInController
{
    public function getAllSignIn(Request $request, Response $response): Response
    {

        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                $timeEntries = Sign_In::getAll();
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

    public function getAllSignInByUserId(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {

                // UID kommt aus JSON-Body
                $data = json_decode($request->getBody()->getContents(), true);
                //$uid = $data['UID'] ?? null;

                //$timeEntries = Sign_In::getByUser($uid);
                $timeEntries = Sign_In::getByUser((int) $args['id']);
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

    public function getAllSignInByEventId(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {

                // EID kommt aus JSON-Body
                $data = json_decode($request->getBody()->getContents(), true);
                //$eid = $data['EID'] ?? null;

                //$timeEntries = Sign_In::getByEvent($eid);
                $timeEntries = Sign_In::getByEvent((int) $args['id']);
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

    public function getSignInByIds(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {

                // EID und UID kommen jetzt aus JSON-Body (statt $args['id'])
                $data = json_decode($request->getBody()->getContents(), true);
                $eid = $data['EID'] ?? null;
                $uid = $data['UID'] ?? null;


                $timeEntry = Sign_In::getByIds($eid, $uid);

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

    public function createSignIn(Request $request, Response $response): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                try {
                    // $data = (array)$request->getParsedBody();
                    $data = json_decode($request->getBody()->getContents(), true);
                    //Sign_Out_Time wird auf aktuelles Datum gesetzt, wenn sign_out_time im Request-Body auf true gesetzt ist (von Andy)
                    $newTimeEntry = Sign_In::create($data);
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

    public function updateSignIn(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {
                try {
                    // $data = (array)$request->getParsedBody();
                    $data = json_decode($request->getBody()->getContents(), true);

                    // EID und UID kommen jetzt aus JSON-Body
                    $eid = $data['EID'] ?? null;
                    $uid = $data['UID'] ?? null;

                    $updatedTimeEntry = Sign_In::update($eid, $uid, $data);
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

    public function deleteSignIn(Request $request, Response $response, array $args): Response
    {
        $jwtChecker = new JWTHandler();
        $authtoken = $request->getHeaderLine('Authorization');
        if (strpos($authtoken, 'Bearer ') === 0) {
            $token = str_replace('Bearer ', '', $authtoken, $count);
            if ($jwtChecker->JWT_check_token($token)) {

                // EID und UID kommen jetzt aus JSON-Body
                $data = json_decode($request->getBody()->getContents(), true);
                $eid = $data['EID'] ?? null;
                $uid = $data['UID'] ?? null;

                Sign_In::delete($eid, $uid);

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
