<?php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver'   => 'pdo_mysql',
        'dbname' => 'simple-crm',
        'user' => 'root',
        'password' => '',
        'charset' => 'UTF8'
    ),
));

$app['debug'] = true;

class DataProvider {
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getRequestData()
    {
        return json_decode(file_get_contents('php://input'), true);
    }


    /*==========  Clients  ==========*/
    public function getClients()
    {
        $sql = "SELECT c.*, cs.name as sector_name, u.name as account_manager_name FROM clients as c LEFT JOIN company_sectors as cs ON c.sector_id = cs.id LEFT JOIN users as u ON c.account_manager_id = u.id";

        return $this->db->fetchAll($sql);
    }

    public function getClient($clientId)
    {
        $sql = "SELECT * FROM clients WHERE id = ?";
        return $this->db->fetchAssoc($sql, array((int) $clientId));
    }

    public function updateClient($clientId, $data)
    {
        unset($data['id']);

        $where = ['id' => (int) $clientId];

        $this->db->update('clients', $data, $where);

        return true;
    }

    public function saveNewClient($data)
    {
        unset($data['id']);

        $result = $this->db->insert('clients', $data);

        if(!$result){
            return false;
        }

        return $this->db->lastInsertId();
    }

    public function deleteClient($clientId)
    {
        $this->db->delete('clients', ['id' => $clientId]);
        return true;
    }


    /*==========  Timeline  ==========*/
    public function getClientTimeline($clientId)
    {
        $sql = "SELECT ct.*, u.name as user_name FROM contact_timeline as ct LEFT JOIN users as u ON ct.user_id = u.id WHERE client_id = ? ORDER BY contact_date DESC";
        return $this->db->fetchAll($sql, array((int) $clientId));
    }

    public function addTimelineEvent($clientId, $eventData)
    {
        $eventData['client_id'] = $clientId;

        $result = $this->db->insert('contact_timeline', $eventData);

        if(!$result){
            return false;
        }

        return $this->db->lastInsertId();
    }

    public function getTimelineEvent($eventId)
    {
        return $this->db->fetchAssoc("SELECT * FROM contact_timeline WHERE id = ?", array((int) $eventId));
    }


    /*==========  Users  ==========*/
    public function getUsers()
    {
        $sql = "SELECT * FROM users";

        return $this->db->fetchAll($sql);
    }


    /*==========  Sectors  ==========*/
    public function getSectors()
    {
        $sql = "SELECT * FROM company_sectors";

        return $this->db->fetchAll($sql);
    }



};

$DataProvider = new DataProvider($app['db']);

/*===============================
=            CLIENTS            =
===============================*/
$app->get('/clients', function () use ($app, $DataProvider) {
    $clients = $DataProvider->getClients();

    $response = new JsonResponse();
    $response->setEncodingOptions(JSON_NUMERIC_CHECK);
    $response->setData($clients);

    return $response;
});

$app->get('/client/{clientId}', function ($clientId) use ($app, $DataProvider) {

    $clientDetails = $DataProvider->getClient($clientId);

    if(!$clientDetails){
        return $app->json(['errorMessage' => 'Client Not Found'], 404);
    }

    return $app->json($clientDetails);
});

$app->put('/client/{clientId}', function (Request $request, $clientId) use ($app, $DataProvider) {

    $clientDetails = $DataProvider->getClient($clientId);

    if(!$clientDetails){
        return $app->json(['errorMessage' => 'Client Not Found'], 404);
    }

    $updateData = $DataProvider->getRequestData();

    $result = $DataProvider->updateClient($clientId, $updateData);

    return $app->json(['message' => 'Client updated!']);
});

$app->post('/client', function (Request $request) use ($app, $DataProvider) {

    $insertData = $DataProvider->getRequestData();

    $newClientId = $DataProvider->saveNewClient($insertData);

    if(false == $newClientId){
        return $app->json(['errorMessage' => 'Can not insert user'], 500);
    }

    $clientDetails = $DataProvider->getClient($newClientId);

    return $app->json(['message' => 'Client created!', 'client' => $clientDetails]);
});

$app->delete('/client/{clientId}', function (Request $request, $clientId) use ($app, $DataProvider) {

    $DataProvider->deleteClient($clientId);

    return $app->json(['message' => 'Client deleted!']);
});



/*=======================================
=            COMPANY SECTORS            =
=======================================*/
$app->get('/company-sectors', function () use ($app, $DataProvider) {

    $sectors = $DataProvider->getSectors();

    return $app->json($sectors);
});



/*=============================
=            USERS            =
=============================*/
$app->get('/users', function () use ($app, $DataProvider) {

    $users = $DataProvider->getUsers();

    return $app->json($users);
});



/*================================
=            TIMELINE            =
================================*/
$app->get('/client/{clientId}/timeline', function (Request $request, $clientId) use ($app, $DataProvider) {

    $clientDetails = $DataProvider->getClient($clientId);

    if(!$clientDetails){
        return $app->json(['errorMessage' => 'Client Not Found'], 404);
    }

    $timeline = $DataProvider->getClientTimeline($clientId);

    return $app->json($timeline);
});

$app->post('/client/{clientId}/timeline', function (Request $request, $clientId) use ($app, $DataProvider) {

    $clientDetails = $DataProvider->getClient($clientId);

    if(!$clientDetails){
        return $app->json(['errorMessage' => 'Client Not Found'], 404);
    }

    $eventData = $DataProvider->getRequestData();

    $eventId = $DataProvider->addTimelineEvent($clientId, $eventData);

    if(false == $eventId){
        return $app->json(['errorMessage' => 'Can not create timeline event'], 500);
    }

    $timeline = $DataProvider->getClientTimeline($clientId);

    return $app->json($timeline);
});

$app->run();
