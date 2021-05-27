const helpElonContract = artifacts.require("HelpElonToken");

const name = "HELPELON";
const symbol = "$HELPELON";
const decimals = 8;
const totalSupply = 100;

contract("HelpElonToken", (accounts) => {
	
	it("should be able to receive Ethers", async () => {
		const contractInstance = await helpElonContract.new();
		let [alice, bob] = accounts;
	})
})
