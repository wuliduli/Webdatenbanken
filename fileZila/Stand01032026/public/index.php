<?php

//
// ATTN: Activate verbose error messaging for test and debug only 
//       Potential security risc if switched on
//
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Selective\BasePath\BasePathMiddleware; 
use \Slim\Factory\AppFactory;
use \DI\Container;

// Load Autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Create Container
$container = new Container();
AppFactory::setContainer($container);


// Create Slim App
$app = AppFactory::create();

// Add Slim routing middleware
$app->addRoutingMiddleware();

// Set the base path to run the app in a subdirectory.
// This path is used in urlFor().
$app->add(new BasePathMiddleware($app));

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Set the Not Found Handler
$errorMiddleware->setErrorHandler(
    HttpNotFoundException::class,
    function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails) {
        $response = new Response();
        // 404 - gestern ging das noch - ich schwöre
        $response->getBody()->write("404 NOT FOUND!");
        return $response->withStatus(404);
});

// Define app route 
$app->get('/api/test', function (Request $request, Response $response) {
    $response->getBody()->write('Test successful - Herr Kreinbihl zeigt uns echt cooles Zeug - das crazy!');
    return $response;
})->setName('root');


// Add known routes
(require __DIR__ . '/../src/Routes/routes.php')($app);


// Run app
$app->run();

