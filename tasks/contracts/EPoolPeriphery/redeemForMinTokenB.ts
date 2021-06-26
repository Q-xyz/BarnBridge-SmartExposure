import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool, EPoolPeriphery, EToken } from '../../../typechain';
import { REDEEM_FOR_MIN_TOKEN_B } from '../../task-names';

task(REDEEM_FOR_MIN_TOKEN_B, 'Redeem EToken for min. amount of TokenB')
.addParam('ePool', 'Address of EPool')
.addParam('ePoolHelper', 'Address of EPoolHelper')
.addParam('ePoolPeriphery', 'Address of EPoolPeriphery')
.addParam('eToken', 'Address of the tranches EToken')
.addParam('amount', 'Amount of eToken to withdraw')
.addParam('minOutputAmountB', 'Min. amount of TokenB to receive')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const ePoolPeriphery = new ethers.Contract(_taskArgs.ePoolPeriphery, artifacts.readArtifactSync('EPoolPeriphery').abi) as EPoolPeriphery;
  const eToken = new ethers.Contract(_taskArgs.eToken, artifacts.readArtifactSync('EToken').abi) as EToken;
  const balance = await eToken.connect(admin).balanceOf(await admin.getAddress());
  console.log(`eTokenBalance:       ${balance.toString()}`);
  if (balance.lt(_taskArgs.amount)) { throw new Error('Insufficient funds for specified redemption amount.'); }

  const maxOutputAmountB = await ePoolPeriphery.connect(admin).maxOutputAmountBForEToken(
    _taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount
  );
  console.log(`Estimated Redemption:`);
  console.log(`  eTokenAmount:      ${_taskArgs.amount}`);
  console.log(`  minOutputAmountB:  ${_taskArgs.minOutputAmountB}`);
  console.log(`  maxOutputAmountB:  ${maxOutputAmountB}`);

  if (ethers.BigNumber.from(_taskArgs.minOutputAmountB).gt(maxOutputAmountB)) {
    throw new Error('Max. input minOutputAmountA to high.');
  }

  const tx_approve = await eToken.connect(admin).approve(_taskArgs.ePoolPeriphery, _taskArgs.amount);
  console.log(`EToken.approve:`);
  console.log(`  TxHash:            ${tx_approve.hash}`);
  const deadline = (await ethers.provider.getBlock('latest')).timestamp + 600;
  const tx_issue = await ePoolPeriphery.connect(admin).redeemForMinTokenB(_taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount, _taskArgs.minOutputAmountB, deadline, { gasLimit: 1000000 });
  console.log(`EPoolPeriphery.redeemETokenForMinTokenB:`);
  console.log(`  TxHash:            ${tx_issue.hash}`);
  const receipt = await tx_issue.wait();
  const RedemptionEvent = new ethers.utils.Interface([ePool.interface.getEvent('RedeemedEToken')]);
  receipt.events?.forEach((event: any) => {
    try {
      const result = RedemptionEvent.parseLog(event);
      console.log(`  eToken:            ${result.args.eToken}`);
      console.log(`  amount:            ${result.args.amount}`);
      console.log(`  amountA:           ${result.args.amountA}`);
      console.log(`  amountB:           ${result.args.amountB}`);
    // eslint-disable-next-line no-empty
    } catch(error) {}
  });
});
