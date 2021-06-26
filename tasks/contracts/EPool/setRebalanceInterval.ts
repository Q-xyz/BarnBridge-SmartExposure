import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool } from '../../../typechain';
import { SET_REBALANCE_INTERVAL } from '../../task-names';

task(SET_REBALANCE_INTERVAL, 'Set rebalancing interval EPool')
.addParam('ePool', 'Address of EPool')
.addParam('interval', 'Rebalance interval')
.setAction(async function (_taskArgs: any, { ethers, artifacts }) {
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const tx_interval = await ePool.connect(admin).setRebalanceInterval(_taskArgs.interval);
  console.log(`EPool.setRebalanceInterval:`);
  console.log(`  TxHash:         ${tx_interval.hash}`);
  const interval = (await tx_interval.wait()).events?.find((logs: any) => logs.event === 'SetRebalanceInterval')?.args?.join() as string;
  console.log(`  interval:       ${interval}`);
});
