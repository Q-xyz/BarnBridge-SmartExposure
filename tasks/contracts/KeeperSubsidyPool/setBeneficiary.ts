import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { KeeperSubsidyPool } from '../../../typechain';
import { SET_BENEFICIARY } from '../../task-names';


task(SET_BENEFICIARY, 'Set beneficiary for subsidies')
.addParam('keeperSubsidyPool', 'Address of KeeperSubsidyPool')
.addParam('beneficiary', 'Address of beneficiary')
.addParam('canRequest', 'Boolean can request subsidy')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ksp = new ethers.Contract(_taskArgs.keeperSubsidyPool, artifacts.readArtifactSync('KeeperSubsidyPool').abi) as KeeperSubsidyPool;
  const tx_set = await ksp.connect(admin).setBeneficiary(_taskArgs.beneficiary, _taskArgs.canRequest);
  console.log(`KeeperSubsidyPool.setBeneficiary:`);
  console.log(`  TxHash:     ${tx_set.hash}`);
});
