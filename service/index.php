<?php

        $method = $_SERVER["REQUEST_METHOD"]; // "GET" or "POST"?

        $servername = "localhost";
        $username   = "pavlovci_nvcms";
        $password   = "public";
        $dbname     = "pavlovci_nvcms";
        $conn       = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);


function getRoutine($conn){
        if ($_SERVER["QUERY_STRING"]) { // Grab cms.inventumdigital.com/service/?QUERY_STRING
                $URLquery = $_SERVER["QUERY_STRING"];

        if (strpos($URLquery,'%') !== true) { // Assume URI encoded if contains "%" (e.g. form submission) because normal URLs do not usually contain "%".
            $URLquery = urldecode($URLquery);
            $URLquery = str_replace("URL=", "", $URLquery); // Strip off "/custom.html" form input name.
        }

            // $fp = fopen('debugger.json', 'w');
            // $stringOut = $URLquery;
            // fwrite($fp, $stringOut);
            // fclose($fp);

                $URLquery = $URLquery . "%"; // Need to test.

                $SQLquery = "SELECT * FROM public WHERE URL LIKE \"$URLquery\""; // "=" or LIKE // QUERY_STRING is the key in the key-value pair for database.
        } else $SQLquery = "SELECT * FROM public"; // If no query string, return entire database. For debugging.

        $result = $conn->query($SQLquery);
        $x = 0;
        echo "[";

        if ($result->num_rows) { // Output data of each row.
                while ($row = $result->fetch_assoc()) {
                        if ($x++) echo ", ";
                                $preEcho = $row["Spreads"];
                                if ($preEcho == "") $preEcho = "\"\""; // For null entries, outputs "" to fill in indicies in array for successful JSON.parse.
                                echo $preEcho;
                }
        } else echo "";

        echo "]";
}

function deleteRoutine($conn){
        if ($_SERVER["QUERY_STRING"]) { // Grab cms.inventumdigital.com/service/?QUERY_STRING
                $URLquery = $_SERVER["QUERY_STRING"];

        if (strpos($URLquery,'%') !== true) { // Assume URI encoded if contains "%" (e.g. form submission) because normal URLs do not usually contain "%".
            $URLquery = urldecode($URLquery);
            $URLquery = str_replace("URL=", "", $URLquery); // Strip off "/custom.html" form input name.
        }
        echo "DELETE: " . $URLquery;

            $fp = fopen('debugger.json', 'w');
            $stringOut = $URLquery;
            fwrite($fp, $stringOut);
            fclose($fp);

                $SQLquery = "DELETE FROM public WHERE URL=\"$URLquery\""; // "=" or LIKE // QUERY_STRING is the key in the key-value pair for database.

        } else echo "Failed to DELETE." . $URLquery;

        $result = $conn->query($SQLquery);
        $x = 0;
        // echo "[";

        // if ($result->num_rows) { // Output data of each row.
        //         while ($row = $result->fetch_assoc()) {
        //                 if ($x++) echo ", ";
        //                         $preEcho = $row["Spreads"];
        //                         if ($preEcho == "") $preEcho = "\"\""; // For null entries, outputs "" to fill in indicies in array for successful JSON.parse.
        //                         echo $preEcho;
        //         }
        // } else echo "No results.";

        // echo "]";
}

function postRoutine($conn){
        $SQLquery ="INSERT INTO public (URL, Spreads) VALUES ('" .
            $_POST["URL"] .
            "' , '" .
            $_POST["Spreads"] .
            "')";

            // $fp = fopen('debugger.json', 'w');
            // $stringOut = $SQLquery;
            // fwrite($fp, $stringOut);
            // fclose($fp);

        if ($conn->query($SQLquery)) echo "New record created successfully";
        else echo "Error: " . $SQLquery . "<br>" . $conn->error;

}


        if ($method == "GET") getRoutine($conn);
        else if ($method == "DELETE") deleteRoutine($conn);
        else if ($method == "POST") postRoutine($conn);
        else echo "Unsupported request method, please try a \"POST\" ,\"DELETE\" or \"GET\".";

        $conn->close();

?>