# Avoiding Common Attacks

## Force Sending Ether

I avoided this attack by limiting the cost of the game by 0.1 ETH and using a require.

## Reentrancy attacks

In this contract I do not send Ether to any account.

## Cross function race conditions

All the variables inside the contract don't involve Ether, and don't compromise the general workflow.