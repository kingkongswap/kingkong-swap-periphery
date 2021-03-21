const hre = require('hardhat')
const fs = require('fs')
const { BigNumber } = require('ethers')

// swap
// Factory deployed to: 0x38D509C14aC8a321CbC162DfA6A23f27f301c444
// INIT_CODE_PAIR_HASH: 0x3d8e383832ed8a82a2668fee8b3352451d825041d1bdf9ad476a5d1a3a6d98e2
// factory.setFeeTo 0x50D8aD8e7CC0C9c2236Aac2D2c5141C164168da3 //收0.3%手续费的账号
// woktAddress: 0x70c1c53E991F31981d592C2d865383AC0d212225
// Router deployed to: 0x37239DD3A8FF6dd7B125Ec8738069733340bD30F

// farm
// KKT deployed to: 0x4962Bf3133dFb5630e3fEd6bb55AC35731BCa3fF
// MasterChef deployed to: 0xe5Fa42c0dEA555C65c479dd4b29CA91BE9374694
// MasterChef owner is: 0xE44081Ee2D0D4cbaCd10b44e769A14Def065eD4D //管理池子、修改挖矿产出
// MasterChef dev is: 0x50D8aD8e7CC0C9c2236Aac2D2c5141C164168da3 //接收KKT10%的产出
// MasterChef ope is: 0x011EBb673b8e7e042C42121CCA062FB7b27BdCFE //接收KKT5%的产出
// Deployer deployed to: 0x0c15c2132381577EfA26C0f0db468d30d1Dcb088 //用来创建KingChef
// createChef address: 0x93783AB91fE66B7D731dF3C15403E0fB102B9597 //创建的KingChef

// 官方测试网发行OIP20代币，10位精度
// OKB 0xDa9d14072Ef2262c64240Da3A93fea2279253611
// USDT 0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281
// USDK 0x533367b864D9b9AA59D0DCB6554DF0C89feEF1fF
// USDC 0x3e33590013B24bf21D4cCca3a965eA10e570D5B2
// BTCK 0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0
// ETHK 0xDF950cEcF33E64176ada5dD733E170a56d11478E
// DOTK 0x72f8fa5da80dc6e20e00d02724cf05ebd302c35f
// FILK 0xf6a0Dc1fD1d2c0122ab075d7ef93aD79F02CcB93
// LTCK 0xd616388f6533B6f1c31968a305FbEE1727F55850
// WOKT 0x70c1c53E991F31981d592C2d865383AC0d212225

const factoryAddress = '0xDcAA842dC9515CA4d2bB939d8AF96DD1e8607482'
const routerAddress = '0xD9Ee582C00E2f6b0a5A0F4c18c88a30e49C0304b'

const OKB = '0xda9d14072ef2262c64240da3a93fea2279253611'
const NAS = '0x6FD9dB63dbC6BE452ae7B0Fe9995c81d967870Bb'
const USDT = '0xe579156f9decc4134b5e3a30a24ac46bb8b01281'
const USDK = '0x533367b864D9b9AA59D0DCB6554DF0C89feEF1fF'
const USDC = '0x3e33590013B24bf21D4cCca3a965eA10e570D5B2'
const BTCK = '0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0'
const ETHK = '0xDF950cEcF33E64176ada5dD733E170a56d11478E'
const DOTK = '0x72f8fa5da80dc6e20e00d02724cf05ebd302c35f'
const FILK = '0xf6a0Dc1fD1d2c0122ab075d7ef93aD79F02CcB93'
const LTCK = '0xd616388f6533B6f1c31968a305FbEE1727F55850'
const WOKT = '0x70c1c53E991F31981d592C2d865383AC0d212225'
const KKT = '0x4C8ef89f82E8A773F6B943200fe56d36DDBaF324'

async function main() {
    var accounts = await hre.ethers.getSigners()

    // LP 挖矿
    // KKT-USDT 5
    // KKT-OKT 5
    // OKT-USDT 3
    // NAS-USDT 3
    // OKB-USDT 2
    // BTCK-USDT 1
    // ETHK-USDT 1
    // LTCK-USDT 1
    // DOTK-USDT 1
    // FILK-USDT 1
    // USDK-USDT 1

    // 单币挖矿 launchPool
    // KKT -> KKT, OKT
    // OKT -> KKT
    // NAS -> KKT

    await addLiquidity(KKT, USDT, 18, 10) //pair 
    await delay(10)
    await addLiquidityETH(KKT, 18) //pair 
    await delay(10)
    await addLiquidityETH(USDT, 10) //pair 
    await delay(10)
    await addLiquidity(NAS, USDT, 18, 10)  //pair 
    await delay(10)
    await addLiquidity(OKB, USDT, 10, 10)  //pair 
    await delay(10)
    await addLiquidity(BTCK, USDT, 10, 10)  //pair 
    await delay(10)
    await addLiquidity(ETHK, USDT, 10, 10)  //pair 
    await delay(10)
    await addLiquidity(LTCK, USDT, 10, 10)  //pair 
    await delay(10)
    await addLiquidity(DOTK, USDT, 10, 10)  //pair 
    await delay(10)
    await addLiquidity(FILK, USDT, 10, 10)  //pair 
    await delay(10)
    await addLiquidity(USDK, USDT, 10, 10)  //pair 
    await delay(10)

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

    // let balanceA = dpow(await tokenA.balanceOf(accounts[0].address), decimalsA)
    // let balanceB = dpow(await tokenB.balanceOf(accounts[0].address), decimalsB)
    // console.log('tokenA account0 balance', await tokenA.symbol(), balanceA)
    // console.log('tokenB account0 balance', await tokenB.symbol(), balanceB)

    await tokenA.approve(routerAddress, pow(1, decimalsA))
    await tokenB.approve(routerAddress, pow(1, decimalsB))
    // console.log('approve')
    await delay(10)

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

    // let balance = dpow(await token.balanceOf(accounts[0].address), decimals)
    // console.log('token account0 balance', await token.symbol(), balance)

    let blockNumber = await hre.ethers.provider.getBlockNumber()
    let block = await hre.ethers.provider.getBlock(blockNumber)
    let deadline = BigNumber.from(block.timestamp + 3600 * 24)

    await token.approve(routerAddress, pow(1, decimals))
    // console.log('approve')
    await delay(10)
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

        let ercAbi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')

        if (await pair.symbol() == 'KK-LP') {
            let token0Address = await pair.token0()
            let erc0 = new ethers.Contract(token0Address, ercAbi, accounts[0])
    
            let token1Address = await pair.token1()
            let erc1 = new ethers.Contract(token1Address, ercAbi, accounts[0])
    
            console.log('lptoken:', pair.address, await erc0.symbol() + '-' + await erc1.symbol(), 'token0:', token0Address, 'token1', token1Address)
            
        } else {
            
            console.log('token:', pair.address, await pair.symbol())

        }
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


// main().then(viewPairs)
viewPairs()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
