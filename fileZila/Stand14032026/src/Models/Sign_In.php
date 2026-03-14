<?php

namespace App\Models;

use PDO;
use PDOException;
use Exception;
use App\Models\Database;

class Sign_In
{
    private static string $tableName = "t_sign_in";
    //
    // CRUD - Create
    //
    public static function create(array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("INSERT INTO " . self::$tableName . " (EID, UID, notes, sign_in_time, sign_out_time) 
        VALUES (:EID, :UID, :notes, :sign_in_time, :sign_out_time)");

            $stmt->execute([
                ':EID' => $data['EID'],
                ':UID' => $data['UID'],
                ':notes' => $data['notes'] ?? null,
                ':sign_in_time' => $data['sign_in_time'] ?? date('Y-m-d H:i:s'),
                ':sign_out_time' => $data['sign_out_time'] ?? null,
            ]);

            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'Sign_In of User:' . $data['UID'] . ' into Event:' . $data['UID'] . ' successfully created',
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
        $stmt = $db->query("SELECT * FROM " . self::$tableName);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //
    // CRUD - Read (one)
    //
    public static function getByIds(int $EID, int $UID): ?array
    {

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM " . self::$tableName . " WHERE EID = :EID AND UID = :UID");
        $stmt->execute([':EID' => $EID, ':UID' => $UID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Read (all specific event)
    //
    public static function getByEvent(int $EID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM " . self::$tableName . " WHERE EID = :EID");
        $stmt->execute([':EID' => $EID]);
        return $stmt->fetchALL(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Read (all specific user)
    //
    public static function getByUser(int $UID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM " . self::$tableName . " WHERE UID = :UID");
        $stmt->execute([':UID' => $UID]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Update
    // Alten Query: UPDATE t_sign_in SET notes = :notes, sign_in_time = :sign_in_time, sign_out_time = :sign_out_time WHERE EID =:EID AND UID = :UID
    public static function update(int $EID, int $UID, array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE " . self::$tableName . " 
            SET notes = IFNULL(:notes, notes), sign_out_time = IFNULL(:sign_out_time, sign_out_time) WHERE EID = :EID AND UID = :UID");
            $stmt->execute([
                ':notes' => $data['notes'] ?? null,
                ':sign_out_time' => $data['sign_out_time'] ?? date('Y-m-d H:i:s'),
                ':EID' => $EID,
                ':UID' => $UID
            ]);


            return [
                'status' => 'success',
                'code' => 200,
                'message' => 'Sign_In of User ' . $UID . ' into Event ' . $EID . ' was updated successfully',
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
        $stmt = $db->prepare("DELETE FROM " . self::$tableName . " WHERE EID =:EID AND UID = :UID");
        $stmt->execute([':EID' => $EID, ':UID' => $UID]);
    }
}