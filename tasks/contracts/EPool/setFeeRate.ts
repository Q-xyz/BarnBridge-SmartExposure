import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool } from '../../../typechain';
import { SET_FEE_RATE } from '../../task-names';

task(SET_FEE_RATE, 'Set fee rate for EPool')
.addParam('ePool', 'Address of EPool')
.addParam('feeRate', 'Redemption fee rate in percentage scaled to 1e18')
.setAction(async function (_taskArgs: any, { ethers, artifacts }) {
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const tx_feeRate = await ePool.connect(admin).setFeeRate(_taskArgs.feeRate);
  console.log(`EPool.setRebalanceInterval:`);
  console.log(`  TxHash:         ${tx_feeRate.hash}`);
  const feeRate = (await tx_feeRate.wait()).events?.find((logs: any) => logs.event === 'SetFeeRate')?.args?.join() as string;
  console.log(`  feeRate:        ${feeRate}`);
});
