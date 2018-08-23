// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import $ from "jquery";

// Import our contract artifacts and turn them into usable abstractions.
import battleship_artifacts from '../../build/contracts/BattleShip.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var BattleShip = contract(battleship_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var battleShipInstance;
var nextPlayerEvent;
var gameOverWithWinEvent;
var gameOverWithDrawEvent;
var arrEventsFired;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    BattleShip.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      arrEventsFired = [];

    });
  },
  useAccountOne: function() {
    account = accounts[1];
  },
  createNewGame: function() {
    BattleShip.new({from:account, value:web3.toWei(0.1,"ether"), gas:3000000}).then(instance => {
      battleShipInstance = instance;

      // console.log(instance);
      $(".in-game").show();
      $(".waiting-for-join").hide();
      $(".game-start").hide();
      $("#game-address").text(instance.address);
      
      var table = $("<table>").insertAfter("div:last");
      table.attr('id', 'matrix');
      //table.attr('class', 'parent');  //Nueva línea
      var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      var nbr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var ctr;
      for (var i = 0; i < 11; i++) {
        var row = $("<tr>");
        for (var j = 0; j < 11; j++) {
          if (j == 0) {
            $("<td><p>" + ltr[i] + "</p></td>").appendTo(row);
          }
          else {
            if (i == 0) {
              $("<td><p>" + nbr[j] + "</p></td>").appendTo(row);
            } else {
              ctr = ltr[i] + nbr[j];
              var btn = "<button class='btn vert' id=" + ctr + "> </button>"
              $("<td>" + btn + "</td>").appendTo(row);
            }
          }
        }
        table.append(row);
      }

      $("button").click(function () {
        var ltrs = ".ABCDEFGHIJ";
        var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var l = this.id.length > 2 ? -2 : -1;
        var row = (this.id).slice(0, l);
        var rowNum = ltrs.indexOf(row);
        var col = parseInt((this.id).slice(1, 3));
        var dest = $('.place').length - 1;
        var me = this.id;
        if (!$(this).hasClass('firing')) {

          if ($(this).hasClass('vert')) {
            //console.log(me + " to " + ltr[rowNum + dest] + col);
            for (let i = rowNum; i <= (rowNum + dest); i++) {
              var id = "#" + ltr[i] + col;
              $(id).addClass('drop');
            }
          }
          else {
            var coln = col + dest;
            //console.log(me + " to " + row + coln);
            for (let i = col; i <= coln; i++) {
              var id = "#" + row + i;
              $(id).addClass('drop');
            }
          }
        }
        else {
          
          App.fire(row, col);
        }

      });

      $(".btn").hover(
        // fired on entry
        function () {
          var cell = $("#txt").val() == "" ? 1 : $("#txt").val();
          cell = parseInt(cell);
          var ltrs = ".ABCDEFGHIJ";
          var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
          var l = this.id.length > 2 ? -2 : -1;
          var row = (this.id).slice(0, l);
          var rowNum = ltrs.indexOf(row);
          var col = parseInt((this.id).slice(1, 3));
          if (!$(this).hasClass('vert') && !$(this).hasClass('firing')) {
            //console.log(col + cell);
            for (let i = col; i <= (col + cell); i++) {
              //console.log(row + i);
              document.getElementById(row + i).classList.add('place');
            }
          }
          else if (!$(this).hasClass('firing')) {
            for (let i = rowNum; i <= (rowNum + cell); i++) {
              document.getElementById(ltr[i] + col).classList.add('place');
            }
          }

        },
        function () {
          var cell = $("#txt").val() == "" ? 1 : $("#txt").val();
          cell = parseInt(cell);
          var ltrs = ".ABCDEFGHIJ";
          var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
          var l = this.id.length > 2 ? -2 : -1;
          var row = (this.id).slice(0, l);
          var rowNum = ltrs.indexOf(row);
          var col = parseInt((this.id).slice(1, 3));

          if (!$(this).hasClass('vert') && !$(this).hasClass('firing')) {
            //console.log(col + cell);
            for (let i = col; i <= (col + cell); i++) {
              //console.log(row + i);
              document.getElementById(row + i).classList.remove('place');
            }
          }
          else if (!$(this).hasClass('firing')) {

            for (let i = rowNum; i <= (rowNum + cell); i++) {
              document.getElementById(ltr[i] + col).classList.remove('place');
            }
          }

        }
      );

      //$("#waiting").show();
/*
      var playerJoinedEvent = battleShipInstance.PlayerJoined();

      playerJoinedEvent.watch(function(error, eventObj) {
        if(!error) {
          console.log(eventObj);
        } else {
          console.error(error);
        }
        $(".waiting-for-join").show();
        $("#opponent-address").text(eventObj.args.player);
        $("#your-turn").hide();
        playerJoinedEvent.stopWatching();

      });
      App.listenToEvents();
      console.log(instance);*/
    }).catch(error => {
      console.error(error);
    })
  },
  orientation: function () {
    var $btnList = $('.btn');
    if ($btnList.hasClass('vert')) {
      $btnList.removeClass('vert');
    } else {
      $btnList.addClass('vert');
    }
  },
  getMessage: function () {
    battleShipInstance.m().then(mresult => { 
      console.log(mresult);
    });
  },
  firingState: function () {
    var $btnList = $('.btn');
    if ($btnList.hasClass('firing')) {
      $btnList.removeClass('firing');
    } else {
      $btnList.addClass('firing');
    }
  },
  fire: function (r, c) {
    battleShipInstance.fireTorpedo(r,c,{from: account}).then(txresult => {
      console.log(r + c + " fired! Check message");
      battleShipInstance.m().then(mresult => {
        // alert(mresult);
        var cell = "#" + r + c;
        var color = "";
        if (mresult == "Hit!" || mresult == "You destroyed my ship. ") {
          color = "3c3";
        } else if (mresult == "Miss!"){
          color = "f00";
        }
        $(cell).css({
          background: "-webkit-gradient(linear,left top, right bottom, from(#" + color + "), to(#000))"
        });
      });
    }).catch(error => {
      console.error(error);
    });
  },
  getBoard: function () {
    battleShipInstance.getBoard().then(txResult => {
      // console.log(txResult);
      var ltr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      var nbr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var cell;

      for (let i = 0; i < txResult.length; i++) {
        for (let j = 0; j < txResult.length; j++) {
          if (txResult[i][j].c[0] > 0) {
            cell = "#" + ltr[i] + nbr[j];
              $(cell).css({
                background: "-webkit-gradient(linear,left top, right bottom, from(#bcf), to(#000))"
              });
          } 
        }
      }
    });
  },
  joinGame: function() {
    var gameAddress = prompt("Address of the Game");
    if(gameAddress != null) {
      BattleShip.at(gameAddress).then(instance => {
        battleShipInstance = instance;

        App.listenToEvents();

        return battleShipInstance.joinGame({from:account, value:web3.toWei(0.1, "ether"), gas:3000000});
      }).then(txResult => {
        $(".in-game").show();
        $(".game-start").hide();
        $("#game-address").text(battleShipInstance.address);
        $("#your-turn").hide();
        battleShipInstance.player1.call().then(player1Address => {
          $("#opponent-address").text(player1Address);
        })
        console.log(txResult);
        
      })
    }
  },
  listenToEvents: function() {
    nextPlayerEvent = battleShipInstance.NextPlayer();
    nextPlayerEvent.watch(App.nextPlayer);

    gameOverWithWinEvent = battleShipInstance.GameOverWithWin();
    gameOverWithWinEvent.watch(App.gameOver);

    gameOverWithDrawEvent = battleShipInstance.GameOverWithDraw();
    gameOverWithDrawEvent.watch(App.gameOver);
  },
  nextPlayer: function(error, eventObj) {
    if(arrEventsFired.indexOf(eventObj.blockNumber) === -1) {
      arrEventsFired.push(eventObj.blockNumber);
      App.printBoard();
      console.log(eventObj);

      if(eventObj.args.player == account) {
        //our turn
        /**
        Set the On-Click Handler
        **/
        for(var i = 0; i < 3; i++) {
          for(var j = 0; j < 3; j++) {
            if($("#board")[0].children[0].children[i].children[j].innerHTML == "") {
              $($("#board")[0].children[0].children[i].children[j]).off('click').click({x: i, y:j}, App.setStone);
            }
          }
        }
        $("#your-turn").show();
        $("#waiting").hide();
      } else {
        //opponents turn

        $("#your-turn").hide();
        $("#waiting").show();
      }

    }
  },
  gameOver: function(err, eventObj) {
    console.log("Game Over", eventObj);
    if(eventObj.event == "GameOverWithWin") {
      if(eventObj.args.winner == account) {
        alert("Congratulations, You Won!");
      } else {
        alert("Woops, you lost! Try again...");
      }
    } else {
      alert("That's a draw, oh my... next time you do beat'em!");
    }


    nextPlayerEvent.stopWatching();
    gameOverWithWinEvent.stopWatching();
    gameOverWithDrawEvent.stopWatching();

    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
            $("#board")[0].children[0].children[i].children[j].innerHTML = "";
      }
    }

      $(".in-game").hide();
      $(".game-start").show();
  },
  setStone: function(event) {
    console.log(event);

    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        $($("#board")[0].children[0].children[i].children[j]).prop('onclick',null).off('click');
      }
    }

    battleShipInstance.setStone(event.data.x, event.data.y, {from: account}).then(txResult => {
      console.log(txResult);
      App.printBoard();
    })
  },
  printBoard: function() {
    battleShipInstance.getBoard.call().then(board => {
      for(var i=0; i < board.length; i++) {
        for(var j=0; j < board[i].length; j++) {
          if(board[i][j] == account) {
            $("#board")[0].children[0].children[i].children[j].innerHTML = "X";
          } else if(board[i][j] != 0) {
              $("#board")[0].children[0].children[i].children[j].innerHTML = "O";
          }
        }
      }
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
