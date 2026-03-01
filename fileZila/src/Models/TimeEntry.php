<?php

namespace App\Models;

use PDO;
use App\Models\Database;

class TimeEntry
{
    //
    // CRUD - Create
    //
    public static function create(array $data): array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO timerecords (timestamp, tnotes, action, tracked_by, created_at) VALUES (:timestamp, :tnotes, :action, :tracked_by, :created_at)");
        $stmt->execute([
            ':timestamp' => $data['timestamp'],
            ':tnotes' => $data['tnotes'],
            ':action' => $data['action'],
            ':tracked_by' => $data['tracked_by'],
            ':created_at' => $data['created_at'],
        ]);
        $TID = $db->lastInsertId();
        return ['TID' => $TID] + $data;
    }

    //
    // CRUD - Read (all)
    //
    public static function getAll(): array
    {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM timerecords");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //
    // CRUD - Read (one)
    //
    public static function getById(int $TID): ?array
    {

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM timerecords WHERE id = :TID");
        $stmt->execute([':TID' => $TID]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

    }

    public static function getByUserId(int $UID): ?array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT * FROM timerecords WHERE tracked_by = :UID");
            $stmt->execute([':UID' => $UID]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: null;
            return [
                'status' => 'success',
                'code' => 201,
                'message' => "TimeEntryData send",
                'data' => $data
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
    // CRUD - Update (all)
    //
    public static function update(int $TID, array $data): array
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE timerecords SET timestamp = :timestamp, tnotes = :tnotes  WHERE TID = :TID");
        $stmt->execute([
            ':timestamp' => $data['timestamp'],
            ':tnotes' => $data['tnotes'],
            ':TID' => $TID,
        ]);
        return ['TID' => $TID] + $data;
    }

    //
    // CRUD - Read (all)
    //
    public static function delete(int $TID): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM timerecords WHERE TID = :TID");
        $stmt->execute([':TID' => $TID]);
    }
}

