var URL = "https://b2177f8ca43f4a33a267933c58c56547-vp0.us.blockchain.ibm.com:5004/chaincode"
var myKeyVals =       {
        "jsonrpc": "2.0",
        "method": "query",
        "params": {
            "type": 1,
            "chaincodeID": {
            "name": "a4e481b60b2e2d54861263f028758c93ecd9c9fc45072bc4b085fc7ec9c5c53cac4311759b376137b0d9ddc2944caaf13986935c52abe56acb55a348deb10a1d"
            },
            "ctorMsg": {
            "function": "getCash",
            "args": [
                "test"
            ]
            },
            "secureContext": "user_type1_0"
        },
        "id": 2
    }

var user = "test";

function getPoints() {
     $('#output1').empty();
    var input = document.getElementById("get1").value;
    var myKeyVals1 = jQuery.extend(true, {}, myKeyVals);
    myKeyVals1.params.ctorMsg.args = [input];
    myKeyVals1.params.ctorMsg.function ="getPoints";
    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals1),
        dataType: "text",
        success: function(resultData) { 
            resultData = JSON.parse(resultData);
            console.log(resultData)
           
            if (resultData.error == null || resultData.error == undefined) { 
                if (resultData.result.message == null || resultData.result.message == undefined) {
                     $('#output1').append('<h1 class="text-warning">Buyer does not exist</h1>');
                }
                else {
                    var message = resultData.result.message.replace(/\"/g, "");
                    console.log (message);
                    
                        $('#output1').append('<h1 class="text-danger">Buyer has Points = '+message+'</h1>');
                    
                  
                }

  
            }
            else {
                $('#output1').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data) 
            }
             
        }

    })
}
function getCash() {
     $('#output2').empty();
    var input = document.getElementById("get2").value;
    var myKeyVals2 = jQuery.extend(true, {}, myKeyVals);
    myKeyVals2.params.ctorMsg.args = [input];
    myKeyVals2.params.ctorMsg.function = "getCash";
    $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals2),
        dataType: "text",
        success: function(resultData) { 
            resultData = JSON.parse(resultData);
            console.log(resultData)
           
            if (resultData.error == null || resultData.error == undefined) { 
                if (resultData.result.message == null || resultData.result.message == undefined) {
                     $('#output2').append('<h1 class="text-warning">Buyer does not exist</h1>');
                }
                else {
                    var message = resultData.result.message.replace(/\"/g, "");
                    console.log (message);
                    
                        $('#output2').append('<h1 class="text-danger">Buyer has Cash = '+message+'</h1>');
                    
                  
                }

  
            }
            else {
                $('#output2').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data) 
            }
             
        }

    })
}


function initUser() {
    $('#output3').empty();
    var newKeyVals = jQuery.extend(true, {}, myKeyVals);
    var input = document.getElementById("create").value;
    newKeyVals.params.ctorMsg.args = [input];
    newKeyVals.params.ctorMsg.function = "initUser";
    newKeyVals.method = "invoke";
     $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(newKeyVals),
        dataType: "text",
        success: function(resultData) { 
            resultData = JSON.parse(resultData);
            console.log(resultData)
            
            if (resultData.error == null || resultData.error == undefined) {
                
                $('#output3').append('<h1 class="text-success">Buyer successfully created  "' + input +' "</h1>');
                console.log(resultData.result.message);
            }
            else {
                $('#output3').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data) 
            }
             
        }

    })
}
