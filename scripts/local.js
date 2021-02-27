const hre = require('hardhat')
const fs = require('fs')
const { BigNumber } = require('ethers')


async function main() {
    var accounts = await hre.ethers.getSigners()

    //创建token
    const ERC20 = await hre.ethers.getContractFactory('ERC20')

    const tokenA = await ERC20.deploy('OKB', m(200))
    await tokenA.deployed()
    console.log('OKB deployed to:', tokenA.address)
    await tokenA.transfer(accounts[2].address, m(100))
    
    const tokenB = await ERC20.deploy('NAS', m(200))
    await tokenB.deployed()
    console.log('NAS deployed to:', tokenB.address)
    await tokenB.transfer(accounts[2].address, m(100))

    //获取swap合约
    let routerAbi = getAbi('./artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json')
    let routerAddress = '0xB468647B04bF657C9ee2de65252037d781eABafD'
    const router = new ethers.Contract(routerAddress, routerAbi, accounts[0])
    let factoryAddress = await router.factory()
    console.log('factoryAddress:', factoryAddress)

    let factoryAbi = getAbi('./artifacts/@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol/IUniswapV2Factory.json')
    const factory = new ethers.Contract(factoryAddress, factoryAbi, accounts[0])
    await factory.setFeeTo(accounts[1].address)
    console.log('Factory now feeTo:', await factory.feeTo())

    let blockNumber = await hre.ethers.provider.getBlockNumber()
    let block = await hre.ethers.provider.getBlock(blockNumber)
    let deadline = BigNumber.from(block.timestamp + 3600 * 24)

    //添加流动性
    await tokenA.approve(routerAddress, m(100))
    await tokenB.approve(routerAddress, m(100))
    await router.addLiquidity(tokenA.address, tokenB.address, m(100), m(100), m(0), m(0)
        , accounts[0].address, deadline, { gasLimit: BigNumber.from('8000000') })
    console.log('addLiquidity done')

    //查看池子
    let allPairsLength = await factory.allPairsLength()
    console.log('allPairsLength:', allPairsLength.toNumber())
    if (allPairsLength == 0) {
        return
    }
    let pairAddress = await factory.allPairs(allPairsLength - 1)
    console.log('pairAddress:', pairAddress)

    let pairAdr = await router.pairFor(tokenA.address, tokenB.address)
    console.log('pairAdr', pairAdr)

    if (pairAddress != pairAdr) {
        console.log('pair wrong !')
        return
    }

    let pairabi = getAbi('./artifacts/@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json')
    const pair = new ethers.Contract(pairAddress, pairabi, accounts[0])
    let lptokenBal = await pair.balanceOf(accounts[0].address)
    console.log('lptokenBal:', d(lptokenBal))

    //查看余额
    let reserves = await pair.getReserves()
    console.log('token Address:', await pair.token0(), await pair.token1())
    console.log('reserves:', d(reserves[0]), d(reserves[1]))
    await balance([tokenA.address, tokenB.address, pairAddress])
    
    //swap
    await tokenA.connect(accounts[2]).approve(routerAddress, m(100))
    await tokenB.connect(accounts[2]).approve(routerAddress, m(100))
    for (let i=0; i<100; i++) {
        await router.connect(accounts[2]).swapExactTokensForTokens(m(1), m(0), [tokenA.address, tokenB.address]
        , accounts[2].address, deadline, { gasLimit: BigNumber.from('8000000') })
    
        await router.connect(accounts[2]).swapExactTokensForTokens(m(1), m(0), [tokenB.address, tokenA.address]
        , accounts[2].address, deadline, { gasLimit: BigNumber.from('8000000') })

        console.log('swapExactTokensForTokens done', i)
    }
    
    //查看余额
    reserves = await pair.getReserves()
    console.log('reserves:', d(reserves[0]), d(reserves[1]))
    await balance([tokenA.address, tokenB.address, pairAddress])

    //移除流动性，授权给router，router会调用transferFrom用自己的额度打给pair
    await pair.approve(router.address, lptokenBal)
    console.log('allowance:', (await pair.allowance(accounts[0].address, router.address)).toString())

    await router.removeLiquidity(await pair.token0(), await pair.token1(), lptokenBal, m(0), m(0)
    , accounts[0].address, deadline, { gasLimit: BigNumber.from('8000000') })
    console.log('removeLiquidity done')

    //手动移除流动性，打给pair
    // await pair.transfer(pair.address, lptokenBal)
    // await pair.burn(accounts[0].address)

    //查看余额
    reserves = await pair.getReserves()
    console.log('reserves:', d(reserves[0]), d(reserves[1]))
    await balance([tokenA.address, tokenB.address, pairAddress])

    console.log('all done')
}


async function balance(addressArr) {
    var accounts = await hre.ethers.getSigners()

    let ERC20abi = getAbi('./artifacts/contracts/test/ERC20.sol/ERC20.json')

    for (let tokenAAddress of addressArr) {
        console.log('token ' + tokenAAddress)
        let tokanA = new ethers.Contract(tokenAAddress, ERC20abi, accounts[0])
        console.log('account0 balance', d(await tokanA.balanceOf(accounts[0].address)))
        console.log('account1 balance', d(await tokanA.balanceOf(accounts[1].address)))
        console.log('account2 balance', d(await tokanA.balanceOf(accounts[2].address)))
        console.log('')
    }
}


function getAbi(jsonPath) {
    let file = fs.readFileSync(jsonPath)
    let abi = JSON.parse(file.toString()).abi
    return abi
}

function m(num) {
    return BigNumber.from('1000000000000000000').mul(num)
}

function d(bn) {
    return bn.div('1000000000').toNumber() / 1000000000
}

function test() {
    let bn = BigNumber.from('1414213562373095047801')
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
