import { BigNumber } from 'ethers';

import { Accounts, Signers } from './';
import {
  EPool, EPoolHelper, EPoolPeriphery, EToken, ETokenFactory, Controller,
  AggregatorMock, AggregatorV3Interface,
  UniswapRouterMock, IUniswapV2Factory, IUniswapV2Router02,
  TestERC20, TestEPoolLibrary
} from '../typechain';

declare module "mocha" {
  export interface Context {
    accounts: Accounts;
    signers: Signers;
    forking: boolean;
    localRun: boolean;
    sFactorA: BigNumber;
    sFactorB: BigNumber;
    sFactorE: BigNumber;
    sFactorI: BigNumber;
    controller: Controller;
    ep: EPool;
    eph: EPoolHelper;
    epp: EPoolPeriphery;
    aggregator: AggregatorMock | AggregatorV3Interface;
    epl: TestEPoolLibrary;
    router: UniswapRouterMock | IUniswapV2Router02;
    factory: IUniswapV2Factory;
    eTokenFactory: ETokenFactory;
    eToken: EToken;
    eToken1: EToken;
    eToken2: EToken;
    eToken3: EToken;
    tokenA: TestERC20;
    tokenB: TestERC20;
  }
}
