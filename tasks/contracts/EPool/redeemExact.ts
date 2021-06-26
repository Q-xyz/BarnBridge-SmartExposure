import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool, EPoolHelper, TestERC20 } from '../../../typechain';

import { REDEEM_EXACT } from '../../task-names';


task(REDEEM_EXACT, 'Redeem exact amount of EToken')
.addParam('ePool', 'Address of EPool')
.addParam('ePoolHelper', 'Address of EPoolHelper')
.addParam('eToken', 'Address of the tranches EToken')
.addParam('amount', 'Amount of eToken to withdraw')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const rate = await ePool.connect(admin).getRate();
  const eToken = new ethers.Contract(_taskArgs.eToken, artifacts.readArtifactSync('TestERC20').abi) as TestERC20;
  const ePoolHelper = new ethers.Contract(_taskArgs.ePoolHelper, artifacts.readArtifactSync('EPoolHelper').abi) as EPoolHelper;
  const [amountA, amountB] = await ePoolHelper.connect(admin).tokenATokenBForEToken(_taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount);
  console.log(`Estimated Redemption:`);
  console.log(`  eTokenAmount:   ${_taskArgs.amount}`);
  console.log(`  amountA:        ${amountA.toString()}`);
  console.log(`  amountB:        ${amountB.toString()}`);
  console.log(`  rate:           ${rate.toString()}`);
  const tx_approve = await eToken.connect(admin).approve(_taskArgs.ePool, _taskArgs.amount);
  console.log(`EToken.approve:`);
  console.log(`  TxHash:         ${tx_approve.hash}`);
  const tx_issue = await ePool.connect(admin).redeemExact(_taskArgs.eToken, _taskArgs.amount, { gasLimit: 1000000 });
  console.log(`EPool.redeemExact:`);
  console.log(`  TxHash:         ${tx_issue.hash}`);
  const receipt = await tx_issue.wait();
  const RedemptionEvent = new ethers.utils.Interface([ePool.interface.getEvent('RedeemedEToken')]);
  receipt.events?.forEach((event: any) => {
    try {
      const result = RedemptionEvent.parseLog(event);
      console.log(`  eToken:         ${result.args.eToken}` );
      console.log(`  amountA:        ${result.args.amountA}` );
      console.log(`  amountB:       ${result.args.amountB}` );
    // eslint-disable-next-line no-empty
    } catch(error) {}
  });
});
