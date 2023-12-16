const { puzzlesAndSolutions } = require("./puzzle-strings");

class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      throw new Error("Required field missing");
    }

    if (!/^[\.1-9]*$/.test(puzzleString)) {
      throw new Error("Invalid characters in puzzle");
    }

    if (puzzleString.length !== 81) {
      throw new Error("Expected puzzle to be 81 characters long");
    }

    if (puzzleString.match(/[1-9]/g).length < 17) {
      throw new Error("Puzzle cannot be solved");
    }

    



    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowString = puzzleString.slice(row * 9, row * 9 + 9);
    return !rowString.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const col = [];
    for (let i = 0; i < 9; i++) {
      col.push(puzzleString.charAt(9 * i + column));
    }
    return !col.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const region = [];
    const rowFloor = Math.floor(row / 3);
    const colFloor = Math.floor(column / 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        region.push(
          puzzleString.charAt((rowFloor * 3 + i) * 9 + (colFloor * 3 + j))
        );
      }
    }

    return !region.includes(value);
  }

  solve(puzzleString) {
    const initialState = puzzleString;
    let currentState = puzzleString;
    try {
      this.validate(puzzleString);
    } catch(e) {
      throw new Error("Puzzle cannot be solved");
    }
    

    function setCharAt(str, index, chr) {
      if (index > str.length - 1) return str;
      return str.substring(0, index) + chr + str.substring(index + 1);
    }

    let times = 0;
    while (!/^[0-9]*$/.test(currentState) && times < 10) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const index = i * 9 + j;
          if (initialState.charAt(index) == ".") {
            let possiblePlacementCount = 0;
            let possibleValue;

            for (let value = 1; value <= 9; value++) {
              let canSet =
                this.checkColPlacement(currentState, i, j, value.toString()) &
                  this.checkRowPlacement(
                    currentState,
                    i,
                    j,
                    value.toString()
                  ) &&
                this.checkRegionPlacement(currentState, i, j, value.toString());
              if (canSet) {
                possiblePlacementCount++;
                possibleValue = value.toString();
              }
            }
            if (possiblePlacementCount === 1) {
              currentState = setCharAt(currentState, index, possibleValue);
            }
            
          }
        }
      }
      times++;
    }

    
    // check if Each row contains unique values from 1-9.
    // check Each column contains unique values from 1-9.
    // check  Each of the 9 sub-squares, of size 3x3, ​contains a unique value from 1-9.

    if (times == 10) {
      throw new Error("Puzzle cannot be solved")
    }

    for (let value = 1; value <= 9; value++) {
      
      for (let i = 0; i < 9; i++) {
        let count = 0;
        for (let j = 0; j < 9; j++) {
          if (currentState.charAt(i * 9 + j) == value.toString()) {
            count++;
            if (count > 1) {
              throw new Error("Puzzle cannot be solved");
            }
          }
        }
      }
    }

    return currentState;
  }

}

module.exports = SudokuSolver;
