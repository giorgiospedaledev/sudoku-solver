const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', () => {
        chai.request(server)
            .post('/api/solve')
            .send({puzzle: puzzlesAndSolutions[0][0]})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
            });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', () => {
        chai.request(server)
            .post('/api/solve')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field missing");
            });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', () => {
        chai.request(server)
            .post('/api/solve')
            .send({puzzle: puzzlesAndSolutions[0][0].replace("5", "a")})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle");
            });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', () => {
        chai.request(server)
            .post('/api/solve')
            .send({puzzle: puzzlesAndSolutions[0][0].slice(0, 80)})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', () => {
        chai.request(server)
            .post('/api/solve')
            .send({puzzle: puzzlesAndSolutions[0][0].replace("5", "1")})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Puzzle cannot be solved");
            });
    });

    test('Check a puzzle placement with all fields: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "A1", value: "7"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isTrue(res.body.valid);
            });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "8"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.equal(res.body.conflict.length, 1);
            });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "6"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.equal(res.body.conflict.length, 2);
            });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "2"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.equal(res.body.conflict.length, 3);
            });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], value: "1"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field(s) missing");
            });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0].replace("5", "a"), coordinate: "A1", value: "1"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle");
            });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0].slice(0, 80), coordinate: "A1", value: "1"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "A0", value: "1"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid coordinate");
            });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', () => {
        chai.request(server)
            .post('/api/check')
            .send({puzzle: puzzlesAndSolutions[0][0], coordinate: "A1", value: "0"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value");
            });
    });


});

