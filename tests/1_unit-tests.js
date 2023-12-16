const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {

    suite('puzzle validation', () => {

        test('handles a valid puzzle string of 81 characters', (done) => {
            assert.isTrue(solver.validate(puzzlesAndSolutions[0][0]), "should return true");
            done()
        })

        test('handles a puzzle string with invalid characters', (done) => {
            const invalidPuzzle = "1.5..2.84..63.12.7.2..5.....9..1../.8.2.3674.3.7.2..9.47...8..1..16....926914.37."

            assert.throws(() => solver.validate(invalidPuzzle), "Invalid characters in puzzle");
            assert.isTrue(true);
            done()
        });

        test('handles a puzzle string with invalid length', (done) => {
            const invalidPuzzle = "1.5..2.84..63.12.7.2..5.....9..1...8.2.3674.3.7.2..9.47...8..1..16....926914.37."

            assert.throws(() => solver.validate(invalidPuzzle), "Expected puzzle to be 81 characters long");
            assert.isTrue(true);
            done()

        });
    });
    suite('Row Validation', () => {

        //Logic handles a valid row placement

        test('handles a valid row placement', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const row = 8;
            const column = 5;
            const value = "5";

            assert.isTrue(solver.checkRowPlacement(puzzle, row, column, value), "should return true");
            done()
        });

        //Logic handles an invalid row placement
        test('handles an invalid row placement', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const row = 8;
            const column = 5;
            const value = "1";

            assert.isFalse(solver.checkRowPlacement(puzzle, row, column, value), "should return false");
            done()
        });
    });
    suite('Column Validation', () => {

        //Logic handles a valid column placement
        test('handles a valid column placement', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const row = 8;
            const column = 5;
            const value = "5";

            assert.isTrue(solver.checkColPlacement(puzzle, row, column, value), "should return true");
            done()
        });

        //Logic handles an invalid column placement
        test('handles an invalid column placement', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const row = 8;
            const column = 5;
            const value = "1";

            assert.isFalse(solver.checkColPlacement(puzzle, row, column, "1"), "should return false");
            done()
        });

    });

    suite('Region Validation', () => {
        
        //Logic handles a valid region (3x3 grid) placement

        test('handles a valid region (3x3 grid) placement', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const row = 8;
            const column = 5;
            const value = "5";

            assert.isTrue(solver.checkRegionPlacement(puzzle, row, column, value), "should return true");
            done()
        });

        //Logic handles an invalid region (3x3 grid) placement

        test('handles an invalid region (3x3 grid) placement', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const row = 8;
            const column = 5;
            const value = "1";

            assert.isFalse(solver.checkRegionPlacement(puzzle, row, column, value), "should return false");
            done()
        });

    });

    suite('Solver', () => {

        //Solver returns the expected solution for an incomplete puzzle

        test('returns the expected solution for an incomplete puzzle', (done) => {
            const puzzle = puzzlesAndSolutions[0][0];
            const solution = puzzlesAndSolutions[0][1];

            assert.equal(solver.solve(puzzle), solution, "should return the solution");
            done()
        });

        //Invalid puzzle strings fail the solver

        test('invalid puzzle strings fail the solver', (done) => {
            const puzzle = puzzlesAndSolutions[0][0] + "1";
            assert.throws(() => solver.solve(puzzle), "Puzzle cannot be solved");
            assert.isTrue(true);
            done()
        });

        //Solver returns the expected solution for a completed puzzle
        test('returns the expected solution for a completed puzzle', (done) => {
            const puzzle = puzzlesAndSolutions[0][1];
            const solution = puzzlesAndSolutions[0][1];

            assert.equal(solver.solve(puzzle), solution, "should return the solution");
            done()
        });

    });


    


});
