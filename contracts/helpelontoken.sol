pragma solidity >=0.5.0 <0.6.0;

import "./context.sol";
import "./ownable.sol";
import "./bep20.sol";
import "./safemath.sol";
import "./tokenhelper.sol";

contract HelpElonToken is Ownable, BEP20, TokenHelper {

	using SafeMath for uint256;

	mapping (address => uint256) private _balances;
	
	mapping (address => mapping (address => uint256)) private _allowances;

	uint256 private _totalSupply;
	uint8 private _decimals;
	string private _name;
	string private _symbol;
	
	//TODO change placeholder values
	constructor {
		_name = "HELPELON";
		_symbol = "$HELPELON";
		_totalSupply = 100;
		_decimals = 8;
		address msgSender = _msgSender();
		_balances[msgSender] = _totalSupply;

		emit Transfer(address(0), msgSender, _totalSupply);
	}

	modfier validSpender(address _tokenOwner, uint256 _value) {
                address spender = _msgSender();
                require(spender == tokenOwner || _allowances[_tokenOwner][spender] >= _value);
		_;
	}

	function getOwner() external view returns (address) {
		return owner();
	}

	function name() public view returns (string memory) {
		return _name;
	}

	function symbol() public view returns (string memory) {
		return _owner;
	}

	function totalSupply() public view returns (string memory) {
		return _totalSupply;
	}
	
	function decimals() public view returns (uint8) {
		return _decimals;
	}	modifier validTransaction(address _recipient, uint256 _value) {
		address memory sender = _msgSender();
		require(sender != address(0));
		require(recipient != address(0));
		uint256 memory senderBalance = _balances[sender];
		require(senderBalance >= _value);
		_;
	}

	function balanceOf(address _owner) public view returns (uint256) {
		return _balances[_owner];
	}

	function _transfer(address _from, address _to, uint256 _value) internal validAddresses(_from, _to), validTransaction(_from, _value) {
		_balances[_from] = _balances[sender].sub(_value);
		_balances[_to] = _balances[_to].add(_value);

		emit Transfer(sender, _to, _value);
	}

	function transfer(address _to, uint256 _value) external returns (bool) {
		_transfer(_msgSender(), _to, _value);
		return true;
	}

	function _approve(address _approver, address _spender, uint256 _value) private validAdresses(_approver, _spender) {
		_allowances[_approver][_spender] = _value;
		
		emit Approval(_approver, _spender, _value);
	}

	function approve(address _spender, uint256 _value) public returns (bool) {
		address approver = _msgSender();
		_approve(approver, _spender, _value);
		return true;
	}

	function allowance(address _owner, address _spender) external view returns (uint256) {
		return _allowances[_owner][_spender];
	}

	function transferFrom(address _from, address _to, uint256 _value) external validSpender(_from, _value) returns (bool) {
		address spender = _msgSpender();
		_transfer(_from, _to, _value);
		_approve(_from, spender, _allowances[_from][_spender].sub(_value));	
	}

}
