/*
Author - Ivaylo Lafchiev (2090886)
Final design of consent management system
*/

package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

// User simple User implementation
type User struct {
	Name      string `json:"name"`
	Consent   bool   `json:"consent"`
	Withdrawl bool   `json:"withdrawl"`
}

// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Init resets all the things
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	err := stub.PutState("hello_world", []byte(args[0]))
	if err != nil {
		return nil, err
	}
	t.initUser(stub, args)

	return nil, nil
}

// Invoke is our entry point to invoke a chaincode function
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init" {
		return t.Init(stub, "init", args)
	} else if function == "write" {
		return t.write(stub, args)
	} else if function == "initUser" {
		return t.initUser(stub, args)
	} else if function == "setConsent" {
		return t.setConsent(stub, args)
	} else if function == "setWithdrawl" {
		return t.setWithdrawl(stub, args)
	}
	fmt.Println("invoke did not find func: " + function)

	return nil, errors.New("Received unknown function invocation: " + function)
}

// Query is our entry point for queries
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	if function == "read" { //read a variable
		return t.read(stub, args)
	} else if function == "getWithdrawl" {
		return t.getWithdrawl(stub, args)
	}

	fmt.Println("query did not find func: " + function)

	return nil, errors.New("Received unknown function query: " + function)
}

// function for testing writing to blockchain
func (t *SimpleChaincode) write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var key, value string
	var err error
	fmt.Println("running write()")

	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2. name of the key and value to set")
	}

	key = args[0] //rename for fun
	value = args[1]
	err = stub.PutState(key, []byte(value)) //write the variable into the chaincode state
	if err != nil {
		return nil, err
	}
	return nil, nil
}

// function for testing reading key from blockchain
func (t *SimpleChaincode) read(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var key, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the key to query")
	}

	key = args[0]
	valAsbytes, err := stub.GetState(key)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + key + "\"}"
		return nil, errors.New(jsonResp)
	}

	return valAsbytes, nil
}

// initalise a user
func (t *SimpleChaincode) initUser(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error
	rand.Seed(time.Now().UnixNano())
	key := rand.Int()

	//   0
	// "bob"
	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	//input sanitation
	fmt.Println("- start init user")
	if len(args[0]) <= 0 {
		return nil, errors.New("argument must be a non-empty string")
	}

	name := args[0]
	consent := false
	withdrawl := false

	userAsBytes, err := stub.GetState(args[0])
	res := User{}
	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name == args[0] {
		return nil, errors.New("User already exists")
	}

	//build the user json string manually
	str := `{"name": "` + name + `", "key": "` + strconv.Itoa(key) + `", "consent": "` + strconv.FormatBool(consent) + `", "withdrawl": "` + strconv.FormatBool(withdrawl) + `"}`
	fmt.Println(str)
	err = stub.PutState(name, []byte(str)) //store user with id as key
	if err != nil {
		return nil, err
	}

	fmt.Println("- end init user")
	return []byte(str), nil
}

// set the consent of the user to true or false
func (t *SimpleChaincode) setConsent(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	//   0       1
	// "name", "true/false"
	if len(args) < 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("- start set user")
	fmt.Println(args[0] + " - " + args[1])
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("Failed to get user")
	}
	res := User{}
	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	if res.Name != args[0] {
		return nil, errors.New("User does not exist")
	}
	res.Consent, err = strconv.ParseBool(args[1]) //change the consent
	if err != nil {
		return nil, errors.New("Conesnt could not be parsed")
	}

	jsonAsBytes, _ := json.Marshal(res)
	fmt.Println(jsonAsBytes)
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the user
	if err != nil {
		return nil, err
	}

	fmt.Println("- end set consent")
	return nil, nil
}

// withdraw user from study
func (t *SimpleChaincode) setWithdrawl(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	//   0       1
	// "name", "true/false"
	if len(args) < 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("- start set withdrawl")
	fmt.Println(args[0] + " - " + args[1])
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("Failed to get user")
	}
	res := User{}
	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name != args[0] {
		return nil, errors.New("User does not exist")
	}
	res.Withdrawl, err = strconv.ParseBool(args[1]) //change the withdrawl
	if err != nil {
		return nil, errors.New("Conesnt could not be parsed")
	}

	jsonAsBytes, _ := json.Marshal(res)
	fmt.Println(jsonAsBytes)
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the user
	if err != nil {
		return nil, err
	}

	fmt.Println("- end set consent")
	return nil, nil
}

// get the withdrawl status of a user
func (t *SimpleChaincode) getWithdrawl(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	//   0
	// "name",
	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	fmt.Println("- start get withdrawl")
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("Failed to get user")
	}
	res := User{}

	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name != args[0] {
		return nil, errors.New("User does not exist")
	}

	jsonAsBytes, _ := json.Marshal(res.Withdrawl)
	fmt.Println(jsonAsBytes)
	fmt.Println("- end get key")
	return jsonAsBytes, nil

}
