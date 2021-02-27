# kingkong-swap-periphery
### fork from uniswap-v2-periphery, then use hardhat to rebuild
## contracts modify:
1. UniswapV2Library.sol line 24, change init_code_hash to INIT_CODE_PAIR_HASH
2. ERC20.sol and WETH9.sol, modify for testing, not deployed yet
3. UniswapV2Router02 line 447, add pairFor() to view the pair address

## deploy
1. npm i
2. copy the factoryAddress from kingkong-swap-core deploy print, into scripts/deploy.js
3. npx hardhat run scripts/deploy.js --network localhost
### now you have router deployed
### local.js can test swap, good luck!
### if you need farm, next step turn to kingkong-farm

