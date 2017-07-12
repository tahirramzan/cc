var URL = "https://6afa032b40c547598274b7d497584789-vp0.us.blockchain.ibm.com:5004/chaincode"
var myKeyVals =       {
        "jsonrpc": "2.0",
        "method": "invoke",
        "params": {
            "type": 1,
            "chaincodeID": {
            "name": "b650b145904926edeb57bbb8e19c8e9943ea26198be44a1f9eb7f26c45196fd8fc79d78ee8556ea5f1c74f89d10b73cc662e72c16b684d53794f32f1ca5a0449"
            },
            "ctorMsg": {
            "function": "setCash",
            "args": [
                "test"
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
    myKeyVals.params.ctorMsg.args = "[\""+input+"\"\,\""+cash+"\"]";
     $('#output').append(myKeyVals.params.ctorMsg.args);
     
    $.ajax({        
        type: "POST",
        url: URL,
        data: JSON.stringify(myKeyVals),
        dataType: "text",
        success: function(resultData) { 
            resultData = JSON.parse(resultData);
            console.log(resultData)
           
            
            if (resultData.error == null || resultData.error == undefined) {
               
                    $('#output').append('<h1 class="text-success">' + input + 'has spent $'+cash+' and won '+ points+'</h1>');
                
                console.log(resultData.result.message);
            }
            else {
                $('#output').append('<h1 class="text-danger">Error</h1><p class="lead">' + resultData.error.data + '</p>');
                console.log(resultData.error.data) 
            }
             
        }

    })
}