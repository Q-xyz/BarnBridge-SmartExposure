import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IERC20 } from '../../../typechain';

import { APPROVE } from '../../task-names';


task(APPROVE, 'Set allowance for a spender of token')
.addParam('token', 'Address of token')
.addParam('spender', 'Address of spender')
.addParam('amount', 'Allowance amount')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const token = new ethers.Contract(_taskArgs.token, artifacts.readArtifactSync('IERC20').abi) as IERC20;
  const balance = await token.connect(admin).balanceOf(await admin.getAddress());
  console.log(`balance:      ${balance.toString()}`);
  if (balance.lt(_taskArgs.amount)) { throw new Error('Insufficient funds for specified allowance.'); }
  const tx_approve = await token.connect(admin).approve(_taskArgs.spender, _taskArgs.amount);
  console.log(`TokenA.approve:`);
  console.log(`  TxHash:     ${tx_approve.hash}`);
});
