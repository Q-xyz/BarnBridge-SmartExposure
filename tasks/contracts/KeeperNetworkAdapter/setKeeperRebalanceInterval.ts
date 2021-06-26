import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { KeeperNetworkAdapter } from '../../../typechain';

import { SET_KEEPER_REBALANCE_INTERVAL } from '../../task-names';


task(SET_KEEPER_REBALANCE_INTERVAL, 'Updates the rebalance interval for KeeperNetworkAdapter')
.addParam('keeperNetworkAdapter', 'Address of KeeperNetworkAdapter')
.addParam('interval', 'Rebalance interval')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const keeperNetworkAdapter = new ethers.Contract(
    _taskArgs.keeperNetworkAdapter, artifacts.readArtifactSync('KeeperNetworkAdapter').abi
  ) as KeeperNetworkAdapter;
  const tx_interval = await keeperNetworkAdapter.connect(admin).setKeeperRebalanceInterval(_taskArgs.interval);
  console.log(`KeeperNetworkAdapter.setKeeperRebalanceInterval:`);
  console.log(`  TxHash:     ${tx_interval.hash}`);
});
