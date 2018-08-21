pragma solidity ^0.4.23;

contract BattleShip {
    uint rows = 10;
    uint cols = 10;
    uint sunken = 0;
    uint[5] ships = [5, 4, 3, 3, 2];
    string public m;
    mapping (string => uint) rLetter;

    /*event SunkenShip(string _word);
    event AllSunk(string _word);*/
    event Mensaje(string _word);

    constructor () public payable {    
        rLetter["A"] = 0;
        rLetter["B"] = 1;
        rLetter["C"] = 2;
        rLetter["D"] = 3;
        rLetter["E"] = 4;
        rLetter["F"] = 5;
        rLetter["G"] = 6;
        rLetter["H"] = 7;
        rLetter["I"] = 8;
        rLetter["J"] = 9;

        emit Mensaje("It works!");
    }

    /* lazy way of tracking when the game is won: just increment hitCount on every hit
       in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
       there are 17 hits to be made in order to win the game:
          Carrier     - 5 hits
          Battleship  - 4 hits
          Destroyer   - 3 hits
          Submarine   - 3 hits
          Patrol Boat - 2 hits
    */

    /* create the 2d array that will contain the status of each square on the board
       and place ships on the board (later, create function for random placement!)
       0 = empty, 1 - 5 = part of a ship, 8 = a sunken part of a ship, 9 = a missed shot
    */
    uint[10][10] public gameBoard = [
        [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 3, 4, 4, 4],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 5, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 5, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];


    function fireTorpedo(string _str_row, uint _col) public {
        //Convert (Letter,Column) to array (row,col)
        uint _row;
        _row = rLetter[_str_row];
        _col -= 1;

        // if player clicks a square with no ship, change the color and change square's value
        if (gameBoard[_row][_col] == 0) {

            // set this square's value to 9 to indicate that they fired and missed
            gameBoard[_row][_col] = 9;
            m = "Miss!";

            // if player clicks a square with a ship, change the color and change square's value
        } else if (gameBoard[_row][_col] >= 1 && gameBoard[_row][_col] < 6) {
            // set this square's value to indicate which ship has been hit 
            m = "Hit!";
            gameBoard[_row][_col] = shipStat(gameBoard[_row][_col]);
            // if player clicks a square that's been previously hit, let them know
        } else if (gameBoard[_row][_col] > 1) {
            // emit Message("Stop wasting your torpedos! You already fired at this location.");
            m = "Stop wasting your torpedos! You already fired at this location.";
        }

    }

    function shipStat(uint _cellVal) private returns(uint _stat) {
        if (_cellVal == 1 && ships[0] != 0) {
            ships[0] -= 1;
            _stat = 8;
            if (ships[0] == 0) {
                // emit Message("You destroyed my ship");
                m = "You destroyed my ship. ";
                sunken += 1;
            }

        } else if (_cellVal == 2 && ships[1] != 0) {
            ships[1] -= 1;
            _stat = 8;
            if (ships[1] == 0) {
                // emit Message("You destroyed my ship");
                m = "You destroyed my ship. ";
                sunken += 1;
            }

        } else if (_cellVal == 3 && ships[2] != 0) {
            ships[2] -= 1;
            _stat = 8;
            if (ships[2] == 0) {
                // emit Message("You destroyed my ship");
                m = "You destroyed my ship. ";
                sunken += 1;
            }

        } else if (_cellVal == 4 && ships[3] != 0) {
            ships[3] -= 1;
            _stat = 8;
            if (ships[3] == 0) {
                // emit Message("You destroyed my ship");
                m = "You destroyed my ship. ";
                sunken += 1;
            }

        } else if (_cellVal == 5 && ships[4] != 0) {
            ships[4] -= 1;
            _stat = 8;
            if (ships[4] == 0) {
                // emit Message("You destroyed my ship");
                m = "You destroyed my ship. ";
                sunken += 1;
            }
        }

        if (sunken == 5) m = "All Ships are sunk";
            //emit Message("All Ships are sunk");        
        return _stat;
    }

    function getShips() public view returns(uint[5]) {
        return ships;
    }

    function getBoard() public view returns(uint[10][10]) {
        return gameBoard;
    }
}