const hre = require('hardhat')
const { BigNumber } = require('ethers')

async function main() {
	const accounts = await hre.ethers.getSigners()

	// const WETH = await hre.ethers.getContractFactory('WETH9')
	// const weth = await WETH.deploy()
	// await weth.deployed()
	// console.log('WETH deployed to:', weth.address)

	const woktAddress = '0x2219845942d28716c0f7c605765fabdca1a7d9e0' //okex_testnet

	const Router = await hre.ethers.getContractFactory('UniswapV2Router02')
	const factoryAddress = '0xDcAA842dC9515CA4d2bB939d8AF96DD1e8607482'
	const router = await Router.deploy(factoryAddress, woktAddress)
	await router.deployed()
	console.log('Router deployed to:', router.address)

	//localhost
	// Factory deployed to: 0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953
	// WETH deployed to: 0x7bdd3b028C4796eF0EAf07d11394d0d9d8c24139
	// Router deployed to: 0xB468647B04bF657C9ee2de65252037d781eABafD

	//okex_testnet
	// Factory deployed to: 0x69268B5859E0E1081254ECe7399449685235047d
	// WOKT deployed to: 0x2219845942d28716c0f7c605765fabdca1a7d9e0
	// Router deployed to: 0x1aDd5CF43EF5E50cA91784715cEfdd03B5ee59Bb
	
	//bsc_testnet
	// Factory deployed to: 0x7B6a4fe1cBe55049CbDa9719E60AeE7471A5f02F
	// WETH deployed to: 0xC20DA87779aC7C9ff764667f6B81c46A0a0131E0
	// Router deployed to: 0x996E6d5042Ea9708E85a1D7E59Bb434BFb999bD2
	// INIT_CODE_PAIR_HASH: 0x78f09162e93227e9b60ba10199ebab3d099ac00ebac04f9e1a23ddc35d7f6c21
}


async function deployERC() {
    let totalSupply = m(100000000) //1个亿
    let amount = m(20000)
    let user1 = '0x662546Dcc9f158a9ABb4d1c3B369B07bC67969D6'
    let user2 = '0x3A40066D1dC27d14C721e4135cF02DCb20C9AFE0'
    let user3 = '0x011EBb673b8e7e042C42121CCA062FB7b27BdCFE'
    const ERC20 = await hre.ethers.getContractFactory('ERC20')

    let token = await ERC20.deploy('OKB', totalSupply, 18)
    await token.deployed()
    console.log('OKB deployed to:', token.address)
    await token.transfer(user1, amount)
    await token.transfer(user2, amount)
    await token.transfer(user3, amount)

    token = await ERC20.deploy('NAS', totalSupply, 18)
    await token.deployed()
    console.log('NAS deployed to:', token.address)
    await token.transfer(user1, amount)
    await token.transfer(user2, amount)
    await token.transfer(user3, amount)
    
    token = await ERC20.deploy('DAI', totalSupply, 18)
    await token.deployed()
    console.log('DAI deployed to:', token.address)
    await token.transfer(user1, amount)
    await token.transfer(user2, amount)
    await token.transfer(user3, amount)

    totalSupply = totalSupply.div(1000000000000)
    token = await ERC20.deploy('USDT', totalSupply, 6)
    await token.deployed()
    console.log('USDT deployed to:', token.address)
    amount = amount.div(1000000000000)
    await token.transfer(user1, amount)
    await token.transfer(user2, amount)
    await token.transfer(user3, amount)

	console.log('decimals', await token.decimals())
	console.log('balance', await token.balanceOf(user3).toString())

    //okex_testnet
    // OKB deployed to: 0xf8542108F7922A7ef71BF3C7Fd60B81d3245eD31
	// NAS deployed to: 0x6FD9dB63dbC6BE452ae7B0Fe9995c81d967870Bb
	// DAI deployed to: 0x0586e702605d7206edD283D4311B38AEB579d7BC
	// USDT deployed to: 0xB53CB1feEbea105C30982e7f2Ed803a2195DA922

    //bsc_testnet
    // USDT deployed to: 0x072777f02Ad827079F188D8175FB155b0e75343D
    // DAI deployed to: 0x36c2A57bdb0cE4082Da82a1a8E84aE5f490f0134
    // UNI deployed to: 0x9e9835e736199C72fc481D13339F3817B9cC8dAD
    // AAVE deployed to: 0xb01C941902a76553EEe31848c830b6552eD96679
}

function m(num) {
    return BigNumber.from('1000000000000000000').mul(num)
}

function d(bn) {
    return bn.div('1000000000').toNumber() / 1000000000
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
