//-----------VIEW-----------
const numRows = 30;
const numCols = 20;


function createGrid() {
    const container = document.getElementById('grid')
    container.innerHTML = '';

    for(let i = 0; i < numRows; i++) {
        for(let j = 0; j < numCols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell'; // Opsætter den som død til at starte med
            cell.setAttribute('data-row', i); // Indsætter row og col data - i er row 
            cell.setAttribute('data-col', j); //og j er col
            container.appendChild(cell); //Sammensætter det celle div elementer vi har lavet til den oprindelige game-container
        }
        container.appendChild(document.createElement('br'));
    }
}

function updateView() {
    const container = document.getElementById('grid');

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = container.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            const cellState = readFromCellModel(i, j); // Read the state of the cell from the model
            
            if(cellState === 0) {
                cell.classList.remove("player", "goal");
            } else if(cellState === 1) {
                cell.classList.add("player");
            } else if(cellState === 2) {
                cell.classList.add("goal");
            }
        }
    }
}

let direction = "left";

const controls = {
  left: false,
  right: false,
  up: false,
  down: false
}

function keyDown(event) {
  switch(event.key) {
    case "ArrowLeft": controls.left = true; break;
    case "ArrowRight": controls.right = true; break;
    case "ArrowUp": controls.up = true; break;
    case "ArrowDown": controls.down = true; break;
  }
}

function keyUp(event) {
  switch(event.key) {
    case "ArrowLeft": controls.left = false; break;
    case "ArrowRight": controls.right = false; break;
    case "ArrowUp": controls.up = false; break;
    case "ArrowDown": controls.down = false; break;
  }
}

//-----------MODEL----------

const queue = [
    {
    row: 5,
    col: 5
    },
    {
      row: 5,
      col: 6
    },
    {
      row: 5,
      col: 7
    }
  ]

  let fruit = {
    row: 10,
    col: 10
  };

const model = [];

function createModel() {
    for(i = 0; i < numRows; i++) {
        model[i] = []; //lav det første array som holder rows
        for(j = 0; j < numCols; j++) {
            model[i][j] = 0; //Hver celle får nu en værdi som 0, stående for dead - 1 = alive
        }
    }
}

function readFromCellModel(row, col) {
    return model[row][col]
}

function writeToCellModel(row, col, value) {
    model[row][col] = value;
}

function spawnFruit() {
    // Generate random coordinates for the fruit within the board boundaries
    let fruitRow, fruitCol;
    do {
        fruitRow = Math.floor(Math.random() * numRows - 1);
        fruitCol = Math.floor(Math.random() * numCols - 1);
    } while (readFromCellModel(fruitRow, fruitCol) !== 0);

    return { row: fruitRow, col: fruitCol };
}

function checkCollisionWithSnake() {
    const head = queue[queue.length - 1];
    for (let i = 0; i < queue.length - 1; i++) {
        if (head.row === queue[i].row && head.col === queue[i].col) {
            return true; // Collision detected
        }
    }
    return false; // No collision detected
}

function deQueue() {
    if (queue.length === 0) {
        return undefined; // Return undefined if queue is empty
    }

    const dequeuedElement = queue[0]; // Get the first element
    for (let i = 0; i < queue.length - 1; i++) {
        queue[i] = queue[i + 1]; // Shift elements to the left
    }
    queue.length--; // Decrease the length of the queue
    return dequeuedElement;
}

function enQueue(element) {
    const queueLength = queue.length;
    queue[queueLength] = element; // Add element to the end of the queue
}



//-----------CONTROLLER----------

function start() {
    createGrid();
    createModel();
    fruit = spawnFruit();
    writeToCellModel(fruit.row, fruit.col, 2)

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    tick();
}

function tick() {

    setTimeout(tick, 500)

    for(const part of queue) {
        writeToCellModel(part.row, part.col, 0)
      }

    if(controls.up) {
    direction = "up"
    } else if(controls.down) {
    direction = "down"
    } else if(controls.left) {
    direction = "left"
    } else if(controls.right) {
    direction = "right"
    } 

    const head = {
        row: queue[queue.length - 1].row,
        col: queue[queue.length - 1].col,
      }

    switch(direction) {
        case "left": {
          head.col--;
          if(head.col < 0) {
            head.col = numCols - 1;
          }
          break;
        }
        case "right": {
          head.col++
          if(head.col>numCols - 1) {
            head.col = 0;
          }
          break;
        }
        case "up": {
          head.row--;
            if(head.row < 0) {
            head.row = numRows - 1 ;
          }
          break;
        }
        case "down": {
          head.row++;
          if(head.row > numRows - 1) {
            head.row = 0;
          }
          break;
      }
      } 

      enQueue(head);
      deQueue();

      for(const part of queue) {
        writeToCellModel(part.row, part.col, 1)
      }

      if(queue.some(segment => segment.row === fruit.row && segment.col === fruit.col)) {
        writeToCellModel(fruit.row, fruit.col, 0)
        fruit = spawnFruit();
        writeToCellModel(fruit.row, fruit.col, 2)
        enQueue(head)
      }

      updateView();

}

window.addEventListener("DOMContentLoaded", start)