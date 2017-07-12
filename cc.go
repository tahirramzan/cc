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

type LoyaltyChaincode struct {
}

type Buyer struct {
	Name   string `json:"name"`
	Cash   int `json:"cash"`
	Points int `json:"points"`
}

// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(LoyaltyChaincode))
	if err != nil {
		fmt.Printf("(1) Error starting chaincode: %s", err)
	}
}

// Init resets all the things
func (t *LoyaltyChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	if len(args) != 1 {
		return nil, errors.New("(2) Incorrect number of arguments: Expecting 1")
	}

	err := stub.PutState("Loyalty Chaincode", []byte(args[0]))
	if err != nil {
		return nil, err
	}
	t.initUser(stub, args)

	return nil, nil
}

// Invoke is our entry point to invoke a chaincode function
func (t *LoyaltyChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("(3) Invoke is running: " + function)

	// Handle different functions
	if function == "init" {
		return t.Init(stub, "init", args)
	} else if function == "write" {
		return t.write(stub, args)
	} else if function == "initUser" {
		return t.initUser(stub, args)
	} else if function == "setCash" {
		return t.setCash(stub, args)
	} else if function == "setPoints" {
		return t.setPoints(stub, args)
	}
	fmt.Println("(4) Invoke did not find function: " + function)

	return nil, errors.New("(5) Received unknown function invocation: " + function)
}

// Query is our entry point for queries
func (t *LoyaltyChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("(6) Query is running: " + function)

	// Handle different functions
	if function == "read" { 
		return t.read(stub, args)
	} else if function == "getCash" {
		return t.getCash(stub, args)
	} else if function == "getPoints" {
		return t.getPoints(stub, args)
	}

	fmt.Println("(7) Query did not find function: " + function)

	return nil, errors.New("(8) Received unknown function query: " + function)
}

// function for testing writing to blockchain
func (t *LoyaltyChaincode) write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var key, value string
	var err error
	fmt.Println("(9) Running write()")

	if len(args) != 2 {
		return nil, errors.New("(10) Incorrect number of arguments. Expecting 2, name of the key and value to set")
	}

	key = args[0] 
	value = args[1]
	err = stub.PutState(key, []byte(value)) 
	if err != nil {
		return nil, err
	}
	return nil, nil
}

// function for testing reading key from blockchain
func (t *LoyaltyChaincode) read(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var key, jsonResp string
	var err error
	fmt.Println("(11) Running read()")

	if len(args) != 1 {
		return nil, errors.New("(12)Incorrect number of arguments. Expecting 1, name of the key to query")
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
func (t *LoyaltyChaincode) initUser(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error
	rand.Seed(time.Now().UnixNano())
	key := rand.Int()
	fmt.Println("(13) Running initUser()")

	if len(args) != 1 {
		return nil, errors.New("(14) Incorrect number of arguments. Expecting 1")
	}

	//input sanitation
	fmt.Println("- Starting init user")
	if len(args[0]) <= 0 {
		return nil, errors.New("(15) Argument must be a non-empty string")
	}

	name := args[0]
	cash := 1000
	points := 0

	userAsBytes, err := stub.GetState(args[0])
	res := Buyer{}
	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name == args[0] {
		return nil, errors.New("(16) Buyer already exists")
	}

	//build the user json string manually
	str := `{"name": "` + name + `", "key": "` + strconv.Itoa(key) + `", "cash": "` + strconv.Itoa(cash)  + `", "points": "` + strconv.Itoa(points) + `"}`
	fmt.Println(str)
	err = stub.PutState(name, []byte(str)) //store user with id as key
	if err != nil {
		return nil, err
	}

	fmt.Println("- end init user")
	return []byte(str), nil
}

func (t *LoyaltyChaincode) setCash(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	if len(args) < 2 {
		return nil, errors.New("(17) Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("- start setcash")
	fmt.Println(args[0] + " - " + args[1])
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("(18) Failed to get buyer")
	}
	res := Buyer{}
	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	if res.Name != args[0] {
		return nil, errors.New("(19) Buyer does not exist")
	}
	res.Cash, err = strconv.Atoi(args[1]) 
	if err != nil {
		return nil, errors.New("(20) Cash could not be parsed")
	}

	jsonAsBytes, _ := json.Marshal(res)
	fmt.Println(jsonAsBytes)
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the user
	if err != nil {
		return nil, err
	}

	fmt.Println("- end setcash")
	return nil, nil
}

func (t *LoyaltyChaincode) setPoints(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	if len(args) < 2 {
		return nil, errors.New("(21) Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("- start set Points")
	fmt.Println(args[0] + " - " + args[1])
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("(22) Failed to get buyer")
	}
	res := Buyer{}
	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name != args[0] {
		return nil, errors.New("(23) Buyer does not exist")
	}
	res.Points, err = strconv.Atoi(args[1]) //change the points
	if err != nil {
		return nil, errors.New("(24) Points could not be parsed")
	}

	jsonAsBytes, _ := json.Marshal(res)
	fmt.Println(jsonAsBytes)
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the user
	if err != nil {
		return nil, err
	}

	fmt.Println("- end setPoints")
	return nil, nil
}

func (t *LoyaltyChaincode) getPoints(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	if len(args) != 1 {
		return nil, errors.New("(25) Incorrect number of arguments. Expecting 1")
	}

	fmt.Println("- start getPoints")
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("(26) Failed to get buyer")
	}
	res := Buyer{}

	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name != args[0] {
		return nil, errors.New("(27) Buyer does not exist")
	}

	jsonAsBytes, _ := json.Marshal(res.Points)
	fmt.Println(jsonAsBytes)
	fmt.Println("- end getPoints")
	return jsonAsBytes, nil

}

func (t *LoyaltyChaincode) getCash(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	if len(args) != 1 {
		return nil, errors.New("(28) Incorrect number of arguments. Expecting 1")
	}

	fmt.Println("- start getCash")
	userAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return nil, errors.New("(29) Failed to get buyer")
	}
	res := Buyer{}

	json.Unmarshal(userAsBytes, &res) //un stringify it aka JSON.parse()
	fmt.Println(res)
	if res.Name != args[0] {
		return nil, errors.New("(30) Buyer does not exist")
	}

	jsonAsBytes, _ := json.Marshal(res.Cash)
	fmt.Println(jsonAsBytes)
	fmt.Println("- end getCash")
	return jsonAsBytes, nil

}
