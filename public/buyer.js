var URL = "https://b2177f8ca43f4a33a267933c58c56547-vp0.us.blockchain.ibm.com:5004/chaincode"
var myKeyVals = {
    "jsonrpc": "2.0",
    "method": "invoke",
    "params": {
        "type": 1,
        "chaincodeID": {
            "name": "a4e481b60b2e2d54861263f028758c93ecd9c9fc45072bc4b085fc7ec9c5c53cac4311759b376137b0d9ddc2944caaf13986935c52abe56acb55a348deb10a1d"
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


function pay(cash, points) {

    $('#output').empty();
    var input = document.getElementById("username").value;
    z = input;
    if (input === "") {
        $('#output').append('<h1 class="text-warning">Enter your username</h1>');
        return
    }

    getCash();
    sleep(1000);
    getPoints();
    sleep(1000);

    var i = Number(x);
    var j = Number(y);
    var k = Number(points);
    var l = Number(cash);
    var cashh = cash;
    var pointss = points;
    //$('#output').append('<h1 class="text-success">x='+x+' y='+y+' i='+i+' j='+j+' k='+k+' l='+l+'</h1>');
    i = i + k;
    j = j - l;
    points = "" + i;
    cash = "" + j;

    myKeyVals.params.ctorMsg.args = [input, cash];

    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        async: "false",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)


            if (resultData.error == null || resultData.error == undefined) {

                $('#output').append('<h1 class="text-success">' + input + ' has spent $' + cashh + ' and the remaing cash is $' + cash + '</h1>');

                console.log(resultData.result.message);
            } else {
                $('#output').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

            point(input, points, pointss);
        }

    })


}

function point(username, points, pointss) {

    $('#output2').empty();

    myKeyVals.params.ctorMsg.args = [username, points];
    myKeyVals.params.ctorMsg.function = "setPoints";

    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        async: "false",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)


            if (resultData.error == null || resultData.error == undefined) {

                $('#output2').append('<h1 class="text-warning">' + username + ' has won ' + pointss + ' points and the total points are ' + points + '</h1>');

                console.log(resultData.result.message);
            } else {
                $('#output2').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

        }

    })


}






function getPoints() {

    var input = document.getElementById("username").value;
    var newKeyVals = jQuery.extend(true, {}, myKeyVals);
    newKeyVals.method = "query";
    newKeyVals.params.ctorMsg.args = [input];
    newKeyVals.params.ctorMsg.function = "getPoints";
    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(newKeyVals),
        dataType: "text",
        async: "false",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)

            if (resultData.error == null || resultData.error == undefined) {
                if (resultData.result.message == null || resultData.result.message == undefined) {
                    $('#output1').append('<h1 class="text-warning">Buyer does not exist</h1>');
                } else {
                    var message = resultData.result.message.replace(/\"/g, "");
                    console.log(message);
                    x = message;
                    //  $('#output').append('<h1 class="text-success">getPoints '+x+ '</h1>');
                    return message;



                }


            } else {
                $('#output1').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)

            }

        }

    })
}
function getCash() {

    var input = document.getElementById("username").value;
    var newKeyVals = jQuery.extend(true, {}, myKeyVals);
    newKeyVals.method = "query";
    newKeyVals.params.ctorMsg.args = [input];
    newKeyVals.params.ctorMsg.function = "getCash";
    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(newKeyVals),
        dataType: "text",
        async: "false",
        success: function (resultData) {
            resultData = JSON.parse(resultData);
            console.log(resultData)

            if (resultData.error == null || resultData.error == undefined) {
                if (resultData.result.message == null || resultData.result.message == undefined) {
                    $('#output2').append('<h1 class="text-warning">Buyer does not exist</h1>');
                } else {
                    var message = resultData.result.message.replace(/\"/g, "");
                    console.log(message);

                    y = message;
                    //   $('#output').append('<h1 class="text-success">getCash '+y+ '</h1>');
                    return message;

                }


            } else {
                $('#output2').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data)
            }

        }


    })
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}