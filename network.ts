
export const NETWORK_ENV = {
  // kovan
  'kovan': {
    'AggregatorV3Proxy': '0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541', // DAI/ETH price feed (inverse true)
    'AggregatorV3Proxy_BTC_ETH': '0xF7904a295A029a3aBDFFB6F12755974a958C7C25', // inverse true
    'AggregatorV3Proxy_USDC_WETH': '0xF7904a295A029a3aBDFFB6F12755974a958C7C25', // inverse true
    'UniswapV2Factory': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    'UniswapV2Router02': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    'WETH': '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    'DAI': '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
    'USDC': '0x75b0622cec14130172eae9cf166b92e5c112faff',
    'WBTC': '0xa0a5ad2296b38bd3e3eb59aaeaf1589e8d9a29a9',
    'Admin': '0x51ad67978AF0B4D5DF67494E2a5C080F1Cf40e4B', // needs to have sufficient WETH and DAI for tests
    'User': '0x51ad67978AF0B4D5DF67494E2a5C080F1Cf40e4B' // needs to have sufficient WETH and DAI for tests
  },
  // forked mainnet
  'mainnet': {
    'AggregatorV3Proxy': '',
    'UniswapV2Factory': '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac', // Sushiswap
    'UniswapV2Router02': '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', // Sushiswap
    'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
    'Admin': '0x35fFd6E268610E764fF6944d07760D0EFe5E40E5', // needs to have sufficient WETH and DAI for tests
    'User': '0xb1cFF81b9305166ff1EFc49A129ad2AfCd7BCf19' // needs to have sufficient WETH and DAI for tests
  },
  // mainnet
  'homestead': {
    'AggregatorV3Proxy_BTC_ETH': '0xdeb288F737066589598e9214E782fa5A8eD689e8', // inverse true
    'AggregatorV3Proxy_USDC_WETH': '0x986b5E1e1755e3C2440e960477f25201B0a8bbD4', // inverse true
    'UniswapV2Factory': '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac', // Sushiswap
    'UniswapV2Router02': '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', // Sushiswap
    'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'DAI': '',
    'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    'WBTC': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    'Admin': '0x35fFd6E268610E764fF6944d07760D0EFe5E40E5',
    'User': '0xb1cFF81b9305166ff1EFc49A129ad2AfCd7BCf19'
  },
  // polygon
  'unknown': {
    'AggregatorV3Proxy_BTC_ETH': '0xA338e0492B2F944E9F8C0653D3AD1484f2657a37', // inverse true
    'AggregatorV3Proxy_USDC_WETH': '0xefb7e6be8356cCc6827799B6A7348eE674A80EaE', // inverse true
    'UniswapV2Factory': '0xc35DADB65012eC5796536bD9864eD8773aBc74C4', // Sushiswap
    'UniswapV2Router02': '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // Sushiswap
    'WETH': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    'DAI': '',
    'USDC': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    'WBTC': '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    'Admin': '0x35fFd6E268610E764fF6944d07760D0EFe5E40E5',
    'User': '0xb1cFF81b9305166ff1EFc49A129ad2AfCd7BCf19'
  }
};
