// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.1;

import "../interfaces/IAggregatorV3Interface.sol";

contract AggregatorMock is AggregatorV3Interface {
    uint8 public constant override decimals = 18;
    string public constant override description = "";
    uint256 public constant override version = 0;

    int256 private answer;

    function setAnswer(int256 _answer) external {
        answer = _answer;
    }

    function getRoundData(
        uint80 /* _roundId */
    ) external view override returns (uint80, int256, uint256, uint256, uint80) {
        return (0, answer, 0, 0, 0);
    }

    function latestRoundData() external view override returns (uint80, int256, uint256, uint256, uint80) {
        return (0, answer, 0, 0, 0);
    }
}
