'use strict';

/* function toJSON(proto) {
    let jsoned = {};
    let toConvert = proto || this;
    Object.getOwnPropertyNames(toConvert).forEach((prop) => {
        const val = toConvert[prop];
        // don't include those
        if (prop === 'toJSON' || prop === 'constructor') {
            return;
        }
        if (typeof val === 'function') {
            jsoned[prop] = val.bind(jsoned);
            return;
        }
        jsoned[prop] = val;
    });

    const inherited = Object.getPrototypeOf(toConvert);
    if (inherited !== null) {
        Object.keys(this.toJSON(inherited)).forEach(key => {
            if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
                return;
            if (typeof inherited[key] === 'function') {
                jsoned[key] = inherited[key].bind(jsoned);
                return;
            }
            jsoned[key] = inherited[key];
        });
    }
    return jsoned;
} */

class MyBoard {
  constructor(scene) {
    this.scene = scene;
    this.cellWidth = 1;
    this.boardLength = 8;
    this.blackCell = scene.graph.nodes['blackCell'];
    this.whiteCell = scene.graph.nodes['whiteCell'];
    this.board = this._buildBoard();
    this.boardPieces = this._initBoardPieces();
  }

  update() {
    // get pieces in each position
    // make move
  }

  display() {
    for (let line = 0; line < this.boardLength; line++) {
      for (let col = 0; col < this.boardLength; col++) {
        this.scene.pushMatrix();
          this.scene.translate(this.cellWidth * col, 0, this.cellWidth * line);
          this.scene.registerForPick(this._getPickId(line, col), this.board[line][col]);
          if (this.scene.pickedId == this._getPickId(line, col)) {
            this.scene.setActiveShader(this.scene.pickedShader);
          }
          this.scene.graph.displayNode(this.board[line][col]);
          if (this.scene.pickedId == this._getPickId(line, col)) {
            this.scene.setActiveShader(this.scene.defaultShader);
          }
          if (this.boardPieces[line][col].node != null) {
            this.scene.graph.displayNode(this.boardPieces[line][col].node);
          }
        this.scene.popMatrix();
      }
    }
  }

  updatePieces(prologPieces) {
    prologPieces = prologPieces.slice(2);
    prologPieces = prologPieces.slice(0, -2);
    let piecesLines = prologPieces.split("],[");
    
    for (let line = 0; line < this.boardLength; line++) {
      let pieces = piecesLines[line].split(",");
      for (let col = 0; col < this.boardLength; col++) {
        this.boardPieces[line][col].setPiece(pieces[col]);
      }
    }
  }

  _buildBoard() {
    let outerBlackTurn = true;
    let board = [];
    for (let line = 0; line < this.boardLength; line++) {
      let blackTurn = outerBlackTurn;
      let boardLine = [];
      for (let col = 0; col < this.boardLength; col++) {
        let cell = (blackTurn ? this.blackCell : this.whiteCell);
        blackTurn = !blackTurn;
        boardLine.push(cell);
      }
      board.push(boardLine);
      outerBlackTurn = !outerBlackTurn;
    }
    return board;
  }

  _initBoardPieces() {
    let boardPieces = [];
    for (let line = 0; line < this.boardLength; line++) {
      let piecesLine = [];
      for (let col = 0; col < this.boardLength; col++) {
        piecesLine[col] = new MyPiece(this.scene);
      }
      boardPieces.push(piecesLine);
    }
    return boardPieces;
  }

  _getPickId(line, col) {
    return line * this.boardLength + col + 1;
  }
}
