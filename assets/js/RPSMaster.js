//a.Nap This was hard. 4/2/2018

var constMaxTime = 10000;
var config = {
  apiKey: "AIzaSyAI6iCZkMKh_VRJGL5h8tsWdNu55ejG_pA",
  authDomain: "homework7-c688a.firebaseapp.com",
  databaseURL: "https://homework7-c688a.firebaseio.com",
  projectId: "homework7-c688a",
  storageBucket: "homework7-c688a.appspot.com",
  messagingSenderId: "535894787000"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();

//handle database updates here
database.ref("/GameData").on("value", function (snapshot) {

  if (!snapshot.child("Player1").exists()) {
    //send database update here
    antRPS.YourGame = new antRPSGame();
    database.ref("/GameData").set(antRPS.YourGame);
  }
  else {
    //get database update here
    antRPS.YourGame = snapshot.val();

    antRPS.DisplayView();
  }
});

//antPlayer Class
function antPlayer(inName) {

  let irnd = Math.floor(Math.random() * 999);
  let d = new Date();
  this.id = 'ant' + d.getTime() + irnd;
  this.Name = inName;
  this.Wins = 0;
  this.Losses = 0;
  this.Games = 0;
  this.LastUpdate = d.getTime();
  this.Weapon = 'none';
  this.FieldSide = 'none';
  this.bRequiresUpdate = false;

}; //end antPlayer Class






//antRPSGame Class
function antRPSGame() {
  this.Player1 = new antPlayer('Player1');
  this.Player2 = new antPlayer('Player2');
  this.isReal = false;
  this.bRequiresUpdate = false;
  this.iGameState = 0;
  this.chat = 0;
  this.loser = 0;
  this.winner = 0;
  this.gotime = 0;
  this.bGameOver=false;

}  //end antRPSGame Class


//antRPS Class Begin
var antRPS = {  
  UpdatePlayer: function (inPlayer) {
    if(inPlayer.id !== antRPS.YourGame.Player1.id&&inPlayer.id !== antRPS.YourGame.Player2.id){
      return};
      if(inPlayer.id === antRPS.YourGame.Player1.id&&antRPS.YourGame.iGameState===1){
      return};  
      if(inPlayer.id === antRPS.YourGame.Player2.id&&antRPS.YourGame.iGameState===2){
        return};
    let d3 = new Date();
    if (Math.abs(d3.getTime() - inPlayer.LastUpdate) > 2000) {
      inPlayer.LastUpdate = d3.getTime();
      inPlayer.bRequiresUpdate = true;
    }
  },
  isRealPlayer: function (inPlayer) {
    let bPlayerReal = false;
    if (!(inPlayer.Name === 'NewPlayer' || inPlayer.Name === 'Player1' || inPlayer.Name === 'Player2')) {
      bPlayerReal = true;
    }
    return bPlayerReal;
  },
  isInGame: function (inPlayer) {
    if (inPlayer.FieldSide === 'none') { return false };
    return true;
  },
  isPlayerOld: function (inPlayer) {
    if ((!antRPS.isRealPlayer(inPlayer)) || (!antRPS.isInGame(inPlayer))) {
      return false;
    }
    let ImOld = false;
    let d2 = new Date();
    if (Math.abs(d2.getTime() - inPlayer.LastUpdate) > constMaxTime) {
      ImOld = true;
    }
    return ImOld;
  },

  Leave: function (inPlayer) {
    if(antRPS.YourPlayer.FieldSide==='Player1'){
      antRPS.YourGame.Player1 = new antPlayer('Player1');
    }else{
      antRPS.YourGame.Player2 = new antPlayer('Player2');
    }
    antRPS.YourPlayer.FieldSide = 'none';
    antRPS.UpdateData();
    antRPS.DisplayView();
    $('#Join').text('Join');
  },
  Join: function (inPlayer) {
    if($('#Join').text()==='Leave'){
      antRPS.Leave(inPlayer);
      return;
    }
    //Must be "Real" to join
    
    if (!antRPS.isRealPlayer(inPlayer)) {
      return false;
    }
    //You can't join a game your in.
    if (inPlayer.id === antRPS.YourGame.Player1.id || inPlayer.id === antRPS.YourGame.Player2.id) {
      return false;
    }
    
    
   
    
    //You can't join if the game is full
    if (antRPS.isRealPlayer(antRPS.YourGame.Player1) && antRPS.isRealPlayer(antRPS.YourGame.Player2)) {
      return false;
    } else if (!antRPS.isRealPlayer(antRPS.YourGame.Player1)) {
      antRPS.YourGame.Player1 = inPlayer;
      antRPS.YourGame.Player1.FieldSide = "Player1";
      
      antRPS.YourGame.bRequiresUpdate = true;
    } else if (!antRPS.isRealPlayer(antRPS.YourGame.Player2)) {
      antRPS.YourGame.Player2 = inPlayer;
      antRPS.YourGame.Player2.FieldSide = "Player2";      
      antRPS.YourGame.bRequiresUpdate = true;
    }
    $('#Join').text('Leave');
    antRPS.YourGame.isReal = true;
    antRPS.YourGame.bRequiresUpdate = true;
    $('#MyData').show();
    return inPlayer;
  },

  
  CycleInterval: '',
  bStart: true,
  YourPlayer: new antPlayer('NewPlayer'),
  YourGame: new antRPSGame(),
  Cycle: function () {

    

    let d = new Date();
    antRPS.UpdatePlayer(antRPS.YourPlayer);
    
    if(antRPS.YourGame.iGameState!==3&&antRPS.isPlayerOld(antRPS.YourGame.Player1)){      
      antRPS.YourGame.Player1.Weapon='TimeOut';      
      antRPS.YourGame.Player2.Weapon='Persistance';
      antRPS.YourGame.iGameState=3;
      antRPS.YourGame.bGameOver=true;
      antRPS.YourGame.gotime=d.getTime();

    
      antRPS.YourGame.winner= antRPS.YourGame.Player2;
      antRPS.YourGame.loser= antRPS.YourGame.Player1;
      antRPS.YourGame.bRequiresUpdate = true;     
    }
    if(antRPS.YourGame.iGameState!==3&&antRPS.isPlayerOld(antRPS.YourGame.Player2)){
      antRPS.YourGame.Player2.Weapon='TimeOut';
      antRPS.YourGame.Player1.Weapon='Persistance';
      antRPS.YourGame.iGameState=3;
      antRPS.YourGame.bGameOver=true;
      antRPS.YourGame.gotime=d.getTime();
      antRPS.YourGame.winner= antRPS.YourGame.Player1;
      antRPS.YourGame.loser= antRPS.YourGame.Player2;
      antRPS.YourGame.bRequiresUpdate = true;
    }
    if(antRPS.YourGame.iGameState===3&&antRPS.YourGame.gotime===0)
    {    
      antRPS.YourGame.gotime=d.getTime();
      antRPS.YourGame.bRequiresUpdate = true;
    }else if(antRPS.YourGame.iGameState===3&&(Math.abs(d.getTime() - antRPS.YourGame.gotime)>5000))
    {      
      antRPS.YourGame.iGameState=0;
      antRPS.YourGame.gotime=0;
      antRPS.Cycle();  
      antRPS.StartGame();
      antRPS.UpdateData();
      antRPS.DisplayView();
      return;
         
    } else if(antRPS.YourGame.iGameState===0&&antRPS.isRealPlayer(antRPS.YourGame.Player1)&&antRPS.isRealPlayer(antRPS.YourGame.Player2))
    { 
           
      antRPS.YourGame.iGameState=1;      
      antRPS.UpdateData();
      antRPS.DisplayView();
      return;
    } 
    
    
    if (antRPS.YourPlayer.bRequiresUpdate) {
      if (antRPS.isInGame(antRPS.YourPlayer)) {
        if (antRPS.YourPlayer.FieldSide === "Player1") {
          antRPS.YourGame.Player1 = antRPS.YourPlayer;
          antRPS.YourGame.bRequiresUpdate = false;
        }
        if (antRPS.YourPlayer.FieldSide === "Player2") {
          antRPS.YourGame.Player2 = antRPS.YourPlayer;
          antRPS.YourGame.bRequiresUpdate = false;
        }
        antRPS.YourGame.bRequiresUpdate = true;
      }
    };
    if (antRPS.YourGame.bRequiresUpdate) {
      
      antRPS.YourGame.bRequiresUpdate = false;
      antRPS.UpdateData();
      antRPS.DisplayView();
    }

  },
  JoinGame: function () {
    $('#cont0').hide();
    $('#cont1').show();
    if (!antRPS.isRealPlayer(antRPS.YourPlayer)) {
      //getPlayer
      $('#cont0').show();
      $('#cont1').hide();
      $('#getName').focus();
      return;
    }
    let hPlayer = antRPS.YourPlayer;
    antRPS.YourPlayer = antRPS.Join(antRPS.YourPlayer);
    if (!antRPS.YourPlayer) {
      antRPS.YourPlayer = hPlayer;
    }
    antRPS.YourGame.bRequiresUpdate = true;

  },
  StartGame: function () {
    console.log('Start');
    let d = new Date();
    //if(antRPS.YourGame.winner.id===antRPS.YourPlayer.id){
    if(antRPS.YourGame.winner){  
      if(antRPS.YourGame.Player1.Weapon ==='TimeOut'){
        antRPS.YourGame.Player1 = new antPlayer('Player1');
      }
      if(antRPS.YourGame.Player2.Weapon === 'TimeOut'){
        antRPS.YourGame.Player2 = new antPlayer('Player2');
      }
      antRPS.YourPlayer.LastUpdate = d.getTime();
      antRPS.YourPlayer.Weapon = 0;
      antRPS.YourGame.winner = 0;
      antRPS.YourGame.loser = 0;
      antRPS.UpdateData();
    }   
    
    
    
    
    
    
    $('#Player1contain').hide();
    $('#Player2contain').hide();
    $('#cont0').hide();
    $('#cont1').show();    
    if (antRPS.bStart) {
      antRPS.CycleInterval = setInterval(function () { antRPS.Cycle(); }, 750);



      antRPS.bStart = false;
      $('#Join').on('click', function (e) {
        antRPS.JoinGame();
      });
      $('#About').on('click', function (e) {

      })
      $('#getName').on('keyup', function (e) {
        if (e.key === 'Enter') {
          if ($('#getName').val().length > 0) {
            antRPS.YourPlayer.Name = $('#getName').val();
            antRPS.YourPlayer.bRequiresUpdate = true;
            antRPS.JoinGame();
          }
        }
      });

      $('#Enter').on('click', function (e) {
        if ($('#getName').val().length > 0) {
          antRPS.YourPlayer.Name = $('#getName').val();
          antRPS.YourPlayer.bRequiresUpdate = true;
          antRPS.JoinGame();
        }
      });
      $('#Rock1').on('click', function (e) {
        antRPS.YourGame.iGameState = 2;
        antRPS.YourPlayer.Weapon = "Rock";
        antRPS.YourPlayer.bRequiresUpdate = true;
        antRPS.YourGame.bRequiresUpdate = true;
      });
      $('#Rock2').on('click', function (e) {
        antRPS.YourGame.iGameState = 3;
        antRPS.YourGame.bGameOver=true;
        antRPS.YourPlayer.Weapon = "Rock";        
        antRPS.YourPlayer.bRequiresUpdate = true;
        antRPS.YourGame.bRequiresUpdate = true;
      });
      $('#Paper1').on('click', function (e) {
        antRPS.YourGame.iGameState = 2;
        antRPS.YourPlayer.Weapon = "Paper";
        antRPS.YourPlayer.bRequiresUpdate = true;

        antRPS.YourGame.bRequiresUpdate = true;

      });
      $('#Paper2').on('click', function (e) {
        antRPS.YourGame.iGameState = 3;
        antRPS.YourGame.bGameOver=true;
        antRPS.YourPlayer.Weapon = "Paper";        
        antRPS.YourPlayer.bRequiresUpdate = true;
        antRPS.YourGame.bRequiresUpdate = true;
      });
      $('#Scissor1').on('click', function (e) {
        antRPS.YourGame.iGameState = 2;
        antRPS.YourPlayer.Weapon = "Scissor";
        antRPS.YourPlayer.bRequiresUpdate = true;
        antRPS.YourGame.bRequiresUpdate = true;
      });
      $('#Scissor2').on('click', function (e) {
        antRPS.YourPlayer.Weapon = "Scissor";
        antRPS.YourGame.iGameState = 3;
        antRPS.YourGame.bGameOver=true;        
        antRPS.YourPlayer.bRequiresUpdate = true;
        antRPS.YourGame.bRequiresUpdate = true;
      });
    }
  },
  DisplayView: function () {
    //Set PlayerNames
    $('#Player1Name').text(antRPS.YourGame.Player1.Name);
    $('#Player2Name').text(antRPS.YourGame.Player2.Name);
    $('#Player1contain').hide();
    $('#Player2contain').hide();
    $('#MyData').hide();
    $('#MyData').empty();
    if(antRPS.YourPlayer.Name!=='NewPlayer'){
        
        $('#MyData').append($('<p>').text('Your Player Data'));
        $('#MyData').append($('<p>').text('Name: ' + antRPS.YourPlayer.Name));
        $('#MyData').append($('<p>').text('Wins: ' + antRPS.YourPlayer.Wins));
        $('#MyData').append($('<p>').text('Loses: ' + antRPS.YourPlayer.Losses));
        $('#MyData').append($('<p>').text('Games: ' + antRPS.YourPlayer.Games));
        $('#MyData').show();
    }
    $('#Arena').empty();
    switch (antRPS.YourGame.iGameState) {
      case 0:
                     
        break;
      case 1:
        //Set Player1 Turn
        if (antRPS.YourPlayer.FieldSide === "Player2") {
          //Player2 can't watch
          return;
        }
        $('#Arena').empty();
        $('#Arena').append($('<p>').text('Current Player Data'));
        $('#Arena').append($('<p>').text('Name: ' + antRPS.YourGame.Player1.Name ));
        $('#Arena').append($('<p>').text('Wins: ' + antRPS.YourGame.Player1.Wins));
        $('#Arena').append($('<p>').text('Loses: ' + antRPS.YourGame.Player1.Losses));
        $('#Arena').append($('<p>').text('Games: ' + antRPS.YourGame.Player1.Games));
        
        $('#Player1contain').show();
        break;
      case 2:
        if (antRPS.YourPlayer.FieldSide === "Player1") {
          //Player1 can't watch        
          return;
        }
        $('#Arena').empty();
        $('#Arena').append($('<p>').text('Current Player Data'));
        $('#Arena').append($('<p>').text('Name: ' + antRPS.YourGame.Player2.Name));
        $('#Arena').append($('<p>').text('Wins: ' + antRPS.YourGame.Player2.Wins));
        $('#Arena').append($('<p>').text('Loses: ' + antRPS.YourGame.Player2.Losses));
        $('#Arena').append($('<p>').text('Games: ' + antRPS.YourGame.Player2.Games));
        $('#Player2contain').show();
        break;
      case 3:

        let out = '';

         
        out = '<div>' + antRPS.YourGame.Player1.Name + ' chose: ' + antRPS.YourGame.Player1.Weapon + '</div><br>';
        out += '<div>' + antRPS.YourGame.Player2.Name + ' chose: ' + antRPS.YourGame.Player2.Weapon + '<div></div><br>';

        let winner = antRPS.WhoWon();
        out += '<div>' + winner + '<div></div>';



        $('#Arena').html(out);
        //$().text (antRPS.YourGame.Player1.Weapon);
        break;
      default:
        break;
    }

  },
  WhoWon: function () {
    if (antRPS.YourGame.Player1.Weapon === antRPS.YourGame.Player2.Weapon) {        
      return antRPS.HandleTie();      
      
      return 'The Game was a Tie!';      
    }
    if(antRPS.YourGame.Player1.Weapon ==='TimeOut'){
      return antRPS.HandleWinLoss(antRPS.YourGame.Player2, antRPS.YourGame.Player1);
      
    };
    if(antRPS.YourGame.Player2.Weapon ==='TimeOut'){
      return antRPS.HandleWinLoss(antRPS.YourGame.Player1, antRPS.YourGame.Player2);
      
    };
    
    let slt = antRPS.YourGame.Player1.Weapon + ':' + antRPS.YourGame.Player2.Weapon;
    switch (slt) {
      case 'Rock:Paper':
        return antRPS.HandleWinLoss(antRPS.YourGame.Player2, antRPS.YourGame.Player1);
        break;
      case 'Rock:Scissor':
        return antRPS.HandleWinLoss(antRPS.YourGame.Player1, antRPS.YourGame.Player2);
        break;
      case 'Paper:Rock':
        return antRPS.HandleWinLoss(antRPS.YourGame.Player1, antRPS.YourGame.Player2);
        break;
      case 'Paper:Scissor':
        return antRPS.HandleWinLoss(antRPS.YourGame.Player2, antRPS.YourGame.Player1);
        break;
      case 'Scissor:Rock':
        return antRPS.HandleWinLoss(antRPS.YourGame.Player2, antRPS.YourGame.Player1);
        break;
        break;
      case 'Scissor:Paper':
        return antRPS.HandleWinLoss(antRPS.YourGame.Player1, antRPS.YourGame.Player2);
        break;
    }

  },
  HandleTie: function(){
    let d = new Date();
    if (antRPS.YourGame.bGameOver) {
      
      if (antRPS.YourPlayer.id === antRPS.YourGame.Player1.id||antRPS.YourPlayer.id === antRPS.YourGame.Player2.id) {
        antRPS.YourPlayer.Games += 1;
        
      }
      antRPS.YourGame.gotime=d.getTime();      
      antRPS.YourPlayer.bRequiresUpdate=true;
      antRPS.YourGame.bRequiresUpdate=true;
      antRPS.YourGame.bGameOver = false;
    }
    antRPS.YourPlayer.bRequiresUpdate=true;
    antRPS.YourGame.bRequiresUpdate=true;    
    return 'Game is a Tie!';
  },
  HandleWinLoss: function (winner, loser) {
    let d = new Date();
    if (antRPS.YourGame.bGameOver) {
      
      if (antRPS.YourPlayer.id === winner.id) {
        antRPS.YourPlayer.Games += 1;
        antRPS.YourPlayer.Wins += 1;
      }
      if (antRPS.YourPlayer.id === loser.id) {
        antRPS.YourPlayer.Games += 1;
        antRPS.YourPlayer.Losses += 1;
      }
      antRPS.YourGame.gotime=d.getTime();      
      antRPS.YourPlayer.bRequiresUpdate=true;
      antRPS.YourGame.bRequiresUpdate=true;
      antRPS.YourGame.bGameOver = false;
    }


    if (antRPS.YourPlayer.id === winner.id) {              
        
        if (antRPS.YourPlayer.FieldSide === 'Player1') {
          
          antRPS.YourGame.winner = antRPS.YourGame.Player1;
          antRPS.YourGame.loser = antRPS.YourGame.Player2;
          antRPS.YourGame.bRequiresUpdate=true;
        }
        if (antRPS.YourPlayer.FieldSide === 'Player2') {
          
          antRPS.YourGame.winner = antRPS.YourGame.Player2;
          antRPS.YourGame.loser = antRPS.YourGame.Player1;
          antRPS.YourGame.bRequiresUpdate=true;
        }       
      };
        
    antRPS.YourPlayer.bRequiresUpdate=true;
    antRPS.YourGame.bRequiresUpdate=true;    
    return winner.Name + ' has won!';
  },
  UpdateData: function () {
    antRPS.YourGame.bRequiresUpdate = false;
    database.ref("/GameData").set(antRPS.YourGame);
  }
}//antRPS Class End


$(document).ready(function () {
  antRPS.StartGame();



});








