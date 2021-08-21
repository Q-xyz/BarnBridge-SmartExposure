import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';
import fetch from 'node-fetch';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool, EPoolHelper, EPoolPeriphery, TestERC20 } from '../../../typechain';

import { REBALANCE_WITH_FLASH_SWAP } from '../../task-names';


task(REBALANCE_WITH_FLASH_SWAP, 'Rebalances a EPool with a flash swap')
.addParam('ePool', 'Address of EPool')
.addParam('ePoolHelper', 'Address of EPoolHelper')
.addParam('ePoolPeriphery', 'Address of EPoolPeriphery')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const ePoolHelper = new ethers.Contract(_taskArgs.ePoolHelper, artifacts.readArtifactSync('EPoolHelper').abi) as EPoolHelper;
  const ePoolPeriphery = new ethers.Contract(_taskArgs.ePoolPeriphery, artifacts.readArtifactSync('EPoolPeriphery').abi) as EPoolPeriphery;
  const rate = await ePool.connect(admin).getRate();
  const tokenA = new ethers.Contract(await ePool.connect(admin).tokenA(), artifacts.readArtifactSync('TestERC20').abi) as TestERC20;
  const tokenB = new ethers.Contract(await ePool.connect(admin).tokenB(), artifacts.readArtifactSync('TestERC20').abi) as TestERC20;
  const balanceA = await tokenA.connect(admin).balanceOf(await admin.getAddress());
  const balanceB = await tokenB.connect(admin).balanceOf(await admin.getAddress());
  console.log(`balanceA:         ${balanceA.toString()}`);
  console.log(`balanceB:         ${balanceB.toString()}`);
  const [deltaA, deltaB, rChange, rDiv] = await ePoolHelper.connect(admin).delta(_taskArgs.ePool);
  console.log(`Estimated Rebalance:`);
  console.log(`  rDiv:           ${rDiv.toString()}`);
  console.log(`  deltaA:         ${deltaA.toString() + ((rChange.gt(0)) ? ' to add' : ' to release')}`);
  console.log(`  deltaB:         ${deltaB.toString() + ((rChange.gt(0)) ? ' to release' : ' to add')}`);
  console.log(`  rate:           ${rate.toString()}`);

  const lastRebalance = await ePool.connect(admin).lastRebalance();
  const rebalanceInterval = await ePool.connect(admin).rebalanceInterval();
  const rebalanceMinRDiv = await ePool.connect(admin).rebalanceMinRDiv();
  const currentTimestamp = ethers.BigNumber.from(Math.round(new Date().getTime() / 1000));
  const nextRebalanceTimestamp = lastRebalance.add(rebalanceInterval);
  if (deltaA.eq(0) || deltaB.eq(0)) {
    console.log(`Delt is zero. Nothing to rebalance.`);
    return;
  }
  if (rDiv.lt(rebalanceMinRDiv)) {
    console.log(`Min. ratio deviation of ${rebalanceMinRDiv.toString()} not met.`);
    return;
  }
  if (currentTimestamp.lt(nextRebalanceTimestamp)) {
    console.log(`Next rebalance possible after ${nextRebalanceTimestamp.toString()} (current: ${currentTimestamp.toString()}).`);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let gasPrice = '1';
  if ((await ethers.provider.getNetwork()).chainId !== 137) {
    gasPrice = String((await (await fetch('https://www.gasnow.org/api/v3/gas/price')).json()).data.fast);
  }
  let gas;
  try {
    gas = await ePoolPeriphery.connect(admin).estimateGas.rebalanceWithFlashSwap(
      ePool.address, ethers.utils.parseUnits('1', 18), { gasLimit: 500000, gasPrice: gasPrice }
    );
  } catch (error) {
    console.log('Gas estimation failed: ' + error);
    return;
  }
  const tx_rebalance = await ePoolPeriphery.connect(admin).rebalanceWithFlashSwap(
    ePool.address, ethers.utils.parseUnits('1', 18), { gasLimit: 500000, gasPrice: gasPrice }
  );
  console.log(`EPoolPeriphery.rebalanceAllWithFlashSwap:`);
  console.log(`  Est. Gas:       ${gas.toString()}`);
  console.log(`  TxHash:         ${tx_rebalance.hash}`);
  const receipt = await tx_rebalance.wait();
  const RebalanceEvent = new ethers.utils.Interface([ePool.interface.getEvent('RebalancedTranches')]);
  receipt.events?.forEach((event: any) => {
    try {
      const result = RebalanceEvent.parseLog(event);
      console.log(`  deltaA:         ${result.args.deltaA}` );
      console.log(`  deltaB:         ${result.args.deltaB}` );
      console.log(`  rChange:        ${result.args.rChange}` );
    // eslint-disable-next-line no-empty
    } catch(error) {}
  });
});
