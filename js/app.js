class GameBoard {
    constructor() {
        this.diceImagePositions = [380, 318, 256, 195, 133, 71];
        this.players = {};
        this.playerPositions = {red: 0, green: 0};
        this.currentPlayerTurn = 0;
        this.numberOfPlayers = 4;
        this.isPlaying = false;
        this.playerNames = ["red", "green"];
        this.isGameOver = true;
        this.podium = [];
        this.scale = 1;
    }

    getBoard = () => {
        return this.board;
    }

    setBoard = (board) => {
        this.board = board;
    }

    getPlayers = () => {
        return this.players;
    }

    setPlayers = (players) => {
        this.players = players;
    }

    getCurrentPlayerTurn = () => {
        return this.currentPlayerTurn;
    }

    setCurrentPlayerTurn = (currentPlayerTurn) => {
        this.currentPlayerTurn = currentPlayerTurn;
    }

    getNumberOfPlayers = () => {
        return this.numberOfPlayers;
    }

    setNumberOfPlayers = (numberOfPlayers) => {
        this.numberOfPlayers = numberOfPlayers;
    }

    getIsPlaying = () => {
        return this.isPlaying;
    }

    setIsPlaying = (isPlaying) => {
        this.isPlaying = isPlaying;
    }

    getDiceImagePositions = () => {
        return this.diceImagePositions;
    }

    rollDice = () => {
        let val = Math.floor(Math.random() * 6) + 1;
        // let val = 1;
        return val;
    }

    setPodium = (newPlayer) => {
        if (!this.podium.includes(newPlayer)) {
            this.podium.push(newPlayer);
            let currentFinisher = this.players[newPlayer];
            currentFinisher.getPiece().classList.add("podium");
            document.querySelector("#gamePodium").appendChild(currentFinisher.getPiece());
            
            // For a two-player game, end immediately when first player reaches 100
            if (this.numberOfPlayers === 2) {
                // Show winner modal
                this.showWinnerModal(newPlayer);
                // Set game as over
                this.isGameOver = true;
            }
        }

        if (this.podium.length > 0) {
            document.querySelector("#gamePodium").style.display = "flex";
        } else {
            document.querySelector("#gamePodium").style.display = "none";
        }
    }

    updatePodium = () => {
        for (let playerName in this.playerPositions) {
            if (this.playerPositions[playerName] === 100) {
                this.setPodium(playerName);
            }
        }
    }

    showWinnerModal = (winner) => {
        // Create modal elements if they don't exist
        if (!document.getElementById('winnerModal')) {
            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'winnerModalOverlay';
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100%';
            modalOverlay.style.height = '100%';
            modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.zIndex = '1000';
            
            const modal = document.createElement('div');
            modal.id = 'winnerModal';
            modal.style.backgroundColor = 'white';
            modal.style.padding = '30px';
            modal.style.borderRadius = '10px';
            modal.style.textAlign = 'center';
            modal.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
            modal.style.maxWidth = '80%';
            
            const title = document.createElement('h2');
            title.id = 'winnerTitle';
            title.style.color = '#333';
            title.style.marginBottom = '20px';
            
            const playAgainBtn = document.createElement('button');
            playAgainBtn.textContent = 'Play Again';
            playAgainBtn.style.padding = '10px 20px';
            playAgainBtn.style.backgroundColor = '#4CAF50';
            playAgainBtn.style.color = 'white';
            playAgainBtn.style.border = 'none';
            playAgainBtn.style.borderRadius = '5px';
            playAgainBtn.style.cursor = 'pointer';
            playAgainBtn.style.fontSize = '16px';
            playAgainBtn.style.marginTop = '20px';
            
            playAgainBtn.addEventListener('click', () => {
                document.getElementById('winnerModalOverlay').style.display = 'none';
                this.resetGame();
            });
            
            modal.appendChild(title);
            modal.appendChild(playAgainBtn);
            modalOverlay.appendChild(modal);
            document.body.appendChild(modalOverlay);
        }
        
        // Update modal content and display it
        const winnerTitle = document.getElementById('winnerTitle');
        winnerTitle.textContent = `${winner.toUpperCase()} WINS!`;
        winnerTitle.style.color = winner; // Set the color to match the winner's color
        
        document.getElementById('winnerModalOverlay').style.display = 'flex';
        
        // Play victory sound
        this.playAudio("./audio/victory.mp3"); // Make sure you have this audio file
    }

    gameOver = async () => {
        this.isGameOver = true;
        
        // Clean up the podium display
        for (let playerName in this.playerPositions) {
            if (this.playerPositions[playerName] === 100) {
                let currentFinisher = this.players[playerName];
                currentFinisher.getPiece().classList.remove("podium");
                if (document.querySelector("#gamePodium").contains(currentFinisher.getPiece())) {
                    document.querySelector("#gamePodium").removeChild(currentFinisher.getPiece());
                }
                document.querySelector("#gameBoard").appendChild(currentFinisher.getPiece());
            }
        }
        
        // The reset will be handled by the Play Again button in the modal
        // Don't reset here: this.resetGame();
    }

    storeGameSnapshot = () => {
        let gameState = {
            position: this.playerPositions,
            turn: this.currentPlayerTurn,
            players: this.numberOfPlayers
        };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }

    updatePlayers = () => {
        const playersPlayButton = document.getElementsByClassName("play");

        let i = 0;
        // Display only selected player play button
        Array.from(playersPlayButton).forEach((playerPlayButton, index) => {
            if (index + 1 > this.numberOfPlayers) {
                playerPlayButton.style.display = "none";
            } else {
                playerPlayButton.style.display = "block";
            }

            if (this.numberOfPlayers === 1) {
                document.querySelector("#computer").style.display = "block";
            } else {
                document.querySelector("#computer").style.display = "none";
            }
        });
    }

    updateTurn = async () => {
        if (this.podium.includes(this.playerNames[this.currentPlayerTurn]) === false) {
            for (let playerName in this.players) {
                let player = this.players[playerName];
                player.getButton().disabled = true;
            }

            for (let playerName in this.players) {
                let player = this.players[playerName];
                player.getPiece().classList.remove("active");
            }

            if (this.numberOfPlayers === 1 && this.currentPlayerTurn === 1) {
                this.players["computer"].getButton().disabled = false;
                this.players["computer"].getPiece().classList.add("active");
                this.playGame(this.players["computer"]);
            } else {
                this.players[this.playerNames[this.currentPlayerTurn]].getButton().disabled = false;
                this.players[this.playerNames[this.currentPlayerTurn]].getPiece().classList.add("active");
            }
        }
    }

    playGame = async (player) => {
        player.getButton().disabled = true;
        player.getPiece().style.zIndex = "99";
        this.superPlayButton.disabled = true;
        let logPara = document.getElementById("log");
        let isCaptured = false;

        // Roll the dice
        this.playAudio("./audio/roll.mp3");
        let diceRoll = this.rollDice();
        document.getElementById("dice").style.backgroundPositionX = `${this.diceImagePositions[diceRoll - 1]}px`;

        await new Promise(resolve => setTimeout(resolve, 500));
        let finalPosition = this.playerPositions[player.getName()] + diceRoll;

        if (diceRoll === 6) {
            this.playAudio("./audio/bonus.mp3");
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        if (finalPosition <= 100) {
            if (player.getPosition() === 0) {
                if (diceRoll === 6) {
                    this.playerPositions[player.getName()] = 1;
                    player.setPosition(1);
                    player.updatePosition();
                    this.playAudio("./audio/move.mp3");
                    await new Promise(resolve => setTimeout(resolve, 150));
                }
            } else {
                for (let i = this.playerPositions[player.getName()]; i <= finalPosition; i++) {
                    this.playerPositions[player.getName()] = i;
                    player.setPosition(this.playerPositions[player.getName()]);
                    player.updatePosition();
                    this.playAudio("./audio/move.mp3");
                    await new Promise(resolve => setTimeout(resolve, 150));
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 250));

        if (this.playerPositions[player.getName()] < 100) {
            let initialPos = this.playerPositions[player.getName()];
            if (this.playerPositions[player.getName()] in this.board.getSnakeAndLadders()) {
                this.playerPositions[player.getName()] = this.board.getSnakeAndLadders()[this.playerPositions[player.getName()]];
                player.setPosition(this.playerPositions[player.getName()]);
                player.updatePosition();

                if (initialPos > this.playerPositions[player.getName()]) {
                    this.playAudio("./audio/fall.mp3");
                } else {
                    this.playAudio("./audio/rise.mp3");
                }
            }

            let msg = `[${new Date().toLocaleTimeString()}] Player rolled a ${diceRoll}. Current Position: ${this.playerPositions[player.getName()]} <br/>`;
            logPara.innerHTML += msg;

            // CHECK IF current player has attacked others in same position and make them restart again!
            for (let playerName in this.playerPositions) {
                if (playerName !== player.getName() && player.getPosition() !== 0) {
                    if (this.playerPositions[player.getName()] === this.playerPositions[playerName]) {
                        this.playerPositions[playerName] = 0;
                        isCaptured = true;
                        this.playAudio("./audio/fall.mp3");
                        await new Promise(resolve => setTimeout(resolve, 150));
                        this.players[playerName].setPosition(0);
                        this.players[playerName].updatePosition();
                    }
                }
            }
        } else {
            let msg = `[${new Date().toLocaleTimeString()}] Player reached the final square. Game over!`;
            logPara.innerHTML += msg;
            player.setPosition(100);
            player.updatePosition();

            this.setPodium(player.getName());
            
            // For two players, end the game immediately when someone wins
            if (this.numberOfPlayers === 2) {
                // Disable buttons to prevent further moves
                this.superPlayButton.disabled = true;
                for (let playerName in this.players) {
                    this.players[playerName].getButton().disabled = true;
                }
                
                return; // Exit the function early
            }
        }

        if ((diceRoll !== 6 && !isCaptured) || player.getPosition() >= 100) {
            let playerName = player.getName();
            do {
                // Check if game is over
                let calculatedPlayer = this.numberOfPlayers === 1 ? 2 : this.numberOfPlayers;
                if ((this.podium.length === calculatedPlayer) || this.isGameOver === true) {
                    this.gameOver();
                    return;
                }

                // If already in podium
                if (this.numberOfPlayers === 1) {
                    if (this.currentPlayerTurn < this.numberOfPlayers) {
                        this.currentPlayerTurn++;
                    } else {
                        this.currentPlayerTurn = 0;
                    }
                } else {
                    if (this.currentPlayerTurn < (this.numberOfPlayers - 1)) {
                        this.currentPlayerTurn++;
                    } else {
                        this.currentPlayerTurn = 0;
                    }
                }

                playerName = this.playerNames[this.numberOfPlayers === 1 && this.currentPlayerTurn === 1 ? 4 : this.currentPlayerTurn];
            } while (this.podium.includes(playerName));
        }

        if (this.playerPositions[player.getName()] == 0) {
            player.getPiece().style.bottom = "-70px";
        }

        player.getButton().disabled = false;
        player.getPiece().style.zIndex = "1";
        this.superPlayButton.disabled = false;

        this.storeGameSnapshot(this.playerPositions, this.currentPlayerTurn, this.numberOfPlayers);
        player.setPosition(this.playerPositions[player.getName()]);
        player.updatePosition();
        this.updateTurn();
    }

    showMenu = () => {
        document.querySelector("#menu").style.display = "block";
        document.querySelector("#playground").style.display = "none";
        document.querySelector("#superplay").disabled = true;
    }

    playGround = () => {
        document.querySelector("#menu").style.display = "none";
        document.querySelector("#playground").style.display = "block";
        document.querySelector("#superplay").disabled = false;

        this.storeGameSnapshot();

        this.updatePlayers();
        this.updateTurn();
    }

    playAudio = (src) => {
        var audio = new Audio(src);

        if (src == "./audio/bg.mp3") {
            audio.volume = 0.1;
        } else {
            audio.volume = 1;
        }
        audio.play();
    }

    fetchGameState = () => {
        /* Get current state of game from local storage */
        let localGameState = localStorage.getItem("gameState");

        /* if game is currently saved (localStorage), retrive such game */
        if (localGameState) {
            localGameState = JSON.parse(localGameState);

            this.playerPositions = localGameState.position;
            this.currentPlayerTurn = localGameState.turn;
            this.numberOfPlayers = localGameState.players;

            this.players["red"].setPosition(this.playerPositions["red"]);
            this.players["green"].setPosition(this.playerPositions["green"]);

            this.players["red"].updatePosition();
            this.players["green"].updatePosition();
            this.playGround();
        }
    }

    resetGame = () => {
        this.playerPositions = { red: 0, green: 0 };
    
        // CLEAR LOCAL STORAGE
        localStorage.removeItem("gameState");
    
        for (const playerName in this.players) {
            let player = this.players[playerName];
            player.setPosition(0);
            player.updatePosition();
        }
    
        this.currentPlayerTurn = 0;
        this.isGameOver = false;
        this.podium = [];
        this.updateTurn();
        this.updatePlayers();
        this.showMenu();
    }

    playerRoll = () => {
        if (this.isPlaying === false) {
            this.playAudio("./audio/bg.mp3");
            this.isPlaying = true;
        }
        if (this.currentPlayerTurn === 0) this.playGame(this.players["red"]);
        if (this.currentPlayerTurn === 1) this.playGame(this.players["green"]);
    }        

    initializeGame = () => {
        const boardElement = document.getElementById("gameBoard");

        const redPlayerPiece = document.getElementById("redPlayerPiece"); /* Red Piece */
        const greenPlayerPiece = document.getElementById("greenPlayerPiece"); /* Green Piece */

        const redPlayerBtn = document.getElementById("red"); /* Red Play Button */
        const greenPlayerBtn = document.getElementById("green"); /* Green Play Button */

        const playTwoPlayersBtn = document.querySelector("#playTwoPlayersBtn");
        const superPlayButton = document.getElementById("superplay");
        const resetBtn = document.querySelector("#resetBtn");
        resetBtn.removeEventListener("click", this.resetGame); // Just to be safe
        resetBtn.addEventListener("click", this.resetGame.bind(this));

        const redPlayer = new Player(0, "red", redPlayerPiece, redPlayerBtn, 0);
        const greenPlayer = new Player(1, "green", greenPlayerPiece, greenPlayerBtn, 0);

        let players = {
            red: redPlayer,
            green: greenPlayer,
        };

        let playerPositions = {
            red: 0,
            green: 0,
        };

        this.playerNames = ["red", "green"];
        this.numberOfPlayers = 2;

        const board = new Board(boardElement, GAME_BOARD_BG_02, SNAKES_AND_LADDERS_02);

        this.board = board;
        this.players = players;
        this.playerPositions = playerPositions;
        this.currentPlayerTurn = 0;
        
        this.superPlayButton = superPlayButton;
        this.isGameOver = false;

        superPlayButton.addEventListener("click", this.playerRoll);

        playTwoPlayersBtn.addEventListener("click", (event) => {
            this.numberOfPlayers = 2;
            this.playGround();
        });

        this.fetchGameState();
        this.updatePodium();
        this.updateTurn();

        /* Start game on enter key press */
        window.addEventListener("keypress", (e) => {
            if (e.code === "Enter" && superPlayButton.disabled === false && this.isGameOver === false) {
                this.playerRoll();
            }
        });

        const windowResize = () => {
            const boardWrapper = document.querySelector("#boardWrapper");
            
            if (boardWrapper) {
                console.log(boardWrapper);
                this.scale = boardWrapper.clientWidth / 500;
                console.log(this.scale);
                console.log(this.playerPositions);
                for (let player in this.players) {
                    this.players[player].setScale(this.scale);
                }
            }
        }

        window.addEventListener("resize", windowResize);
        this.updateTurn();
    }
}

const gameBoard = new GameBoard();
gameBoard.initializeGame();