<?php

namespace App\Models;

use PDO;
use App\Models\Database;

class Event
{
    private static string $tableName = "t_events";
    //
    // CRUD - Create
    //
    public static function create(array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("INSERT INTO " . self::$tableName . " (name, start, end) 
        VALUES (:name, :start, :end)");

            $stmt->execute([
                ':name' => $data['name'],
                ':start' => $data['start'],
                ':end' => $data['end']
            ]);

            $EID = $db->lastInsertId();

            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'Event successfully created',
                'data' => ['EID' => $EID] + $data,
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
    public static function getById(int $EID): ?array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM " . self::$tableName . " WHERE EID = :EID");
        $stmt->execute([':EID' => $EID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //
    // CRUD - Update
    //
    public static function update(int $EID, array $data): array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE " . self::$tableName . " 
            SET name = :name, start = :start, end = :end WHERE EID = :EID");
            $stmt->execute([
                ':name' => $data['name'],
                ':start' => $data['start'],
                ':end' => $data['end'],
                ':EID' => $EID
            ]);

            return [
                'status' => 'success',
                'code' => 201,
                'message' => 'Event with the ID ' . $EID . ' was updated successfully',
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
    // CRUD - Delete
    //
    public static function delete(int $EID): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM " . self::$tableName . " WHERE EID = :EID");
        $stmt->execute([':EID' => $EID]);
    }
}