const hre = require('hardhat')
const { BigNumber } = require('ethers')

async function main() {
	const accounts = await hre.ethers.getSigners()

	// const WETH = await hre.ethers.getContractFactory('WETH9')
	// const weth = await WETH.deploy()
	// await weth.deployed()
	// console.log('WETH deployed to:', weth.address)

	// const woktAddress = '0x2219845942d28716c0f7c605765fabdca1a7d9e0' //okex_testnet
	const woktAddress = '0x70c1c53E991F31981d592C2d865383AC0d212225' //okex_testnet
    console.log('woktAddress:', woktAddress)

	const Router = await hre.ethers.getContractFactory('UniswapV2Router02')
	const factoryAddress = '0x38D509C14aC8a321CbC162DfA6A23f27f301c444'
	const router = await Router.deploy(factoryAddress, woktAddress)
	await router.deployed()
	console.log('Router deployed to:', router.address)
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
