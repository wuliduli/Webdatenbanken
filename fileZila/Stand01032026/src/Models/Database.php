<?php

namespace App\Models;

use PDO;

class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            $dsn = 'mysql:host=dev.wappprojects.de;dbname=d0453b06;charset=utf8mb4';
            $user = 'd0453b06';   
            $password = '23i_dev_mydbox';
            self::$connection = new PDO($dsn, $user, $password);
            self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$connection;
    }
}
