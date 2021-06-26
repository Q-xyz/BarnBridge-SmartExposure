import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EPool, EPoolHelper, IERC20 } from '../../../typechain';

import { ISSUE_EXACT } from '../../task-names';


task(ISSUE_EXACT, 'Issues an exact amount of EToken')
.addParam('ePool', 'Address of EPool')
.addParam('ePoolHelper', 'Address of EPoolHelper')
.addParam('eToken', 'Address of the tranches EToken')
.addParam('amount', 'Amount of EToken to issue')
.setAction(async function (_taskArgs: any, hre) {
  const { ethers, artifacts } = hre;
  const admin: Signer = (await ethers.getSigners())[0];

  const ePool = new ethers.Contract(_taskArgs.ePool, artifacts.readArtifactSync('EPool').abi) as EPool;
  const rate = await ePool.connect(admin).getRate();
  const tokenA = new ethers.Contract(await ePool.connect(admin).tokenA(), artifacts.readArtifactSync('IERC20').abi) as IERC20;
  const tokenB = new ethers.Contract(await ePool.connect(admin).tokenB(), artifacts.readArtifactSync('IERC20').abi) as IERC20;
  const balanceA = await tokenA.connect(admin).balanceOf(await admin.getAddress());
  const balanceB = await tokenB.connect(admin).balanceOf(await admin.getAddress());
  console.log(`balanceA:         ${balanceA.toString()}`);
  console.log(`balanceB:         ${balanceB.toString()}`);
  const ePoolHelper = new ethers.Contract(_taskArgs.ePoolHelper, artifacts.readArtifactSync('EPoolHelper').abi) as EPoolHelper;
  const [amountA, amountB] = await ePoolHelper.connect(admin).tokenATokenBForEToken(_taskArgs.ePool, _taskArgs.eToken, _taskArgs.amount);
  if (balanceA.lt(amountA) || balanceB.lt(amountB)) { throw new Error('Insufficient funds for specified issuance amount.'); }
  console.log(`Estimated Deposit:`);
  console.log(`  amountA:        ${amountA.toString()}`);
  console.log(`  amountB:        ${amountB.toString()}`);
  const eTokenAmount = await ePoolHelper.connect(admin).eTokenForTokenATokenB(_taskArgs.ePool, _taskArgs.eToken, amountA, amountB);
  console.log(`  eTokenAmount:   ${eTokenAmount.toString()}`);
  console.log(`  rate:           ${rate.toString()}`);
  const tx_approveA = await tokenA.connect(admin).approve(_taskArgs.ePool, amountA);
  console.log(`TokenA.approve:`);
  console.log(`  TxHash:         ${tx_approveA.hash}`);
  const tx_approveB = await tokenB.connect(admin).approve(_taskArgs.ePool, amountB);
  console.log(`TokenB.approve:`);
  console.log(`  TxHash:         ${tx_approveB.hash}`);
  const tx_issue = await ePool.connect(admin).issueExact(_taskArgs.eToken, _taskArgs.amount, { gasLimit: 1000000 });
  console.log(`EPool.issueExact:`);
  console.log(`  TxHash:         ${tx_issue.hash}`);
  const receipt = await tx_issue.wait();
  const IssuanceEvent = new ethers.utils.Interface([ePool.interface.getEvent('IssuedEToken')]);
  receipt.events?.forEach((event: any) => {
    try {
      const result = IssuanceEvent.parseLog(event);
      console.log(`  eToken:         ${result.args.eToken}` );
      console.log(`  amount:         ${result.args.amount}` );
      console.log(`  amountA:        ${result.args.amountA}` );
      console.log(`  amountB:        ${result.args.amountB}` );
    // eslint-disable-next-line no-empty
    } catch(error) {}
  });
});
