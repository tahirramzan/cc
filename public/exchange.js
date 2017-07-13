var URL = "https://913f1b7b46ae448391fed6eec75b1948-vp0.us.blockchain.ibm.com:5003/chaincode"
var myKeyVals = {
    "jsonrpc": "2.0",
    "method": "query",
    "params": {
        "type": 1,
        "chaincodeID": {
            "name": "0e11ff13ea3f6eb74252b43b8d3dec09f632f8144d40ce564eb243b59e427def745aca7db9d92be6b5bbd7fad2d6ebde566a82f1a27d6f7900082d1fca2657f4"
        },
        "ctorMsg": {
            "function": "getPoints",
            "args": [
                "test"
            ]
        },
        "secureContext": "user_type1_0"
    },
    "id": 2
}

var user = "test";
var x = "";
var y = "";
var z = true;

function getPoints() {
    $('#output1').empty();
    $('#output2').empty();
    $('#output3').empty();
    $('#output4').empty();
    $('#output5').empty();
    $('#output6').empty();
    var input = document.getElementById("get").value;
    myKeyVals.params.ctorMsg.args = [input];
    myKeyVals.params.ctorMsg.function = "getPoints";
    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)

            if (resultData.error == null || resultData.error == undefined) {
                if (resultData.result.message == null || resultData.result.message == undefined) {
                    $('#output1').append('<h1 class="text-warning">Buyer does not exist</h1>');
                } else {
                    var message = resultData.result.message.replace(/\"/g, "");
                    console.log(message);
                    if (z) {
                        $('#output1').append('<h1 class="text-danger">Buyer has Points = ' + message + '</h1>');
                    } else {
                        $('#output3').append('<h1 class="text-danger">Buyer had Points = ' + message + '</h1>');

                    }
                    x = message;


                }


            } else {
                $('#output1').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
                z = true;
            }

        }

    })
}
function getCash() {
    $('#output1').empty();
    $('#output2').empty();
    $('#output3').empty();
    $('#output4').empty();
    $('#output5').empty();
    $('#output6').empty();

    var input = document.getElementById("get").value;
    myKeyVals.params.ctorMsg.args = [input];
    myKeyVals.params.ctorMsg.function = "getCash";
    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)

            if (resultData.error == null || resultData.error == undefined) {
                if (resultData.result.message == null || resultData.result.message == undefined) {
                    $('#output2').append('<h1 class="text-warning">Buyer does not exist</h1>');
                } else {
                    var message = resultData.result.message.replace(/\"/g, "");
                    console.log(message);
                    if (z) {
                        $('#output2').append('<h1 class="text-danger">Buyer has Cash = ' + message + '</h1>');
                    } else
                    {
                        $('#output4').append('<h1 class="text-danger">Buyer had Cash = ' + message + '</h1>');
                        z = true;

                    }
                    y = message;

                }


            } else {
                $('#output2').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

        }

    })
}


function exchange() {
    $('#output1').empty();
    $('#output2').empty();
    $('#output3').empty();
    $('#output4').empty();
    $('#output5').empty();
    $('#output6').empty();
    var input = document.getElementById("get").value;
    z = false;
    getPoints();
    z = false;
    getCash();
    var j = Number(x);
    var k = Number(y);
    k = k + j;
    j = 0;
    x = "" + k;
    y = "" + j;
    pay(input, x);
    point(input, y);

}



function pay(username, cash) {

    var newKeyVals = jQuery.extend(true, {}, myKeyVals);

    newKeyVals.params.ctorMsg.args = [username, cash];
    newKeyVals.method = "invoke";
    newKeyVals.params.ctorMsg.function = "setCash";

    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(newKeyVals),
        dataType: "text",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)


            if (resultData.error == null || resultData.error == undefined) {

                $('#output5').append('<h1 class="text-success">Now ' + input + ' has $' + cash + '</h1>');

                console.log(resultData.result.message);
            } else {
                $('#output5').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

        }

    })


}

function point(username, points) {


    var newKeyVals = jQuery.extend(true, {}, myKeyVals);
    newKeyVals.params.ctorMsg.args = [username, points];
    newKeyVals.method = "invoke";
    newKeyVals.params.ctorMsg.function = "setPoints";

    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(newKeyVals),
        dataType: "text",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)


            if (resultData.error == null || resultData.error == undefined) {

                $('#output6').append('<h1 class="text-warning">Now ' + username + ' has ' + points + ' points </h1>');

                console.log(resultData.result.message);
            } else {
                $('#output6').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }


        }

    })


}