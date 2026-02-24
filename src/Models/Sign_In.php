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
            $stmt = $db->prepare("INSERT INTO sign_in (EID, UID, notes, sign_in_time, sign_out_time) 
        VALUES (:firstname, :lastname, :email, :notes, :password, :mandtime)");

            $stmt->execute([
                ':EID' => $data['EID'],
                ':UID' => $data['UID'],
                ':notes' => $data['notes'] ?? null,
                ':sign_in_time' => $data['sign_in_time'],
                ':sign_out_time' => $data['sign_out_time'] ?? null,
            ]);

            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'Sign_In successfully created',
                'data' => $data,
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
        $stmt = $db->query("SELECT * FROM sign_in");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //
    // CRUD - Read (one)
    //
    public static function getByIds(int $EID, int $UID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM sign_in WHERE EID = :EID AND UID = :UID");
        $stmt->execute([':EID' => $EID, ':UID' => $UID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Read (all specific event)
    //
    public static function getByEvent(int $EID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM sign_in WHERE EID = :EID");
        $stmt->execute([':EID' => $EID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Read (all specific user)
    //
    public static function getByUser(int $UID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM sign_in WHERE UID = :UID");
        $stmt->execute([':UID' => $UID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Update
    //
    public static function update(int $EID, int $UID, array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE sign_in 
            SET notes = :notes, sign_in_time = :sign_in_time, sign_out_time = :sign_out_time WHERE EID =:EID AND UID = :UID");
            $stmt->execute([
                ':notes' => $data['notes'] ?? null,
                ':sign_in_time' => $data['sign_in_time'],
                ':sign_out_time' => $data['sign_out_time'] ?? null,
                ':EID' => $EID,
                ':UID' => $UID
            ]);


            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'Sign_In with the referencig ids event ' . $EID . ' and user ' . $UID . ' was updated successfully',
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
    // CRUD - Update
    //
    public static function delete(int $EID, int $UID): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM sign_in WHERE EID =:EID AND UID = :UID");
        $stmt->execute([':EID' => $EID, ':UID' => $UID]);
    }
}