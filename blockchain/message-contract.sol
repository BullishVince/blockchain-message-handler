// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract MessageContract {
  string message = "Hello World";
  
  // Add this function:
  function getMessage() public view returns(string memory) {
    return message;
  }
  
  function changeMessage(string memory _newMessage) public {
    message = _newMessage;
  }
}