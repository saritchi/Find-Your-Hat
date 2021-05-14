const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(board) {
        this._board = board;
        this._height = board.length;
        this._width = board[0].length;
        this._x_pos = 0;
        this._y_pos = 0;
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
        } else if(this._board[this._x_pos][this._y_pos] === hole) {
            console.log(`You fell into a hole... You lose!`);
            return false;
        } else if(this._board[this._x_pos][this._y_pos] === hat) {
            console.log(`You found your hat. You win!`);
            return false;
        } else if(this._board[this._x_pos][this._y_pos] === fieldCharacter){
            this.update();
            return true;
        }
    }

    update() {
        this._board[this._x_pos][this._y_pos] = pathCharacter;
    }
}

const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);


console.log(myField._height)
console.log(myField._width)
let playing = true;
while(playing) {
    myField.print();
    const direction = prompt('Which Way? ');
    if(myField.checkInput(direction)){
        playing = myField.move(direction);
    }
}