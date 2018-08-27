pragma solidity ^ 0.4 .23;

/**
 * Battleship contract
 * 
 * In summary this is a simple contract of a 1 player battleship game 
 * where the enemy board is fixed and the player can store his/her own
 * board.
 * This project has a simple way of tracking when the game is won: Set
 * the last shot to a value of 10 and process the answer in the Front-
 * end.
 * 
 * In order to win the game, there are 5 ships to be sunk, with the
 * following number of shots:
    Carrier - 5 hits
    Battleship - 4 hits
    Destroyer - 3 hits
    Submarine - 3 hits
    Patrol Boat - 2 hits
 *
 * The 2d fixed array will contain the status of each square on 
 * the board according to:
    0 : Empty
    1 : Part of the Carrier
    2 : Part of the Battleship
    3 : Part of the Destroyer
    4 : Part of the Submarine
    5 : Part of the Patrol Boat
 *
 * @author Camilo Patino <kmilopv@gmail.com>
 *
 */
contract BattleShip {
    // Contract Variables
    uint constant public gameCost = 0.1 ether;
    mapping(string => uint)rLetter;
    uint rows = 10;
    uint cols = 10;
    uint sunken = 0;
    // uint[5] ships = [5, 4, 3, 3, 2];
    uint[5] ships = [0, 0, 0, 0, 2];
    uint _result;
    string _boardStr;
    uint[10][10] public gameBoard;
    
    event AllSunk(bool _win);
    event Message(string _word);

    constructor()public payable {
        require(msg.value == gameCost);
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

        gameBoard = [
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
    }

    /** @dev Stores the users board - Only a string (I couldn't pass an array from Front-end).
      * @param _brd Array with new board
      * @param _brd String with the 17 cells of the ships
      */
    function saveBoard(string _brd)
    public
    returns(uint[10][10]){
        _boardStr = _brd;
        return gameBoard;
    }
    // function saveBoard(uint[17] _brd)
    // public 
    // pure
    // returns(uint[17]){
    //     return _brd;
    // }

    /** @dev Returns the result in UINT format, according the guess in the board.
      */
    function showHit() 
    public 
    view 
    returns(uint){
        return _result;
    }

    /** @dev Matches the shot of the player with the fixed board and stores the result
      * @param _str_row Letter of the row. 
      * @param _col Number of the column.
      */
    function fireTorpedo(string _str_row, uint _col) 
    public {
        //Convert (Letter,Column) to array (row,col)
        uint _row;
        _result = gameBoard[_row][_col];
        _row = rLetter[_str_row];
        _col -= 1;

        // If player clicks a square with no ship, change the color and change square's value.
        if (gameBoard[_row][_col] == 0) {

            // Set this square's value to 9 to indicate that the shot is missed.
            gameBoard[_row][_col] = 9;
            _result = 9;
            
        // If player clicks a square with a ship, change the color and change square's value.
        } else if (gameBoard[_row][_col] >= 1 && gameBoard[_row][_col] < 6) {

            // Set this square's value to indicate a hit
            _result = shipStat(gameBoard[_row][_col]);
            gameBoard[_row][_col] = _result;
            if (_result == 8) {
                emit Message("Hit!");
            } else {
                emit Message("You sunk my ship!");
            }
            // If player clicks a square that's been previously hit, let it know.
        } else if (gameBoard[_row][_col] > 1) {

            // Keep the same result
            _result = 6;
        }
    }

    /** @dev Checks the status of each ship according to successful hit, and 
      * returns a result whether the ship got sunk or not.
      * @param _cellVal Cell (or ship) value in the board that got hit.
      * @return _stat Result of the status:
      *               7: Sunk ship
      *               8: Single hit
      *               10: All ships sunk
      */
    function shipStat(uint _cellVal)
    private 
    returns(uint _stat) {

        // Carrier
        if (_cellVal == 1 && ships[0] != 0) {
            ships[0] -= 1;

            if (ships[0] == 0) {
                sunken += 1;
                _stat = 7;
            }
            else{
                _stat = 8;
            }

        // Battleship
        } else if (_cellVal == 2 && ships[1] != 0) {
            ships[1] -= 1;

            if (ships[1] == 0) {
                sunken += 1;
                _stat = 7;
            }
            else{
                _stat = 8;
            }

        // Destroyer
        } else if (_cellVal == 3 && ships[2] != 0) {
            ships[2] -= 1;

            if (ships[2] == 0) {
                sunken += 1;
                _stat = 7;
            }
            else{
                _stat = 8;
            }

        // Submarine
        } else if (_cellVal == 4 && ships[3] != 0) {
            ships[3] -= 1;

            if (ships[3] == 0) {
                sunken += 1;
                _stat = 7;
            }
            else{
                _stat = 8;
            }

        //Patrol Boat
        } else if (_cellVal == 5 && ships[4] != 0) {
            ships[4] -= 1;

            if (ships[4] == 0) {
                sunken += 5;
                // sunken += 1;
                _stat = 7;
            }
            else{
                _stat = 8;
            }
        }

        //All ships sunk
        if (sunken == 5) {
            _stat = 10;
            emit AllSunk(true);
        }

        return _stat;
    }

    /** @dev Returns the ships array.
      */
    function getShips()
    public
    view
    returns(uint[5]) {
        return ships;
    }

    /** @dev Returns the board (10x10 array).
      */
    function getBoard()
    public
    view
    returns(uint[10][10]) {
        return gameBoard;
    }
}
