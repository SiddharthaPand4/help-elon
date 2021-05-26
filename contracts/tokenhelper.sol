pragma solidity >=0.5.0 <0.6.0;

import "./context.sol";

contract TokenHelper is Context {
	
	modifier validTransaction(address _sender, int256 _value) {
		uint256 senderBalance = _balances[_sender];
		require(senderBalance >= _value);
		_;
	}

	modifier validAdresses(address _sender, address _recipient) {
		address sender = _msgSender();
		require(sender != address(0));
		require(recipient != address(0));
		_;
	}

}	
