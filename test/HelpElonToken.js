const helpElonContract = artifacts.require("HelpElonToken");
var expect = require('chai').expect;

contract("HelpElonToken", (accounts) => {	
	let [alice, bob] = accounts;
	let contractInstance;

	beforeEach(async () => {
		contractInstance = await helpElonContract.new({from: alice});
	});

	context("testing basic coin attributes", async () => {
	        const name = "HELPELON";
		const symbol = "$HELPELON";
		const decimals = 16;
		it("testing coin name", async ()=> {
			const result = await contractInstance.name.call();
			expect(result).to.be.a("string");
			expect(result).to.equal(name);
		})
		it("testing coin symbol", async ()=> {
			const result = await contractInstance.symbol.call();
			expect(result).to.be.a("string");
			expect(result).to.equal(symbol);
		})
		it("testing decimal places", async ()=> {
			const result = await contractInstance.decimals.call();
			expect(result).to.be.a("number");
			assert.equal(result.valueOf(), decimals);
		})
	})
	it("should be able to mint specified number of tokens", async () => {
		const mintCoins = 1000;
		await contractInstance.mint(alice, mintCoins, {from: alice});
		const result = await contractInstance.totalSupply.call();
		assert.equal(result.valueOf(), mintCoins);
	})
})
