const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(board, coordinates) {
        this._board = board;
        this._height = board.length;
        this._width = board[0].length;
        this._x_pos = coordinates[1];
        this._y_pos = coordinates[0];
    }

    static generateField(height, width, percentage) {
        const tiles = [hat, pathCharacter]
        const area = height * width;
        let placedHoles = 0;
        const totalHoles = Math.floor(area * (percentage/100));
        let max = 2;
        for(let i=2; i<area; i++){
            const num = Math.floor(Math.random() * max);
            if(num === 0) {
                tiles.push(fieldCharacter)
            } else if(placedHoles < totalHoles){
                placedHoles++
                tiles.push(hole)
                if(placedHoles === totalHoles){
                    max = 1;
                }
            }
        }
        
        const field = [];
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
            console.log(`Input is out of bounds. You lose!`);
            return false;
        } else if(this._board[this._y_pos][this._x_pos] === hole) {
            console.log(`You fell into a hole... You lose!`);
            return false;
        } else if(this._board[this._y_pos][this._x_pos] === hat) {
            console.log(`You found your hat. You win!`);
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



// const myField = new Field([
//     ['*', '░', 'O'],
//     ['░', 'O', '░'],
//     ['░', '^', '░'],
//   ]);


const b = Field.generateField(10, 10, 25);
let coordinates = Field.startPos(b);
const myField = new Field(b, coordinates);

let playing = true;
while(playing) {
    myField.print();
    const direction = prompt('Which Way? ');
    if(myField.checkInput(direction)){
        playing = myField.move(direction);
    }
}