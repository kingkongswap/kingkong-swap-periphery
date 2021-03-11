const hre = require('hardhat')
const fs = require('fs')
const { BigNumber } = require('ethers')

const factoryAddress = '0x69268B5859E0E1081254ECe7399449685235047d'
const routerAddress = '0x1aDd5CF43EF5E50cA91784715cEfdd03B5ee59Bb'
const OKB = '0xda9d14072ef2262c64240da3a93fea2279253611' //官方
const NAS = '0x6FD9dB63dbC6BE452ae7B0Fe9995c81d967870Bb'
const DAI = '0x0586e702605d7206edD283D4311B38AEB579d7BC'
const USDT = '0xe579156f9decc4134b5e3a30a24ac46bb8b01281' //官方
const KKT = '0x4888097d1B29b439C55C6d3E44031eE658237dE3'

async function main() {
    var accounts = await hre.ethers.getSigners()

    await addLiquidity(KKT, USDT, 18, 10) //pair 0xc23F883d711846DEd91c4ABC6B6ceC004bE2c77c
    await delay(15)
    await addLiquidity(NAS, USDT, 18, 10)  //pair 0x240324f119a8159c9AA6ED107BA7244213524768
    await delay(15)
    await addLiquidityETH(KKT, 18) //pair 0xE63d2bc2945689126C514A8497b0c04E5C9f8446
    await delay(15)
    await addLiquidityETH(USDT, 10) //pair 0xfeE7E19eDC2D945103e64827cf4A81Ce649d9079
    await delay(15)
    await addLiquidityETH(OKB, 10) //pair 0x5c71B198c53E4FF06F2bcE6DeE283b28C014F9b2

    console.log('done')
}


async function addLiquidity(tokenAAddress, tokenBAddress, decimalsA, decimalsB) {
    var accounts = await hre.ethers.getSigners()

    let routerAbi = getAbi('./artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json')
    const router = new ethers.Contract(routerAddress, routerAbi, accounts[0])

    let ERC20abi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')
    const tokenA = new ethers.Contract(tokenAAddress, ERC20abi, accounts[0])
    const tokenB = new ethers.Contract(tokenBAddress, ERC20abi, accounts[0])

    let blockNumber = await hre.ethers.provider.getBlockNumber()
    let block = await hre.ethers.provider.getBlock(blockNumber)
    let deadline = BigNumber.from(block.timestamp + 3600 * 24)

    let balanceA = dpow(await tokenA.balanceOf(accounts[0].address), decimalsA)
    let balanceB = dpow(await tokenB.balanceOf(accounts[0].address), decimalsB)
    console.log('tokenA account0 balance', balanceA)
    console.log('tokenB account0 balance', balanceB)

    await tokenA.approve(routerAddress, pow(1, decimalsA))
    await tokenB.approve(routerAddress, pow(1, decimalsB))
    console.log('approve')
    await delay(15)

    // let allowance = await tokenA.allowance(accounts[0].address, routerAddress)
    // console.log('allowance a', dpow(allowance, decimalsA))
    // allowance = await tokenB.allowance(accounts[0].address, routerAddress)
    // console.log('allowance b', dpow(allowance, decimalsB))

    await router.addLiquidity(tokenAAddress, tokenBAddress, pow(1, decimalsA), pow(1, decimalsB), pow(0, decimalsA), pow(0, decimalsB)
        , accounts[0].address, deadline, { gasLimit: BigNumber.from('8000000') })

    console.log('addLiquidity done')
}


async function addLiquidityETH(tokenAddress, decimals) {
    var accounts = await hre.ethers.getSigners()

    let routerAbi = getAbi('./artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json')
    const router = new ethers.Contract(routerAddress, routerAbi, accounts[0])

    let ERC20abi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')
    const token = new ethers.Contract(tokenAddress, ERC20abi, accounts[0])

    let blockNumber = await hre.ethers.provider.getBlockNumber()
    let block = await hre.ethers.provider.getBlock(blockNumber)
    let deadline = BigNumber.from(block.timestamp + 3600 * 24)

    await token.approve(routerAddress, pow(1, decimals))
    console.log('approve')
    await delay(15)
    await router.addLiquidityETH(tokenAddress, pow(1, decimals), pow(0, decimals), pow(0, 18)
        , accounts[0].address, deadline, { value: pow(1, 18), gasLimit: BigNumber.from('8000000') })

    console.log('addLiquidityETH done')
}


async function viewPairs() {
    var accounts = await hre.ethers.getSigners()

    let factoryAbi = getAbi('./artifacts/@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol/IUniswapV2Factory.json')
    const factory = new ethers.Contract(factoryAddress, factoryAbi, accounts[0])
    console.log('Factory now feeTo:', await factory.feeTo())

    //查看池子
    let allPairsLength = (await factory.allPairsLength()).toNumber()
    console.log('allPairsLength:', allPairsLength)
    for (let i = 0; i < allPairsLength; i++) {
        let pairAddress = await factory.allPairs(i)

        let pairAbi = getAbi('artifacts/@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json')
        let pair = new ethers.Contract(pairAddress, pairAbi, accounts[0])
        console.log('pair address:', pairAddress)
    }

}


function getAbi(jsonPath) {
    let file = fs.readFileSync(jsonPath)
    let abi = JSON.parse(file.toString()).abi
    return abi
}


function pow(num, decimals) {
    return BigNumber.from(10).pow(decimals).mul(num)
}


function dpow(bn, decimals) {
    return bn.div(BigNumber.from(10).pow(decimals)).toString()
}

async function test() {
    console.log(pow(1000, 18).toString())
    console.log(dpow(BigNumber.from(10000), 3))
}

async function delay(sec) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec * 1000);
    })
}


viewPairs()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
