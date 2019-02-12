<?php

function addDeal ($userInform) {
    $params = isExistContact($userInform);
    if (!count($params)) {
        $params['respons_id'] = '3238408';
        $params['contact_id'] = addContact ($userInform);
    }
    setDeal ($params);
}


function isExistContact ($userInform) {
    $params = getContactInfo($userInform['clientPhone']);
    if (!count($params)) $params = getContactInfo($userInform['clientEmail']);
    if (count($params)) return $params; else return [];
}

function getContactInfo ($queryValue) {
    if ($queryValue === '') return [];

    $link = 'https://clevertoys.amocrm.ru/api/v2/contacts?query='.$queryValue;

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

    curl_close($curl);
    $result = json_decode($out,TRUE);

    $res = [];

    if ($result) {
        $contact = $result['_embedded']['items'];
            $res['contact_id'] = $contact[0]['id'];
            $res['respons_id'] = $contact[0]['responsible_user_id'];
    }

    return $res;
}

function addContact ($userInform) {
    $data = array (
        'add' =>
            array (
                0 =>
                    array (
                        'name' => $userInform['clientName'],
                        'created_at' => time(),
                        'custom_fields' =>
                            array (
                                0 =>
                                    array (
                                        'id' => '366543',
                                        'values' =>
                                            array (
                                                0 =>
                                                    array (
                                                        'value' => $userInform['clientPhone'],
                                                        'enum' => 'MOB',
                                                    ),
                                            ),
                                    ),
                                1 =>
                                    array (
                                        'id' => '366545',
                                        'values' =>
                                            array (
                                                0 =>
                                                    array (
                                                        'value' => $userInform['clientEmail'],
                                                        'enum' => 'WORK',
                                                    ),
                                            ),
                                    ),
                                2 =>
                                    array (
                                        'id' => '368963',
                                        'values' =>
                                            array (
                                                0 =>
                                                    array (
                                                        'value' => $userInform['clientBranch'],
                                                    ),
                                            ),
                                    ),
                            ),
                    ),
            ),
    );
    $link = "https://clevertoys.amocrm.ru/api/v2/contacts";

    $headers[] = "Accept: application/json";

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl, CURLOPT_USERAGENT, "amoCRM-API-client-undefined/2.0");
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST,'POST');
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_HEADER,false);
    curl_setopt($curl,CURLOPT_COOKIEFILE,__DIR__."/cookie.txt");
    curl_setopt($curl,CURLOPT_COOKIEJAR,__DIR__."/cookie.txt");
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);


    $out = curl_exec($curl);
    $code=curl_getinfo($curl,CURLINFO_HTTP_CODE);

    curl_close($curl);
    $result = json_decode($out,TRUE);

    return $result['_embedded']['items'][0]['id'];
}

function setDeal ($params) {

    $data = array (
      'add' =>
      array (
        0 =>
        array (
          'name' => 'NewDeal',
          'status_id' => '24414106',
          'responsible_user_id' => $params['respons_id'],
          'created_at' => time(),
          'contacts_id' =>
          array (
            0 => $params['contact_id'],
          ),
        ),
      ),
    );
    $link = "https://clevertoys.amocrm.ru/api/v2/leads";

    $headers[] = "Accept: application/json";

     //Curl options
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl, CURLOPT_USERAGENT, "amoCRM-API-client-
    undefined/2.0");
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HEADER,false);
    curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__)."/cookie.txt");
    curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__)."/cookie.txt");
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
    $out = curl_exec($curl);
    $code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
    curl_close($curl);
    $result = json_decode($out,TRUE);

}
