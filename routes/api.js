"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    try {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (!puzzle || !coordinate || !value)
        return res.json({ error: "Required field(s) missing" });

      const col = coordinate.match(/\d+/g);
      if (!col) {
        return res.json({ error: "Invalid coordinate" });
      }
      const row = coordinate.charCodeAt(0) - 65;
      let column = Number.parseInt(col[0]) - 1;

      const parsedValue = Number.parseInt(value);

      if (row < 0 || row > 8 || column < 0 || column > 8) {

        return res.json({ error: "Invalid coordinate" });
      }

      if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 9)
        return res.json({ error: "Invalid value" });

      solver.validate(puzzle);

      if (puzzle.charAt(row * 9 + column) != ".") {
        return res.json({ valid: true });
      }

      const canPlaceInRow = solver.checkRowPlacement(
        puzzle,
        row,
        column,
        value
      );
      const canPlaceInColumn = solver.checkColPlacement(
        puzzle,
        row,
        column,
        value
      );
      const canPlaceInRegion = solver.checkRegionPlacement(
        puzzle,
        row,
        column,
        value
      );

      const response = {};

      response.valid = canPlaceInRow && canPlaceInColumn && canPlaceInRegion;
      if (!response.valid) {
        response.conflict = [];
      }
      if (!canPlaceInRow) {
        response.conflict.push("row");
      }
      if (!canPlaceInColumn) {
        response.conflict.push("column");
      }
      if (!canPlaceInRegion) {
        response.conflict.push("region");
      }

      res.json(response);
    } catch (e) {
      res.json({ error: e.message });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    try {
      solver.validate(puzzle);

      res.json({ solution: solver.solve(puzzle) });
    } catch (e) {
      res.json({ error: e.message });
    }
  });
};
