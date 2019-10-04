pragma solidity ^0.5.0;

contract Stateless {

    address[16] public verifiers;

function verify(uint humanId) public returns (uint) {
  require(humanId >= 0 && humanId <= 15);

  verifiers[humanId] = msg.sender;

  return humanId;
}

// Retrieving the verifiers
function getVerifiers() public view returns (address[16] memory) {
  return verifiers;
}

}
