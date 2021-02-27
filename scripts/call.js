const hre = require('hardhat')
const fs = require('fs')
const { BigNumber } = require('ethers')


async function main() {
    var accounts = await hre.ethers.getSigners()

    let routerAbi = getAbi('./artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json')
    let routerAddress = '0xA82C32D5132CDF2Ba0D16c56344266cE20D0b730'
    const router = new ethers.Contract(routerAddress, routerAbi, accounts[0])
    let factoryAdress = await router.factory()
    console.log('factoryAdress:', factoryAdress)

    let ERC20abi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')
    let tokenAAddress = '0x82EEeE5B615E2d0B87b0FB3042A6D7775CE3ec0F'
    const tokanA = new ethers.Contract(tokenAAddress, ERC20abi, accounts[0])

    let tokenBAddress = '0xcBC53632aF104AFDc16f602aeDDb7032d312Cf9A'
    const tokanB = new ethers.Contract(tokenBAddress, ERC20abi, accounts[0])

    let blockNumber = await hre.ethers.provider.getBlockNumber()
    let block = await hre.ethers.provider.getBlock(blockNumber)
    let deadline = BigNumber.from(block.timestamp + 3600*24)

    //添加流动性
    // await tokanA.approve(routerAddress, n(1000))
    // await tokanB.approve(routerAddress, n(2000))
    // await router.addLiquidity(tokenAAddress, tokenBAddress, n(1000), n(2000), n(0), n(0)
    //     , accounts[0].address, deadline, {gasLimit:BigNumber.from('8000000')})
        
    //用OKT添加流动性
    // await tokanA.approve(routerAddress, n(1000))
    // let deadline = BigNumber.from(parseInt(Date.now() / 1000) + 15)
    // await router.addLiquidityOKT(n(1000), n(0), n(0), accounts[0].address, deadline, {value:n(10)})
    
    //swap
    // await tokanA.connect(accounts[2]).approve(routerAddress, n(100))
    // await router.connect(accounts[2]).swapExactTokensForTokens(n(100), n(0), [tokenAAddress, tokenBAddress]
    // , accounts[2].address, deadline, {gasLimit:BigNumber.from('8000000')})
    
    //移除流动性
    await router.removeLiquidity(tokenAAddress, tokenBAddress, n(1414), n(0), n(0)
        , accounts[0].address, deadline, {gasLimit:BigNumber.from('8000000')})

    console.log('done')
}


async function deployERC() {
    let totalSupply = BigNumber.from('100000000000000000000000000') //1个亿
    let leeAddress = '0x662546Dcc9f158a9ABb4d1c3B369B07bC67969D6'
    const ERC20 = await hre.ethers.getContractFactory('ERC20')

    let token = await ERC20.deploy('OKB', totalSupply)
    await token.deployed()
    console.log('OKB deployed to:', token.address)
    await token.transfer(leeAddress, totalSupply.div(2))

    token = await ERC20.deploy('NAS', totalSupply)
    await token.deployed()
    console.log('NAS deployed to:', token.address)
    await token.transfer(leeAddress, totalSupply.div(2))

    token = await ERC20.deploy('USDT', totalSupply)
    await token.deployed()
    console.log('USDT deployed to:', token.address)
    await token.transfer(leeAddress, totalSupply.div(2))

    token = await ERC20.deploy('ETH', totalSupply)
    await token.deployed()
    console.log('ETH deployed to:', token.address)
    await token.transfer(leeAddress, totalSupply.div(2))

    //okex_testnet
    // OKB deployed to: 0xdb1e36369321BB83DAFcba75C20d427705Bf5b5f
    // NAS deployed to: 0xA65430bb7faC201825d84090dD254ea6DfE6CA5E
    // USDT deployed to: 0x82EEeE5B615E2d0B87b0FB3042A6D7775CE3ec0F
    // ETH deployed to: 0xcBC53632aF104AFDc16f602aeDDb7032d312Cf9A

    //bsc_testnet
    // USDT deployed to: 0x072777f02Ad827079F188D8175FB155b0e75343D
    // DAI deployed to: 0x36c2A57bdb0cE4082Da82a1a8E84aE5f490f0134
    // UNI deployed to: 0x9e9835e736199C72fc481D13339F3817B9cC8dAD
    // AAVE deployed to: 0xb01C941902a76553EEe31848c830b6552eD96679
}


async function transfer() {
    var accounts = await hre.ethers.getSigners()

    // let ERC20abi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')
    // let tokenAAddress = '0x82EEeE5B615E2d0B87b0FB3042A6D7775CE3ec0F'  //okex_testnet
    // const tokanA = new ethers.Contract(tokenAAddress, ERC20abi, accounts[0])
    // await tokanA.transfer(accounts[2].address, n(10000))

    // await accounts[0].sendTransaction({ to: accounts[2].address, value: n(10) })

    // let tokenBAddress = '0xcBC53632aF104AFDc16f602aeDDb7032d312Cf9A'  //okex_testnet
    // const tokanB = new ethers.Contract(tokenBAddress, ERC20abi, accounts[0])
    // await tokanB.transfer(accounts[2], n(10000))
}

async function balance() {
    var accounts = await hre.ethers.getSigners()

    let ERC20abi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')
    let tokenAAddress = '0x82EEeE5B615E2d0B87b0FB3042A6D7775CE3ec0F'
    let tokanA = new ethers.Contract(tokenAAddress, ERC20abi, accounts[0])
    console.log('tokanA account0 balance', (await tokanA.balanceOf(accounts[0].address)).toString())
    console.log('tokanA account1 balance', (await tokanA.balanceOf(accounts[1].address)).toString())
    console.log('tokanA account2 balance', (await tokanA.balanceOf(accounts[2].address)).toString())

    let tokenBAddress = '0xcBC53632aF104AFDc16f602aeDDb7032d312Cf9A'
    let tokanB = new ethers.Contract(tokenBAddress, ERC20abi, accounts[0])
    console.log('tokanB account0 balance', (await tokanB.balanceOf(accounts[0].address)).toString())
    console.log('tokanB account1 balance', (await tokanB.balanceOf(accounts[1].address)).toString())
    console.log('tokanB account2 balance', (await tokanB.balanceOf(accounts[2].address)).toString())
    console.log(accounts[2].address)
}


function getAbi(jsonPath) {
    let file = fs.readFileSync(jsonPath)
    let abi = JSON.parse(file.toString()).abi
    return abi
}

function n(amount) {
    return BigNumber.from('1000000000000000000').mul(amount)
}


balance()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
