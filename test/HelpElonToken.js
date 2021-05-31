const helpElonContract = artifacts.require("HelpElonToken");
const expect = require('chai').expect;
const utils = require("./helpers/utils");

contract("HelpElonToken", (accounts) => {	
	let [alice, bob, denise, lewis] = accounts;
	let contractInstance;

	beforeEach(async () => {
		contractInstance = await helpElonContract.new({from: alice});
		await contractInstance.mint(alice, 10000, {from: alice});
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
			expect(result.toNumber()).to.be.a("number");
			expect(result.toNumber()).to.equal(decimals);
		})
	})
	it("should be able to mint specified number of tokens", async () => {
		const prevSupply = await contractInstance.totalSupply.call();
		const mintCoins = 1000;
		const expectedSupply = mintCoins + prevSupply.toNumber();
		await contractInstance.mint(alice, mintCoins, {from: alice});
		const result = await contractInstance.totalSupply.call();
		expect(result.toNumber()).to.equal(expectedSupply);
	})
	context("checking balances, transfer and approval", async ()=> {
		it("should approve a spender with an amount", async() => {
			const approvalValue = 500;
			const result = await contractInstance.approve(bob, approvalValue);
			const approval = await contractInstance.allowance.call(alice, bob);
			expect(approvalValue, approval.toNumber());
		})
		it("should transfer the amount specified directly and test overspend", async ()=> {
			let result;
			result = await contractInstance.balanceOf(bob);
			const bobPrevBal = result.toNumber();
			result = await contractInstance.balanceOf(alice);
			const alicePrevBal = result.toNumber();
			const amountToSend = 100;
			await utils.shouldThrow(contractInstance.transfer(bob, alicePrevBal + 1));
			result = await contractInstance.transfer(bob, amountToSend);
			result = await contractInstance.balanceOf(bob);
			const bobNewBal = result.toNumber();
			result = await contractInstance.balanceOf(alice);
			const aliceNewBal = result.toNumber();
			expect(bobNewBal).to.equal(bobPrevBal + amountToSend);
			expect(aliceNewBal).to.equal(alicePrevBal - amountToSend);
		})
		it("should transfer the specified amount through approved sender and test overspending and wrong spender", async ()=> {
			let result;
			const approvalAmount = 100;
			result = await contractInstance.approve(bob, approvalAmount, {from: alice});
			result = await contractInstance.balanceOf(denise);
			const deniseOldBal = result.toNumber();
			result = await contractInstance.balanceOf(alice);
			const aliceOldBal = result.toNumber();
			const transferAmount = 60;
			const aboveApprovalAmount = approvalAmount + 1;
			result = await contractInstance.transferFrom(alice, denise, transferAmount, {from: bob});
			await utils.shouldThrow(contractInstance.transferFrom(alice, denise, aboveApprovalAmount, {from: bob}));
			await utils.shouldThrow(contractInstance.transferFrom(alice, denise, transferAmount, {from: lewis}));
			result = await contractInstance.balanceOf(denise);
			const deniseNewBal = result.toNumber();
			result = await contractInstance.balanceOf(alice);
			const aliceNewBal = result.toNumber();
			expect(aliceNewBal).to.equal(aliceOldBal - transferAmount);
			expect(deniseNewBal).to.equal(deniseOldBal +  transferAmount);
		})
	})
	context("test ownership related functions", async () => {
		it("should transfer ownership", async ()=> {
			const owner = await contractInstance.owner();
			let result = await contractInstance.transferOwnership(bob, {from: owner});
			// now new owner is bob
			const newOwner = await contractInstance.owner();
			expect(newOwner).to.equal(bob);
			// test if non owner can transfer ownership
			await utils.shouldThrow(contractInstance.transferOwnership(alice, {from: alice}));
		})
		it("should be able to renounce ownership", async ()=> {
			const owner = await contractInstance.owner();
			await utils.shouldThrow(contractInstance.renounceOwnership({from: denise}));
			let result = await contractInstance.renounceOwnership({from: owner});
			const newOwner = await contractInstance.owner();
			expect(newOwner).to.not.equal(owner);
		})
		it("check if it returns actual owner", async ()=> {
			const owner = await contractInstance.owner();
			let result = await contractInstance.transferOwnership(denise, {from: owner});
			const newOwner = await contractInstance.owner();
			expect(newOwner).to.equal(denise);
		})
	})
})
