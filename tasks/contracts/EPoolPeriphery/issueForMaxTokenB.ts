import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool, EPoolPeriphery, IERC20, IERC20Optional } from '../../../typechain';
import { ISSUE_FOR_MAX_TOKEN_B } from '../../task-names';


task(ISSUE_FOR_MAX_TOKEN_B, 'Issue an exact amount of EToken for max. amount of TokenB')
.addParam('ePool', 'Address of EPool')
.addParam('ePoolHelper', 'Address of EPoolHelper')
.addParam('ePoolPeriphery', 'Address of EPoolPeriphery')
.addParam('eToken', 'Address of the tranches EToken')
.addParam('amount', 'Amount of EToken to issue')
.addParam('maxInputAmountB', 'Max. amount of TokenB to deposit')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const ePoolPeriphery = new ethers.Contract(_taskArgs.ePoolPeriphery, artifacts.readArtifactSync('EPoolPeriphery').abi) as EPoolPeriphery;
  const tokenB = new ethers.Contract(await ePool.connect(admin).tokenB(), [
    ...artifacts.readArtifactSync('IERC20').abi, ...artifacts.readArtifactSync('IERC20Optional').abi
  ]) as IERC20 | IERC20Optional;

  const balanceB = await tokenB.connect(admin).balanceOf(await admin.getAddress());
  console.log(`balanceB:          ${balanceB.toString()}`);
  if (balanceB.lt(_taskArgs.maxInputAmountB)) { throw new Error('Insufficient funds for specified issuance amount.'); }

  const minInputAmountB = await ePoolPeriphery.connect(admin).minInputAmountBForEToken(_taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount);
  console.log(`Estimated Deposit:`);
  console.log(`  eToken amount:   ${_taskArgs.amount.toString()}`);
  console.log(`  maxInputAmountB: ${_taskArgs.maxInputAmountB.toString()}`);
  console.log(`  minInputAmountB: ${minInputAmountB.toString()}`);

  if (ethers.BigNumber.from(_taskArgs.maxInputAmountB).lt(minInputAmountB)) {
    throw new Error('Max. input amountB to low.');
  }

  const tx_approve = await tokenB.connect(admin).approve(_taskArgs.ePoolPeriphery, _taskArgs.maxInputAmountB);
  console.log(`TokenA.approve:`);
  console.log(`  TxHash:          ${tx_approve.hash}`);
  const deadline = (await ethers.provider.getBlock('latest')).timestamp + 600;
  const tx_issue = await ePoolPeriphery.connect(admin).issueForMaxTokenB(
    _taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount, _taskArgs.maxInputAmountB, deadline, { gasLimit: 1000000 }
  );
  console.log(`EPoolPeriphery.issueForMaxTokenB:`);
  console.log(`  TxHash:          ${tx_issue.hash}`);
  const receipt = await tx_issue.wait();
  const IssuanceEvent = new ethers.utils.Interface([ePool.interface.getEvent('IssuedEToken')]);
  receipt.events?.forEach((event: any) => {
    try {
      const result = IssuanceEvent.parseLog(event);
      console.log(`  eToken:          ${result.args.eToken}`);
      console.log(`  amount:          ${result.args.amount}`);
      console.log(`  amountA:         ${result.args.amountA}`);
      console.log(`  amountB:         ${result.args.amountB}`);
    // eslint-disable-next-line no-empty
    } catch(error) {}
  });
});
