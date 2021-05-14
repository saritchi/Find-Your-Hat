var term = require( 'terminal-kit' ).terminal ;
const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Maze solver using Breadth-First Search to ensure maze is solvable before user plays.
const maze_solver_bfs = (field, xy) => {
    let bfs_field = [];
    field.forEach(row => {
        let set = [];
        row.forEach(tile => {
            set.push(tile);
        })
        bfs_field.push(set)
    })

    let x_pos = xy[1];
    let y_pos = xy[0];
    const queue = [];
    queue.push([bfs_field[y_pos][x_pos], y_pos, x_pos])
    do {
        let v = queue.shift()
        y_pos = v[1];
        x_pos = v[2];
        if(v[0] === hat){
            return false;
        }
        bfs_field[y_pos][x_pos] = pathCharacter;
        // Check North
        if(y_pos-1>=0 && bfs_field[y_pos-1][x_pos] !== hole && bfs_field[y_pos-1][x_pos] !== pathCharacter){
            queue.push([bfs_field[y_pos-1][x_pos], y_pos-1, x_pos])
        }
        // Check East
        if(x_pos+1<bfs_field[0].length && bfs_field[y_pos][x_pos+1] !== hole && bfs_field[y_pos][x_pos+1] !== pathCharacter){
            queue.push([bfs_field[y_pos][x_pos+1], y_pos, x_pos+1])
        }
        // Check South
        if(y_pos+1<bfs_field.length && bfs_field[y_pos+1][x_pos] !== hole && bfs_field[y_pos+1][x_pos] !== pathCharacter){
            queue.push([bfs_field[y_pos+1][x_pos], y_pos+1, x_pos])
        }
        // Check West
        if(x_pos-1>=0 && bfs_field[y_pos][x_pos-1] !== hole && bfs_field[y_pos][x_pos-1] !== pathCharacter){
            queue.push([bfs_field[y_pos][x_pos-1], y_pos, x_pos-1])
        }

    } while(queue.length !== 0)
    return true;
}

class Field {
    constructor(board, coordinates) {
        this._board = board;
        this._height = board.length;
        this._width = board[0].length;
        this._x_pos = coordinates[1];
        this._y_pos = coordinates[0];
    }

    static generateField(height, width, percentage) {
        const area = height * width;
        const totalHoles = Math.floor(area * (percentage/100));
        let field;
        do {
            field = [];
            const tiles = [hat, pathCharacter]
            let placedHoles = 0;
            for(let i=2; i<area; i++){
                if(placedHoles < totalHoles) {
                    tiles.push(hole)
                    placedHoles++
                    
                } else{
                    tiles.push(fieldCharacter)
                }
            }
            
            for(let i=0; i < height; i++){
                const row = [];
                for(let j=0; j < width; j++){
                    const index = Math.floor(Math.random() * tiles.length);
                    const tile = tiles[index]
                    row.push(tile);
                    tiles.splice(index, 1)
                }
                field.push(row)
            }
        } while(maze_solver_bfs(field, this.startPos(field)))

        return field;
    }

    static startPos(field) {
        for(let i=0; i<field.length; i++){
            for(let j=0; j< field[0].length; j++){
                if(field[i][j] === pathCharacter){
                    return [i, j];
                }
            }
        }
    }

    print() {
        this._board.forEach(row => {
            let string = ''
            row.forEach(tile => {
                string += tile;
            });
            console.log(string)
        });
    }

    checkInput(input) {
        const validInput = ['u', 'd', 'r', 'l', 'U', 'D', 'R', 'L'];
        if(validInput.includes(input)){
            return true;
        } else {
            return false;
        }
    }

    move(direction) {
        if(direction === 'u' || direction ==='U'){
            this._y_pos -= 1;
        } else if(direction === 'd' || direction ==='D'){
            this._y_pos += 1;
        } else if(direction === 'r' || direction ==='R'){
            this._x_pos += 1;
        } else if(direction === 'l' || direction ==='L'){
            this._x_pos -= 1;
        }

        return this.check_xy();
    }

    check_xy() {
        // Returning False implies the game is over (win/lose).
        if(this._x_pos < 0 || this._y_pos < 0 || this._x_pos >= this._width || this._y_pos >= this._height) {
            term.red(`Input is out of bounds. You lose!\n`);
            return false;
        } else if(this._board[this._y_pos][this._x_pos] === hole) {
            term.red(`You fell into a hole... You lose!\n`);
            return false;
        } else if(this._board[this._y_pos][this._x_pos] === hat) {
            term.green(`You found your hat. You win!\n`);
            return false;
        } else if(this._board[this._y_pos][this._x_pos] === fieldCharacter){
            this.update();
            return true;
        }
    }

    update() {
        this._board[this._y_pos][this._x_pos] = pathCharacter;
    }
}


console.log('Welcome to Find Your Hat!')
let rows;
while(true) {
    rows = prompt('How many rows? [3 - 20]: ')
    if(rows <= 20 || rows > 2){
        break;
    } else{
        term.red('Incorrect option.\n')
    }
}

let columns;
while(true) {
    columns = prompt('How many columns? [3 - 20]: ')
    if(columns <= 20 || columns > 2){
        break;
    } else{
        term.red('Incorrect option.\n')
    }
}

let percentage;
while(true){
    const difficulty = prompt('Difficulty? (Easy [e], medium [m], hard [h]): ')
    if(difficulty === 'e'){
        percentage = 12;
        break;
    } else if(difficulty === 'm') {
        percentage = 25;
        break;
    } else if(difficulty === 'h') {
        percentage = 50;
        break;
    } else {
        term.red('Incorrect option.\n')
    }
}

const b = Field.generateField(rows, columns, percentage);
let coordinates = Field.startPos(b);
const myField = new Field(b, coordinates);

let playing = true;
while(playing) {
    myField.print();
    const direction = prompt('Which Way? (Up [u], Right [r], Down [d], Left [l]): ');
    if(myField.checkInput(direction)){
        playing = myField.move(direction);
    }
}