pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Stateless.sol";

contract TestStateless {
 // The address of the Stateless contract to be tested
 Stateless stateless = Stateless(DeployedAddresses.Stateless());

 // The id of the profile that will be used for testing
 uint expectedhumanId = 8;

 //The expected verifier of the profile is this contract
 address expectedVerifier = address(this);

 // Testing the verify() function
 function testUserCanVerifyProfile() public {
   uint returnedId = stateless.verify(expectedhumanId);

   Assert.equal(returnedId, expectedhumanId, "The verifier of the expected profile should match what is returned.");
 }

// Testing retrieval of a single profile's verifier
function testGetVerifierAddressByhumanId() public {
  address verifier = stateless.verifiers(expectedhumanId);

  Assert.equal(verifier, expectedVerifier, "Verifier of the expected profile should be this contract");
}

// Testing retrieval of all profile verifiers
function testGetVerifierAddressByhumanIdInArray() public {
  // Store verifiers in memory rather than contract's storage
  address[16] memory verifiers = stateless.getVerifiers();

  Assert.equal(verifiers[expectedhumanId], expectedVerifier, "Verifier of the expected profile should be this contract");
}

}
