<?php

namespace App\Models;

use PDO;
use App\Models\Database;

class Users
{
    private static string $tableName = "t_users";
    //
    // CRUD - Create
    //

    // Stuktur der Query basiert auf users, wird für t_users durchgeführt -> Man kann nicht mehr registrieren, da die API keinen Endpunkt dafür
    public static function create(array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("INSERT INTO " . self::$tableName . " (first_name, last_name, email, password, role_level, verified, active, num_failed_logins, create_at) 
        VALUES (:first_name, :last_name, :email, :password, :role_level, :verified, :active, :num_failed_logins, :create_at)");

            $stmt->execute([
                ':first_name' => $data['first_name'],
                ':last_name' => $data['last_name'],
                ':email' => $data['email'],
                ':password' => password_hash($data['password'], PASSWORD_DEFAULT),
                ':role_level' => $data['role_level'] ?? 1,
                ':verified' => $data['verified'] ?? 1,
                ':active' => $data['active'] ?? 1,
                ':num_failed_logins' => $data['num_failed_logins'] ?? 0,
                ':create_at' => $data['create_at'] ?? date('Y-m-d H:i:s'),
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
        $stmt = $db->query("SELECT * FROM " . self::$tableName);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //
    // CRUD - Read (one)
    //
    public static function getById(int $UID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM " . self::$tableName . " WHERE UID = :UID");
        $stmt->execute([':UID' => $UID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Update
    //
    public static function update(int $UID, array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE " . self::$tableName . " 
        SET first_name = IFNULL(:first_name, first_name), 
            last_name = IFNULL(:last_name, last_name), 
            email = IFNULL(:email, email), 
            password = IFNULL(:password, password), 
            role_level = IFNULL(:role_level, role_level), 
            verified = IFNULL(:verified, verified), 
            active = IFNULL(:active, active), 
            num_failed_logins = IFNULL(:num_failed_logins, num_failed_logins) 
        WHERE UID = :UID");
            $stmt->execute([
                ':first_name' => $data['first_name'] ?? null,
                ':last_name' => $data['last_name'] ?? null,
                ':email' => $data['email'] ?? null,
                ':password' => isset($data['password']) && $data['password'] !== ''
                    ? password_hash($data['password'], PASSWORD_DEFAULT)
                    : null,
                ':role_level' => $data['role_level'] ?? null,
                ':verified' => $data['verified'] ?? null,
                ':active' => $data['active'] ?? null,
                ':num_failed_logins' => $data['num_failed_logins'] ?? null,
                ':UID' => $UID
            ]);


            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'User with the id ' . $UID . ' was updated successfully',
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
    // CRUD - Read (one)
    //
    public static function delete(int $UID): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM " . self::$tableName . " WHERE UID = :UID");
        $stmt->execute([':UID' => $UID]);
    }


    //
    // Login
    //
    public static function login(string $email, string $password): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT UID, password FROM " . self::$tableName . " WHERE email = :email");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $user['password'])) {
                return [
                    'status' => 'successful',
                    'code' => 201,
                    'message' => 'Login authorized',
                    'data' => ['UID' => $user['UID']] + ['token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YXBwZmFjdG9yeSIsImF1ZCI6ImRlLndhcHBwcm9qZWN0cy5kZXYiLCJleHAiOjE3NzQ5NTMwMjEsImlhdCI6MTc2NDA1NDgzMCwiZW1haWwiOiJ0ZXN0QHdhcHBwcm9qZWN0cy5kZSIsInN1YiI6InhsYWctc2Rqay1za2R0In0.ajwy_4h_p4IOC2qaXYVkrfFmJI6rshmcohXgYDsLAJc'],
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