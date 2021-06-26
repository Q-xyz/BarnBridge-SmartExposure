import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool } from '../../../typechain';
import { SET_REBALANCE_MIN_DELTA_A } from '../../task-names';

task(SET_REBALANCE_MIN_DELTA_A, 'Set minRDiv for rebalancing EPool')
.addParam('ePool', 'Address of EPool')
.addParam('minRDiv', 'Min. ratio deviation')
.setAction(async function (_taskArgs: any, { ethers, artifacts }) {
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const tx_minRDiv = await ePool.connect(admin).setMinRDiv(_taskArgs.minRDiv);
  console.log(`EPool.setRebalanceMinRDiv:`);
  console.log(`  TxHash:         ${tx_minRDiv.hash}`);
  const minRDiv = (await tx_minRDiv.wait()).events?.find((logs: any) => logs.event === 'SetMinRDiv')?.args?.join() as string;
  console.log(`  minRDiv:      ${minRDiv}`);
});
