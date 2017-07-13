var URL = "https://913f1b7b46ae448391fed6eec75b1948-vp0.us.blockchain.ibm.com:5003/chaincode"
var myKeyVals = {
    "jsonrpc": "2.0",
    "method": "invoke",
    "params": {
        "type": 1,
        "chaincodeID": {
            "name": "0e11ff13ea3f6eb74252b43b8d3dec09f632f8144d40ce564eb243b59e427def745aca7db9d92be6b5bbd7fad2d6ebde566a82f1a27d6f7900082d1fca2657f4"
        },
        "ctorMsg": {
            "function": "setCash",
            "args": [
                "gh", "500"
            ]
        },
        "secureContext": "user_type1_0"
    },
    "id": 2
};
var user = "test";

function pay(cash, points) {

    $('#output').empty();
    var input = document.getElementById("username").value;
    if (input === "") {
        $('#output').append('<h1 class="text-warning">Enter your username</h1>');
        return
    }
    myKeyVals.params.ctorMsg.args = [input, cash];

    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)


            if (resultData.error == null || resultData.error == undefined) {

                $('#output').append('<h1 class="text-success">' + input + ' has spent $' + cash + '</h1>');

                console.log(resultData.result.message);
            } else {
                $('#output').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

            point(input, points);
        }

    })


}

function point(username, points) {

    $('#output2').empty();

    myKeyVals.params.ctorMsg.args = [username, points];
    myKeyVals.params.ctorMsg.function = "setPoints";

    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)


            if (resultData.error == null || resultData.error == undefined) {

                $('#output2').append('<h1 class="text-warning">' + username + ' has won ' + points + ' points </h1>');

                console.log(resultData.result.message);
            } else {
                $('#output2').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

        }

    })


}