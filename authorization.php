<?php
require_once "cfg.php";

function ConnectToAMO() {
       $user=array(
            'USER_LOGIN'=>'vladimirkh.it@gmail.com',
            'USER_HASH'=> getAPIk(),
        );
        $subdomain='clevertoys';

        $link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';
        $curl=curl_init(); #Сохраняем дескриптор сеанса cURL

        curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client-undefined/2.0');
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
        curl_close($curl); #Завершаем сеанс cURL

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
            return true;
        } else {
            $Response['user_data'] = $_REQUEST;
            $f = fopen("err.txt","at") or die("Что-то пошло не так!!!");
            flock($f, LOCK_EX);
            fwrite ($f, $Response);
            flock($f, LOCK_UN);
            fclose($f);
            return false;
        }

}
