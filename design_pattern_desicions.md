# Design Pattern Decisions

## Fail early and fail loud

- I used require method with its descriptive failure text because it's the safest way of limiting the function execution. 

- I also used this method wit modifiers in order to make sure the functions accomplish criteria before the first line inside them executes.

## State machine

The contract uses a state machine approach for the creation of the boards, in which the first state of a Battleship game is the ship placement, followed by the guessing state and ending with the last hit (17 successful hits). Following states ensures the natural flow of the game and avoid unusual events or even attacks like trying to guess (or fire a torpedo) in the ship placement phase.

- I used modifiers connected to enum variables to guarantee the correct flow through states.


Mermaid
sequenceDiagram
User ->> Contract: Create new game
Contract-->>User: Game created
User ->> Contract: Ship placement

User ->> Contract: Place ships