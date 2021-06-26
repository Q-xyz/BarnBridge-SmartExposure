import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { KeeperNetworkAdapter } from '../../../typechain';

import { SET_KEEPER_REBALANCE_MIN_DELTA_A } from '../../task-names';


task(SET_KEEPER_REBALANCE_MIN_DELTA_A, 'Updates minRDiv for rebalancing for KeeperNetworkAdapter')
.addParam('keeperNetworkAdapter', 'Address of KeeperNetworkAdapter')
.addParam('minRDiv', 'Min. ratio deviation')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const keeperNetworkAdapter = new ethers.Contract(
    _taskArgs.keeperNetworkAdapter, artifacts.readArtifactSync('KeeperNetworkAdapter').abi
  ) as KeeperNetworkAdapter;
  const tx_minRDiv = await keeperNetworkAdapter.connect(admin).setKeeperRebalanceMinRDiv(_taskArgs.minRDiv);
  console.log(`KeeperNetworkAdapter.setKeeperRebalanceMinRDiv:`);
  console.log(`  TxHash:     ${tx_minRDiv.hash}`);
});
