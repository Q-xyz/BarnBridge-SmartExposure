import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPoolPeriphery } from '../../../typechain';
import { SET_MAX_FLASH_SWAP_SLIPPAGE } from '../../task-names';

task(SET_MAX_FLASH_SWAP_SLIPPAGE, 'Set max. flash swap slippage for rebalance via flash swap')
.addParam('ePoolPeriphery', 'Address of EPoolPeriphery')
.addParam('maxFlashSwapSlippage', 'Max. flash swap slippage (1e18)')
.setAction(async function (_taskArgs: any, { ethers, artifacts }) {
  const admin: Signer = (await ethers.getSigners())[0];

  const ePoolPeriphery = new ethers.Contract(_taskArgs.ePoolPeriphery, artifacts.readArtifactSync('EPoolPeriphery').abi) as EPoolPeriphery;
  const tx_slippage = await ePoolPeriphery.connect(admin).setMaxFlashSwapSlippage(_taskArgs.maxFlashSwapSlippage);
  console.log(`EPoolPeriphery.setMaxFlashSwapSlippage:`);
  console.log(`  TxHash:         ${tx_slippage.hash}`);
});
