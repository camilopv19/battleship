# Battleship on Blockchain 
## (ConsenSys Developer Program - 2018)
Caveman-style battleship with Blockchain (Eth) and React-Truffle project

### In order to run this project you must follow these steps:

1. Install Git
2. and NodeJS (including NPM) on Your Computer
3. Open a Terminal/Command Line and then git clone "https://github.com/camilopv19/battleship.git"
4. cd battleship
5. npm install
6. npm install -g truffle
7. truffle develop (if it's not recognized as a command you must go to the project's main folder and change the file "truffle.js" to "truffe-config.js"
    7.1 compile
    7.2 migrate (or migrate --reset)
8. Open your browser (Chrome recommended)
9. Install Metamask and
     - Create account or
     - Sign in with the seed phrase given by the -truffle develop- command.
10. In Metamask, connect to the local (custom) RPC: http://127.0.0.1:9545
11. Open a second Terminal/Command Line in the same folder and...
12. Type in npm run dev
13. Open the browser and go to http:localhost:8080

### Gameplay
Standard rules: https://en.wikipedia.org/wiki/Battleship_(game)
This project is made for 1 player and uses a fixed 2D array simulating the enemy's board. These are the steps:

1. Create a game by clicking on the blue button. This fires a transaction in Metamask that should be submitted.
2. Place all the ships inside the board (from the smallest to the biggest).
	- Toggle ship orientation between horizontal and vertical by clicking on the button.
3. Save board
4. Start guessing by clicking on every cell and see the block change its color according the success/fail of the guess. Each click fires a transaction in Metamask that should be submitted.

The game shows when all of the ships are sunk or just one of them.
