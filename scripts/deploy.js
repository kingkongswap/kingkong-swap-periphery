// We require the Hardhat Runtime Environment explicitly here. This is optional 
const hre = require('hardhat')

async function main() {
	const accounts = await hre.ethers.getSigners()

	const WETH = await hre.ethers.getContractFactory('WETH9')
	const weth = await WETH.deploy()
	await weth.deployed()
	console.log('WETH deployed to:', weth.address)

	const Router = await hre.ethers.getContractFactory('UniswapV2Router02')
	const factoryAddress = '0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953'
	const router = await Router.deploy(factoryAddress, weth.address)
	await router.deployed()
	console.log('Router deployed to:', router.address)

	//localhost
	// Factory deployed to: 0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953
	// WETH deployed to: 0x7bdd3b028C4796eF0EAf07d11394d0d9d8c24139
	// Router deployed to: 0xB468647B04bF657C9ee2de65252037d781eABafD

	//okex_testnet
	// Factory deployed to: 0x4502F7BcC6D4Fd03A50c83EDF18e3B20b9570682
	// WETH deployed to: 0x71E890F2C144e81026A6413AD20E5635E2c3D36A
	// Router deployed to: 0xA82C32D5132CDF2Ba0D16c56344266cE20D0b730
	
	//bsc_testnet
	// Factory deployed to: 0x7B6a4fe1cBe55049CbDa9719E60AeE7471A5f02F
	// WETH deployed to: 0xC20DA87779aC7C9ff764667f6B81c46A0a0131E0
	// Router deployed to: 0x996E6d5042Ea9708E85a1D7E59Bb434BFb999bD2
	// INIT_CODE_PAIR_HASH: 0x78f09162e93227e9b60ba10199ebab3d099ac00ebac04f9e1a23ddc35d7f6c21
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
