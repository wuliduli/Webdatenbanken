<?php

use \Firebase\JWT\JWT;

class JWTHandler
{

	public function JWT_check_token($token)
	{
		define('SECRET', 'MDlmNWIyZDU5ZDEzMmN3ddwddfgWIyZDU5ZMzIyYQ5NzlhZkk==');
		define('APIKEY', 'xlag-sdjk-skdt');
		define('ALGORITHM', 'HS256');

		define('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YXBwZmFjdG9yeSIsImF1ZCI6ImRlLndhcHBwcm9qZWN0cy5kZXYiLCJleHAiOjE3NDMyODkxOTksImlhdCI6MTc0MDQ3MjY2NCwiZW1haWwiOiJ0ZXN0QHdhcHBwcm9qZWN0cy5kZSIsInN1YiI6InhsYWctc2Rqay1za2R0In0.rXkyDtDcNO-W_KJCxxaY4M1rHfXh7mYbbr5dOfOAY3U');

		if ($token == token) {
			return true;
		} else {
			return false;
		}
		/*
				try {
					$algsAllowed = array(ALGORITHM);
					$decoded = JWT::decode($token, SECRET, $algsAllowed);
					if ($decoded->('sub') !==APIKEY {
						$res['status'] = "error";
						$res['message'] = "Wrong Token.";
					} else {
						$res['status'] = "success";
						$res['message'] = "JWT ok";
					}
				}
				catch (Exception $e) {
					//Catching expired tokens
					$res['status'] = "error";
					$res['message'] = $e->getMessage();
				}*/

	}
}
?>