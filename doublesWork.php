<?php
function isDoubles($userInform) {

    $doubles = getDoubles($userInform['clientPhone']);
    if (!count($doubles)) $doubles = getDoubles($userInform['clientEmail']);

    $res = count($doubles);

    if ($res) foreach ($doubles as $double) setTask($double);

    return $res;
}

function getDoubles($queryValue) {

    if ($queryValue === '') return [];

    $link = 'https://clevertoys.amocrm.ru/api/v2/leads?query='.$queryValue.'&filter%5Bactive%5D=1';

    $headers[] = "Accept: application/json";

    //Curl options
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl, CURLOPT_USERAGENT, "amoCRM-API-client-undefined/2.0");
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HEADER,false);
    curl_setopt($curl, CURLOPT_COOKIEFILE,__DIR__."/cookie.txt");
    curl_setopt($curl, CURLOPT_COOKIEJAR,__DIR__."/cookie.txt");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);

    $out = curl_exec($curl);

    $code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
    curl_close($curl);
    $result = json_decode($out,TRUE);

    $res = [];

    if ($result) {
        $deals = $result['_embedded']['items'];

        foreach ($deals as $deal) {
            /*надо бы добавить проверку, что найденное значение именно телефон или почта,
            а то вдруг в каком-нибудь служебном поле такое встретится*/
            $res[] = [
                'leads_id' => $deal['id'],
                'respons_id' =>$deal['responsible_user_id'],
            ];
        }
    }

    return $res;
}


function setTask ($taskParam) {
    $data = array (
        'add' =>
            array (
                0 =>
                    array (
                        'element_id' => $taskParam['leads_id'],
                        'element_type' => '2',
                        'complete_till' => time()+86400,
                        'task_type' => '1',
                        'text' => 'Получили ещё один запрос от этого контакта. Не дубль ли?',
                        'responsible_user_id' => $taskParam['respons_id'],
                    ),
            ),
    );
    $link = "https://clevertoys.amocrm.ru/api/v2/tasks";

    $headers[] = "Accept: application/json";

    //Curl options
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl, CURLOPT_USERAGENT, "amoCRM-API-client-undefined/2.0");
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HEADER,false);
    curl_setopt($curl,CURLOPT_COOKIEFILE,__DIR__.'/cookie.txt');
    curl_setopt($curl,CURLOPT_COOKIEJAR,__DIR__.'/cookie.txt');
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
    $out = curl_exec($curl);
    $code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
    $code=(int)$code;
    curl_close($curl);
    $result = json_decode($out,TRUE);
}
