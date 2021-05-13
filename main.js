const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(board) {
        this._board = board;
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

    // move(direction) {
    //     if(direction === 'u' || direction ==='U'){
    //         this.
    //     }
    // }

}

const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);


myField.print();
let playing = true;
while(playing) {
    const direction = prompt('Which Way? ');
    myField.checkInput(direction)
}