import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IERC20 } from '../../../typechain';

import { ADD_SUBSIDY } from '../../task-names';


task(ADD_SUBSIDY, 'Deposits into a EPool tranche')
.addParam('keeperSubsidyPool', 'Address of KeeperSubsidyPool')
.addParam('token', 'Address of Token to add as subsidy')
.addParam('amount', 'Subsidy amount')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const token = new ethers.Contract(_taskArgs.token, artifacts.readArtifactSync('IERC20').abi) as IERC20;
  const balance = await token.connect(admin).balanceOf(await admin.getAddress());
  console.log(`balance:      ${balance.toString()}`);
  if (balance.lt(_taskArgs.amount)) { throw new Error('Insufficient funds for specified subsidy amount.'); }
  const tx_transfer = await token.connect(admin).transfer(_taskArgs.keeperSubsidyPool, _taskArgs.amount);
  console.log(`Token.transfer:`);
  console.log(`  TxHash:     ${tx_transfer.hash}`);
});
