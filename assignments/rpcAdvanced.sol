pragma solidity ^0.4.23;

contract rpsAdvanced
{
    mapping (string => mapping(string => int)) payoffMatrix;
    address player1;
    address player2;
    address activePlayer;
    bytes32 player1ChoiceHash;
    bytes32 player2ChoiceHash;
    string public player1Choice;
    string public player2Choice;
    uint firstRevealTime;
    uint constant public gameCost = 0.2 ether;
    uint amount_val;
    uint timeToReact = 20 seconds;
    bool gameActive;
    uint gameValidUntil;

    event PlayerJoined(address player);
    event NextPlayer(address player);

    /*modifier notRegisteredYet()
    {
        require(msg.sender != player1 && msg.sender != player2,"Both players must register.");
        _;
    }*/
    modifier isRegistered()
    {
        require( !(msg.sender != player1) || !(msg.sender != player2),"Both players must register.");
        _;
    }                   
    
    modifier sentEnoughCash(uint amount)
    {
        require(msg.value >= amount,"Not enough ETH provided");
        _;
    }
    
    modifier validChoice(string choice)
    {
        bytes32 c = keccak256(abi.encodePacked(choice));
        bytes32 r = keccak256("rock");
        bytes32 p = keccak256("paper");
        bytes32 s = keccak256("scissors");
        // hack until we can use StringUtils.equal
        require(c == r || c == p || c == s, "Invalid choice");
        _;
    }
    
    constructor() 
    public 
    payable
    {   // constructor (spoiler alert: rename this if you rename the contract!)
        player1 = msg.sender;
        require(msg.value >= gameCost, "Not enough ETH provided");

        payoffMatrix["rock"]["rock"] = 0;
        payoffMatrix["rock"]["paper"] = 2;
        payoffMatrix["rock"]["scissors"] = 1;
        payoffMatrix["paper"]["rock"] = 1;
        payoffMatrix["paper"]["paper"] = 0;
        payoffMatrix["paper"]["scissors"] = 2;
        payoffMatrix["scissors"]["rock"] = 2;
        payoffMatrix["scissors"]["paper"] = 1;
        payoffMatrix["scissors"]["scissors"] = 0;
    }
    
    function joinGame() public payable {
        require(player2 == address(0) && player1 != msg.sender, "Must be player2!");
        require(msg.value == gameCost, "Not enought ETH provided (Please submit a Value)");
        gameActive = true;
        player2 = msg.sender;
        emit PlayerJoined(player2);
        if(block.number % 2 == 0) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }

        gameValidUntil = now + timeToReact;

        emit NextPlayer(activePlayer);
    }

    function getVal() public view returns(uint){
        return amount_val;
    }

    function play(string choice, string randStr) 
        public
        isRegistered
        validChoice(choice)
    {
        assert(gameActive);
        bytes32 ch = keccak256(abi.encodePacked(choice));
        bytes32 srs = keccak256(abi.encodePacked(randStr));
        bytes32 ch_hash = keccak256(abi.encodePacked(ch ^ srs));
        
        if (msg.sender == player1)
            player1ChoiceHash = ch_hash;
        else if (msg.sender == player2)
            player2ChoiceHash = ch_hash;

        if(activePlayer == player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
        emit NextPlayer(activePlayer);
    }
    
    function reveal(string choice, string randStr)
        public
        isRegistered
        validChoice(choice)
    {
        bytes32 ch = keccak256(abi.encodePacked(choice));
        bytes32 srs = keccak256(abi.encodePacked(randStr));
        bytes32 ch_hash = keccak256(abi.encodePacked(ch ^ srs));
        
        // second player has 120 seconds after first player revealed
        if (bytes(player1Choice).length == 0 && bytes(player2Choice).length == 0)
            firstRevealTime == block.number;

        // if hashed choice + randStr is matching the initial one, choice is stored
        if (msg.sender == player1 && ch_hash == player1ChoiceHash)
            player1Choice = choice;
        if (msg.sender == player2 && ch_hash == player2ChoiceHash)
            player2Choice = choice;
    }
    
    function checkWinner()
    public
    isRegistered
    returns (string w)
    {
        if (bytes(player1Choice).length != 0 && bytes(player2Choice).length != 0)
        {
            w = "";
            gameActive = false;
            // if both revealed, obtain winner in usual way
            int winner = payoffMatrix[player1Choice][player2Choice];
            if (winner == 1){
                player1.transfer(address(this).balance);
                w = "Player 1 is winner";
            }
            else if (winner == 2){
                player2.transfer(address(this).balance);
                w = "Player 2 is winner";
            }
            else
            {
                player1.transfer(address(this).balance/2);
                player2.transfer(address(this).balance);
                w = "Draw: Refunded";
            }
            // unregister players and choices
            player1Choice = "";
            player2Choice = "";
            return w;
        }
        else if (block.number > firstRevealTime + timeToReact)
        {
            // if only one player revealed and time > start + timeout, winner is the one who revealed first
            if (bytes(player1Choice).length != 0){
                gameActive = false;
                player1.transfer(address(this).balance);
                w = "Player 1 is winner";
            }
            else if (bytes(player2Choice).length != 0){
                gameActive = false;
                player2.transfer(address(this).balance);
                w = "Player 2 is winner";
                
            }
            // unregister players and choices
            player1Choice = "";
            player2Choice = "";
            return w;
        }
        
        
    }
    
    // HELPER FUNCTIONS
    function getMyBalance () public view returns (uint amount)
    {
        return msg.sender.balance;
    }
    
    function getContractBalance () public view returns (uint amount)
    {
        return address(this).balance;
    }
    
    function WhoAmI() public view returns (string)
    {
        if(msg.sender == player1){
            return "Player 1";
        }
        else if (msg.sender == player2) {
            return "Player 2";
        } else {
            return "Nobody, please register";
        }
    }

    function getPlayers() public view returns(address[2]){
        return [ player1, player2 ];
    }
    
    // \HELPER FUNCTIONS
}