import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool, EPoolPeriphery, IERC20, IERC20Optional } from '../../../typechain';
import { NETWORK_ENV } from '../../../network';
import { ISSUE_FOR_MAX_TOKEN_A } from '../../task-names';


task(ISSUE_FOR_MAX_TOKEN_A, 'Issue an exact amount of EToken for max. amount of TokenA')
.addParam('ePool', 'Address of EPool')
.addParam('ePoolHelper', 'Address of EPoolHelper')
.addParam('ePoolPeriphery', 'Address of EPoolPeriphery')
.addParam('eToken', 'Address of the tranches EToken')
.addParam('amount', 'Amount of EToken to issue')
.addParam('maxInputAmountA', 'Max. amount of TokenA to deposit')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const ePoolPeriphery = new ethers.Contract(_taskArgs.ePoolPeriphery, artifacts.readArtifactSync('EPoolPeriphery').abi) as EPoolPeriphery;
  const tokenA = new ethers.Contract(await ePool.connect(admin).tokenA(), [
    ...artifacts.readArtifactSync('IERC20').abi, ...artifacts.readArtifactSync('IERC20Optional').abi
  ]) as IERC20 | IERC20Optional;

  const balanceA = await tokenA.connect(admin).balanceOf(await admin.getAddress());
  console.log(`balanceA:         ${balanceA.toString()}`);
  if (balanceA.lt(_taskArgs.maxInputAmountA)) { throw new Error('Insufficient funds for specified issuance amount.'); }

  const minInputAmountA = await ePoolPeriphery.connect(admin).minInputAmountAForEToken(_taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount);
  console.log(`Estimated Deposit:`);
  console.log(`  eToken amount:   ${_taskArgs.amount.toString()}`);
  console.log(`  maxInputAmountA: ${_taskArgs.maxInputAmountA.toString()}`);
  console.log(`  minInputAmountA: ${minInputAmountA.toString()}`);

  if (ethers.BigNumber.from(_taskArgs.maxInputAmountA).lt(minInputAmountA)) {
    throw new Error('Max. input amountA to low.');
  }

  const tx_approve = await tokenA.connect(admin).approve(_taskArgs.ePoolPeriphery, _taskArgs.maxInputAmountA);
  console.log(`TokenA.approve:`);
  console.log(`  TxHash:          ${tx_approve.hash}`);
  const deadline = (await ethers.provider.getBlock('latest')).timestamp + 600;
  const tx_issue = await ePoolPeriphery.connect(admin).issueForMaxTokenA(
    _taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount, _taskArgs.maxInputAmountA, deadline, { gasLimit: 1000000 }
  );
  console.log(`EPoolPeriphery.issueForMaxTokenA:`);
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
