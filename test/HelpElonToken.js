const helpElonContract = artifacts.require("HelpElonToken");

contract("HelpElonToken", (accounts) => {
	let [alice, bob] = accounts;
	
	let contractInstance;

	beforeEach(async () => {
		contractInstance = await helpElonContract.new({from: alice});
	});

	it("should be able to mint tokens", async () => {
		await contractInstance.mint(alice, 1000, {from: alice});
		const result = await contractInstance.totalSupply.call();
		//console.log(result.toNumber());
		assert.equal(result.valueOf(), 1000);
	})
})
