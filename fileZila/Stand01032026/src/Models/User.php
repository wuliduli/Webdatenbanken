<?php

namespace App\Models;

use PDO;
use App\Models\Database;

class User
{
    //
    // CRUD - Create
    //
    public static function create(array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("INSERT INTO users (firstname, lastname, email, notes, password, mandtime) 
        VALUES (:firstname, :lastname, :email, :notes, :password, :mandtime)");

            $stmt->execute([
                ':firstname' => $data['firstname'],
                ':lastname' => $data['lastname'],
                ':email' => $data['email'],
                ':notes' => $data['notes'],
                ':password' => password_hash($data['password'], PASSWORD_DEFAULT),
                ':mandtime' => $data['mandtime'] ?? 8,
            ]);

            $UID = $db->lastInsertId();

            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'User successfully created',
                'data' => ['UID' => $UID] + $data,
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'code' => 500,
                'message' => 'Database error: ' . $e->getMessage(),
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'code' => 400,
                'message' => 'General error: ' . $e->getMessage(),
            ];
        }
    }

    //
    // CRUD - Read (all)
    //
    public static function getAll(): array
    {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //
    // CRUD - Read (one)
    //
    public static function getById(int $UID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE UID = :UID");
        $stmt->execute([':UID' => $UID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Update
    //

    public static function update(string $UID, array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE users 
            SET firstname = :firstname, lastname = :lastname, email = :email, notes = :notes, active = :active, mandtime = :mandtime, verified = :verified WHERE UID = :UID");
            $stmt->execute([
                ':firstname' => $data['firstname'],
                ':lastname' => $data['lastname'],
                ':email' => $data['email'],
                ':notes' => $data['notes'] ?? null,
                ':active' => $data['active'],
                ':mandtime' => $data['mandtime'],
                ':verified' => $data['verified'],
                ':UID' => $UID
            ]);


            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'Nutzer mit der ID ' . $UID . ' wurde erfolgreich aktualisiert',
            ];

        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'code' => 500,
                'message' => 'Database error: ' . $e->getMessage(),
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'code' => 400,
                'message' => 'General error: ' . $e->getMessage(),
            ];
        }

        /*
                $db = Database::getConnection();
                $stmt = $db->prepare("UPDATE users 
                                      SET firstname = :firstname, lastname = :lastname, email = :email, notes = :notes WHERE UID = :UID");

                $stmt->execute([
                    ':firstname' => $data['firstname'],
                    ':lastname' => $data['lastname'],
                    ':email' => $data['email'],
                    ':notes' => $data['notes'] ?? null,
                    ':UID' => $UID
                ]);

                return ['UID' => $UID] + $data;*/
    }



    public static function delete(string $UID): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM users WHERE UID = :UID");
        $stmt->execute([':UID' => $UID]);
    }

    public static function login(string $email, string $password): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT UID, password FROM users WHERE email = :email");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $user['password'])) {
                return [
                    'status' => 'successful',
                    'code' => 201,
                    'message' => 'Login authorized',
                    'data' => ['UID' => $user['UID']] + ['token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YXBwZmFjdG9yeSIsImF1ZCI6ImRlLndhcHBwcm9qZWN0cy5kZXYiLCJleHAiOjE3NDMyODkxOTksImlhdCI6MTc0MDQ3MjY2NCwiZW1haWwiOiJ0ZXN0QHdhcHBwcm9qZWN0cy5kZSIsInN1YiI6InhsYWctc2Rqay1za2R0In0.rXkyDtDcNO-W_KJCxxaY4M1rHfXh7mYbbr5dOfOAY3U'],
                ];
            } else {
                return [
                    'status' => 'Unauthorized',
                    'code' => 401,
                    'message' => 'login incorrect',
                    'data' => $user['password'],
                ];
            }

        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'code' => 500,
                'message' => 'Database error: ' . $e->getMessage(),
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'code' => 400,
                'message' => 'General error: ' . $e->getMessage(),
            ];
        }


    }
}