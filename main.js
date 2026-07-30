function Node(value) {
  this.value = Array.from(value);
  this.children = [];
  this.level = 0;
  this.parent = null;
  this.solution = false;
}

let decisionThree = null;
let pcSolutions = [];

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let turn = 0; //0 user, 1 = pc
// Indica si la partida ya terminó.
// Si es true, ningún jugador podrá seguir realizando movimientos.
let gameOver = false;

function renderBoard() {
  const html = board.map((row) => {
    const cells = row.map((cell) => {
      return `<button class="cell">${cell}</button>`;
    });
    return `<div class="row">${cells.join("")}</div>`;
  });

  document.querySelector("#board").innerHTML = html.join("");
}

startGame();

function startGame() {

  // Reinicia el tablero vacío.
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  // Reinicia el árbol de decisiones de la computadora.
  decisionThree = null;

  // Vacía las soluciones encontradas por la IA.
  pcSolutions = [];

  // Indica que la partida vuelve a estar activa.
  gameOver = false;

  // Define aleatoriamente quién inicia.
  turn = Math.random() <= 0.5 ? 0 : 1;

  // Dibuja nuevamente el tablero.
  renderBoard();

  // Actualiza el turno en pantalla.
  renderPlayer();

  // Inicia el turno correspondiente.
  if (turn === 0) {
    playerPlays();
  } else {
    PCPlaysV2();
  }

}

function renderPlayer() {
  document.querySelector("#player").textContent = `${
    turn === 0 ? "Player turn" : "PC turn"
  }`;
}

function PCPlays() {
  console.log("PC Plays... ");
}

function PCPlaysV2() {
  debugger;
  console.log("PC Plays...V2 ");
  //create three
  const copy = JSON.parse(JSON.stringify(board));
  const root = new Node(copy);
  processNode(root, true, 0);

  console.log("final", root);

  if (pcSolutions.length > 0) {
    let min = 100;
    for (let i = 0; i < pcSolutions.length; i++) {
      if (pcSolutions[i].level < min) {
        min = pcSolutions[i].level;
      }
    }
    pcSolutions = pcSolutions.filter((sol) => sol.level === min);
    const moveIndex = parseInt(Math.random() * (pcSolutions.length - 0) + 0);
    console.log({ pcSolutions, moveIndex });
    const move = getRoot(pcSolutions[moveIndex]);
    console.log({ move });
    decisionThree = move;
    board = JSON.parse(JSON.stringify(move.value));
    console.log({ board });
    turn = 0;
    renderBoard();
    renderPlayer();

    // Verifica si la computadora ganó después de realizar su movimiento.
    const won = checkIfWinner();

    // Si existe un ganador, finaliza la partida.
    if (won !== "none") {
        gameOver = true;
        return;
    }

    // Si la partida continúa, limpia las soluciones y devuelve el turno al jugador.
    pcSolutions = [];
    playerPlays();
    
  } else {
    console.log("Empate...");
  }
}

function processNode(root, nturn, level) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (root.value[i][j] === "") {
        root.children.push(createChild(root, i, j, nturn, level));
      }
    }
  }
  //check if winner cpu
  for (let i = 0; i < root.children.length; i++) {
    if (checkIfPCWinner(root.children[i].value)) {
      pcSolutions.push(root.children[i]);
    }
  }

  //process next level
  for (let i = 0; i < root.children.length; i++) {
    const item = root.children[i];
    processNode(item, !nturn, level + 1);
  }
}

function createChild(node, i, j, nturn, level) {
  const copy = JSON.parse(JSON.stringify(node.value));

  if (!nturn) {
    copy[i][j] = "O";
  } else {
    copy[i][j] = "X";
  }
  const newNode = new Node(copy);
  newNode.turn = nturn;
  newNode.level = level + 1;
  newNode.parent = node;
  return newNode;
}

function playerPlays() {
  console.log("player plays");

  document.querySelectorAll(".cell").forEach((buttonCell, i) => {

    // Calculamos correctamente la fila y la columna
    const fila = Math.floor(i / 3);
    const columna = i % 3;

    if (board[fila][columna] === "") {

      buttonCell.addEventListener("click", () => {
        // Si la partida terminó, no permite realizar más movimientos.
        if (gameOver) return;

        board[fila][columna] = "O";
        buttonCell.textContent = board[fila][columna];

        turn = 1;

        const won = checkIfWinner();

        // Si alguien ganó, finaliza la partida.
        if (won !=="none"){
          gameOver = true;
          return;
        }

        //Si nadie ha ganado, juega la computadora.
        PCPlaysV2();

      });

    }

  });

}

function checkIfWinner() {
  const PCWon = [
    board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X",
    board[2][0] === "X" && board[1][1] === "X" && board[0][2] === "X",
    board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X",
    board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X",
    board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X",
    board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X",
    board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X",
    board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X",
  ];
  const playerWon = [
    board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O",
    board[2][0] === "O" && board[1][1] === "O" && board[0][2] === "O",
    board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O",
    board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O",
    board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O",
    board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O",
    board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O",
    board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O",
  ];

  if (PCWon.includes(true)) {
    console.log("PC WON");
    return "pcwon";
  }
  if (playerWon.includes(true)) {
    console.log("Player WON");
    return "playerwon";
  }
  return "none";
}
function checkIfPCWinner(arr) {
  const PCWon = [
    arr[0][0] === "X" && arr[1][1] === "X" && arr[2][2] === "X",
    arr[2][0] === "X" && arr[1][1] === "X" && arr[0][2] === "X",
    arr[0][0] === "X" && arr[1][0] === "X" && arr[2][0] === "X",
    arr[0][1] === "X" && arr[1][1] === "X" && arr[2][1] === "X",
    arr[0][2] === "X" && arr[1][2] === "X" && arr[2][2] === "X",
    arr[0][0] === "X" && arr[0][1] === "X" && arr[0][2] === "X",
    arr[1][0] === "X" && arr[1][1] === "X" && arr[1][2] === "X",
    arr[2][0] === "X" && arr[2][1] === "X" && arr[2][2] === "X",
  ];
  return PCWon.includes(true);
}

function checkIfPlayerCanWin(arr) {
  const PCWon = [
    arr[0][0] === "O" && arr[1][1] === "O",
    arr[2][0] === "O" && arr[1][1] === "O",
    arr[0][0] === "O" && arr[1][0] === "O",
    arr[0][1] === "O" && arr[1][1] === "O",
    arr[0][2] === "O" && arr[1][2] === "O",
    arr[0][0] === "O" && arr[0][1] === "O",
    arr[1][0] === "O" && arr[1][1] === "O",
    arr[2][0] === "O" && arr[2][1] === "O",
  ];
  return PCWon.includes(true);
}

function getRoot(node) {
  let n = node;
  while (n.parent.parent != null) {
    n = n.parent;
  }

  return n;
}
