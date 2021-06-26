import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool } from '../../../typechain';
import { ADD_TRANCHE } from '../../task-names';

task(ADD_TRANCHE, 'Add a new tranche to a EPool')
.addParam('ePool', 'Address of EPool')
.addParam('targetRatio', 'Target ratio of the tranche')
.addParam('eTokenSymbol', 'Symbol of the tranches EToken')
.addParam('eTokenName', 'Name of the tranches EToken')
.setAction(async function (_taskArgs: any, { ethers, artifacts }) {
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const tx_create = await ePool.connect(admin).addTranche(
    _taskArgs.targetRatio, _taskArgs.eTokenName, _taskArgs.eTokenSymbol
  );
  console.log(`EPool.addTranche:`);
  console.log(`  TxHash:         ${tx_create.hash}`);
  const eToken = (await tx_create.wait()).events?.find((logs: any) => logs.event === 'AddedTranche')?.args?.join() as string;
  console.log(`  eToken:         ${eToken}`);
});
