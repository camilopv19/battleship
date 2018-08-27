// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import {
  default as Web3
} from 'web3';
import {
  default as contract
} from 'truffle-contract'
import $ from "jquery";

// Import our contract artifacts and turn them into usable abstractions.
import battleship_artifacts from '../../build/contracts/BattleShip.json'

// Battleship is our usable abstraction, which we'll use through the code below.
var BattleShip = contract(battleship_artifacts);
var accounts;
var account;
var battleShipInstance;
var allSunkEvent;
var arrEventsFired;

window.App = {
  start: function () {
    var self = this;

    // Bootstrap the Battleship abstraction for Use.
    BattleShip.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
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
  useAccountOne: function () {
    account = accounts[1];
  },
  createNewGame: function () {
    BattleShip.new({
      from: account,
      value: web3.toWei(0.1, "ether"),
      gas: 4000000
    }).then(instance => {
      battleShipInstance = instance;
      $(".in-game").show();
      $("#getBrd").hide();
      $(".game-start").hide();
      $("#game-address").text(instance.address);
      $("h3").text("Place Patrol Craft");

      var table = $("<table>").insertAfter("span:last");
      table.attr("id", "matrix");

      var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      var nbr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var ctr;
      for (var i = 0; i < 11; i++) {
        var row = $("<tr>");
        for (var j = 0; j < 11; j++) {
          if (j == 0) {
            $("<td><p>" + ltr[i] + "</p></td>").appendTo(row);
          } else {
            if (i == 0) {
              $("<td><p>" + nbr[j] + "</p></td>").appendTo(row);
            } else {
              ctr = ltr[i] + nbr[j];
              var btn = "<button class='btn vert' id=" + ctr + "> </button>";
              $("<td>" + btn + "</td>").appendTo(row);
            }
          }
        }
        table.append(row);
      }

      $("button").click(function () {
        if( this.id != "create")
        {
          var shipCnt = parseInt($("#txt").text());
          var ltrs = ".ABCDEFGHIJ";
          var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
          var l = this.id.length > 2 ? -2 : -1;
          var row = this.id.slice(0, l);
          var rowNum = ltrs.indexOf(row);
          var col = parseInt(this.id.slice(1, 3));
          var dest = $(".place").length - 1;
          var me = "#" + this.id;
          var dropped = false;
          if ($("#save").attr("disabled") == "disabled" && !$("#tggl").attr("disabled")) {
  
            if (shipCnt == dest) {
              if (!$(this).hasClass("firing")) {
                if ($(this).hasClass("vert")) {
                  for (let i = rowNum; i <= rowNum + dest; i++) {
                    var id = "#" + ltr[i] + col;
                    if ($(id).hasClass("drop")) {
                      dropped = true;
                    }
                  }
  
                  if (!dropped) {
                    for (let i = rowNum; i <= rowNum + dest; i++) {
                      var id = "#" + ltr[i] + col;
                      $(id).addClass("drop");
                    }
                  } else {
                    if ($("h3").text() == "Place Destroyer" ||
                      $("h3").text() == "Place Submarine") {
                      shipCnt -= 1;
                    }
                    alert("One must not simply place a ship upon another");
                  }
  
                  //Ship order
                  var cnt = shipCnt;
                  if ($("h3").text() != "Place Destroyer" && !dropped) {
                    cnt = shipCnt + 1;
  
                    $("#txt").text(cnt);
                  }
                  switch (cnt) {
                    case 2:
                      if (
                        $("h3").text() != "Place Destroyer" &&
                        $("h3").text() != "Place Submarine") {
                        $("h3").text("Place Destroyer");
                      } else {
                        $("h3").text("Place Submarine");
                      }
                      break;
                    case 3:
                      $("h3").text("Place Battleship");
                      break;
                    case 4:
                      $("h3").text("Place Carrier");
                      break;
                    case 5:
                      $("#hit").attr("disabled", "disabled");
                      $("h3").text("Click on Save board to Start Game");
                      $("#save").removeAttr("disabled");
                      $("#tggl").attr("disabled", "disabled");
                      break;
                  }
                } else {
                  var coln = col + dest;
                  for (let i = col; i <= coln; i++) {
                    var id = "#" + row + i;
                    if ($(id).hasClass("drop")) {
                      dropped = true;
                    }
                  }
  
                  if (!dropped) {
                    for (let i = col; i <= coln; i++) {
                      var id = "#" + row + i;
                      $(id).addClass("drop");
                    }
                  } else {
                    if (
                      $("h3").text() == "Place Destroyer" ||
                      $("h3").text() == "Place Submarine"
                    ) {
                      shipCnt -= 1;
  
                    }
                    alert("One must not simply place a ship upon another");
                  }
  
                  //Ship order
                  var cnt = shipCnt;
                  if ($("h3").text() != "Place Destroyer" && !dropped) {
                    cnt = shipCnt + 1;
                    $("#txt").text(cnt);
                  }
                  switch (cnt) {
                    case 2:
                      if (
                        $("h3").text() != "Place Destroyer" &&
                        $("h3").text() != "Place Submarine"
                      ) {
                        $("h3").text("Place Destroyer");
                      } else {
                        $("h3").text("Place Submarine");
                      }
                      break;
                    case 3:
                      $("h3").text("Place Battleship");
                      break;
                    case 4:
                      $("h3").text("Place Carrier");
                      break;
                    case 5:
                      $("#hit").attr("disabled", "disabled");
                      $("h3").text("Click on Save board to Start Game");
                      $("#save").removeAttr("disabled");
                      $("#tggl").attr("disabled", "disabled");
                      break;
                  }
                }
              }
            } else {
              alert("Please, place the ship inside the board.");
            }
          } else if ($("#tggl").attr("disabled") && $(me).hasClass("firing")) {
  
            App.fire(row, col);
          }
        }
      });

      $(".btn").hover(
        function () {
          if ($("#save").attr("disabled") == "disabled") {
            var cell = $("#txt").text() == "" ? 1 : parseInt($("#txt").text());
            cell = parseInt(cell);
            var ltrs = ".ABCDEFGHIJ";
            var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
            var l = this.id.length > 2 ? -2 : -1;
            var row = this.id.slice(0, l);
            var rowNum = ltrs.indexOf(row);
            var col = parseInt(this.id.slice(1, 3));
            if (!$(this).hasClass("vert") && !$(this).hasClass("firing")) {
              for (let i = col; i <= col + cell; i++) {
                var _i = Math.min(Math.max(parseInt(i), 1), 10);
                document.getElementById(row + _i).classList.add("place");
              }
            } else if (!$(this).hasClass("firing")) {
              for (let i = rowNum; i <= rowNum + cell; i++) {
                var _i = Math.min(Math.max(parseInt(i), 1), 10);
                document.getElementById(ltr[_i] + col).classList.add("place");
              }
            }
          }
        },
        function () {
          if ($("#save").attr("disabled") == "disabled") {
            var cell = $("#txt").text() == "" ? 1 : parseInt($("#txt").text());
            cell = parseInt(cell);
            var ltrs = ".ABCDEFGHIJ";
            var ltr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
            var l = this.id.length > 2 ? -2 : -1;
            var row = this.id.slice(0, l);
            var rowNum = ltrs.indexOf(row);
            var col = parseInt(this.id.slice(1, 3));

            if (!$(this).hasClass("vert") && !$(this).hasClass("firing")) {
              for (let i = col; i <= col + cell; i++) {
                var _i = Math.min(Math.max(parseInt(i), 1), 10);
                document.getElementById(row + _i).classList.remove("place");
              }
            } else if (!$(this).hasClass("firing")) {
              for (let i = rowNum; i <= rowNum + cell; i++) {
                var _i = Math.min(Math.max(parseInt(i), 1), 10);
                document.getElementById(ltr[_i] + col).classList.remove("place");
              }
            }
          }
        }
      );

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
  saveBoard: function () {
    var boardCell = [
      [ "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10" ],
      [ "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10" ],
      [ "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10" ],
      [ "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10" ],
      [ "E1","E2","E3","E4","E5","E6","E7","E8","E9","E10" ],
      [ "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10" ],
      [ "G1","G2","G3","G4","G5","G6","G7","G8","G9","G10" ],
      [ "H1","H2","H3","H4","H5","H6","H7","H8","H9","H10" ],
      [ "I1","I2","I3","I4","I5","I6","I7","I8","I9","I10" ],
      [ "J1","J2","J3","J4","J5","J6","J7","J8","J9","J10" ]
  ];
    var numItems = $(".drop").length;
    if (numItems == 17) {

      var $btnList = $(".btn");
      if ($btnList.hasClass("firing")) {} else {

        var ids = $(".drop")
          .map(function () {
            return this.id;
          })
          .get();
        $("#myIds").text(ids.join());
         var myArray = [];
          battleShipInstance.saveBoard(ids.join(), {from: account}).then(brdResult => {
            console.log(brdResult);
            $("#save").attr("disabled", "disabled");
            $("h3").text("Board saved");
            $("#getBrd").show();
            $
            App.cleanBoard();
            $btnList.addClass("firing");
          });
      }
    } else {
      alert("Something went wrong with the board, please Refresh this page.");
    }
  },
  cleanBoard: function () {
    var $btnList = $('.btn');
    $btnList.removeClass('place');
    $btnList.removeClass('vert');
    $btnList.removeClass('drop');
    $btnList.removeClass('firing');
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
    // let status = document.getElementById ("myIds");
    // var latestBlock = web3.eth.blockNumber;
    if (arrEventsFired.length == 0) {
      var cell = "#" + r + c;
      battleShipInstance.fireTorpedo(r, c, {
        from: account
      }).then(txresult => {
        console.log("Torpedo fired at " + r + c);

        // battleShipInstance.Message().watch ( (err, response) => {  //set up listener for the AuctionClosed Event
        //   //once the event has been detected, take actions as desired
        //   status.innerHTML = response.args._word;
        // });

        battleShipInstance.showHit().then(txresult => {
          var color = "";
          var mresult = txresult.c[0];

          if (mresult == 8 || mresult == 7 || mresult == 10) {
            color = "3c3";
          } else if (mresult == 9) {
            color = "f00";
          }

          switch (mresult) {
            case 6:
              console.log("Stop wasting torpedos!");
              break;
            case 7:
              console.log("You sunk my ship");
              break;
            case 8:
              console.log("Hit!");
              break;
            case 9:
              console.log("Miss!");
              break;
            case 10:
              App.listenToEvents();
              console.log("You sunk all my ships: YOU WIN!");
              break;
          }
          $(cell).css({
            background: "-webkit-gradient(linear,left top, right bottom, from(#" + color + "), to(#000))"
          });

        });
      });
    }
  },
  getBoard: function () {
    battleShipInstance.getBoard().then(txResult => {

      App.cleanBoard();
      var ltr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      var nbr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var cell;

      for (let i = 0; i < txResult.length; i++) {
        for (let j = 0; j < txResult.length; j++) {
          var _stat = txResult[i][j].c[0];
          var color = "bcf";
          switch (_stat) {
            case 7:
              color = "3c3";
              break;
            case 8:
              color = "3c3";
              break;
            case 9:
              color = "f00";
              break;
            case 10:
              color = "ff0";
              break;
          }

          if (txResult[i][j].c[0] > 0 && txResult[i][j].c[0] < 9) {
            cell = "#" + ltr[i] + nbr[j];
            $(cell).css({
              background: "-webkit-gradient(linear,left top, right bottom, from(#" + color + "), to(#000))"
            });
          }
        }
      }
    });
  },
  listenToEvents: function () {
    allSunkEvent = battleShipInstance.AllSunk();
    allSunkEvent.watch(App.allSunk);
  },
  allSunk: function (err, eventObj) {
    allSunkEvent.stopWatching();
    if (eventObj.args._win) {
      alert("Congratulations, You Won!");
      var element = document.getElementById("matrix");
      element.parentNode.removeChild(element);
      App.cleanBoard();
      $(".in-game").hide();
      $(".game-start").show();
      $("h3").text("");
      $("#save").attr("disabled", "disabled");
      $("#tggl").attr("disabled", false);
      $("#txt").text("1");
      // var styles = {
      //   height: "60px",
      //   width: "60px",
      //   border: "none",
      //   background: "-webkit-gradient(linear,left top, right bottom, from(#03c), to(#3cf))"
      // };
      // var $btnList = $('#matrix .btn');
      // $btnList.css(styles);
      // $btnList.addClass("vert");
    }
  }

};

window.addEventListener('load', function () {
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