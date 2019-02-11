<?php
function ConnectToAMO() {
    /*
        $post_data = http_build_query(
            array(
                'USER_LOGIN'=>'vladimirkh.it@gmail.com',
                'USER_HASH'=>'e6598fa2f194c9ce76519b9b94893f91f2816489',
                'TYPE' => 'json'
                )
        );

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $post_data
            )
        );

        $parametr_string = stream_context_create($opts);

        $subdomain='clevertoys';

        $link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';


        $result = file_get_contents($link, false, $parametr_string);

        echo $result;

        $Response=json_decode($result,true);
        $Response=$Response['response'];
        if(isset($Response['auth']))  {
            echo "OK!!!";
        } else {
            echo "BAD :(";
        }

        return $result;
  */
       $user=array(
            'USER_LOGIN'=>'vladimirkh.it@gmail.com',
            'USER_HASH'=>'e6598fa2f194c9ce76519b9b94893f91f2816489'
        );
        $subdomain='clevertoys';

        $link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';
        $curl=curl_init(); #Сохраняем дескриптор сеанса cURL

        curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
        curl_setopt($curl,CURLOPT_URL,$link);
        curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
        curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($user));
        curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
        curl_setopt($curl,CURLOPT_HEADER,false);
        curl_setopt($curl,CURLOPT_COOKIEFILE,__DIR__.'/cookie.txt');
        curl_setopt($curl,CURLOPT_COOKIEJAR,__DIR__.'/cookie.txt');
        curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
        curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
        $out=curl_exec($curl);
        $code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
    #    curl_close($curl); #Завершаем сеанс cURL - надо ли завершать?

        $code=(int)$code;
        $errors=array(
            301=>'Moved permanently',
            400=>'Bad request',
            401=>'Unauthorized',
            403=>'Forbidden',
            404=>'Not found',
            500=>'Internal server error',
            502=>'Bad gateway',
            503=>'Service unavailable'
        );
        try
        {
            #Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
            if($code!=200 && $code!=204)
                throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
        }
        catch(Exception $E)
        {
            die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
        }

        $Response=json_decode($out,true);
        $Response=$Response['response'];
        if(isset($Response['auth']))  {
            $result = $curl;
            echo "OK!!!";
        } else {
            $result = false;
            echo "BAD :(";
        }

        return $result;

}

function logDataAndProblems() {

}