import * as main from "../main";
import { Readable } from "stream";
import * as fs from "fs";
const expect = require("chai").expect;
import "mocha";

let expectedTable: main.TextTable = new main.TextTable();
expectedTable.nCols = 3;
expectedTable.nLins = 8;

let expectedColumn: main.TextColumn = new main.TextColumn(0, 37);
expectedColumn.label = "ID";
expectedColumn.startIndex = 0;
expectedColumn.endIndex = 37;
expectedColumn.colWidth = 37;
expectedColumn.lin = [,
                      ,
                      "aaaaaa11-bb22-c3c3-d44d-dsa8cjas0dja",
                      "sda89ca8-4aa3-4558-adbb-d3fc34631830",
                      "v12avs23-4d25-4b16-agqd-a9a2t8d11e3a",
                      "av12v12v-36f6-421a-ag25-34e41e53d2ta",
                      "a125125n-76e1-4wb4-bac5-c83b2387f120",
                      "bbbbbb22-09ge-41de-b212-b1t40ttet9e6"];

let expectedColumn2: main.TextColumn = new main.TextColumn(37, 34);
expectedColumn2.label = "Name";
expectedColumn2.startIndex = 37;
expectedColumn2.endIndex = 71;
expectedColumn2.colWidth = 34;
expectedColumn2.lin = [,
                       ,
                       "smallletters",
                       "Startcap",
                       "this test spaces",
                       "Some_NAME_HereInAlternatingCases",
                       "--startswith---endswith----",
                       "'allthethingsarebetweenquotessss'"];

let expectedColumn3: main.TextColumn = new main.TextColumn(37, 34);
expectedColumn3.label = "Roles";
expectedColumn3.startIndex = 71;
expectedColumn3.endIndex = NaN;
expectedColumn3.colWidth = undefined;
expectedColumn3.lin = [,
                       ,
                       "Administrator",
                       "Administrator",
                       "Administrator",
                       "Contributor",
                       "Contributor",
                       "Reader"];

expectedTable.col.push(expectedColumn);
expectedTable.col.push(expectedColumn2);
expectedTable.col.push(expectedColumn3);

let textTableDir: string = "src\\test\\TextTable.txt";
let textTable: string = fs.readFileSync(textTableDir).toString();

let textTablePrePostDir: string = "src\\test\\TextTable-Pre-Post.txt";
let textTablePrePost: string = fs.readFileSync(textTablePrePostDir).toString();

let textTablePrePostSpacesDir: string = "src\\test\\TextTable-Pre-Post-Spaces.txt";
let textTablePrePostSpaces: string = fs.readFileSync(textTablePrePostSpacesDir).toString();

describe("--- Async tests ---", () => {
    it("fs.ReadStream | \"TextTable.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testStream: fs.ReadStream = fs.createReadStream(textTableDir);

        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });

    it("fs.ReadStream | \"TextTable-Pre-Post.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testStream: fs.ReadStream = fs.createReadStream(textTablePrePostDir);

        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });
    it("fs.ReadStream | \"TextTable-Pre-Post-Spaces.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testStream: fs.ReadStream = fs.createReadStream(textTablePrePostSpacesDir);

        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });

    it("Readable stream | String similar to \"TextTable.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testStream = new Readable();
        testStream._read = () => { };
        testStream.push(textTable);
        testStream.push(null);
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });

    it("Readable stream | String similar to \"TextTable-Pre-Post.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testStream = new Readable();
        testStream._read = () => { };
        testStream.push(textTablePrePost);
        testStream.push(null);
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });
    it("Readable stream | String similar to \"TextTable-Pre-Post-Spaces.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testStream = new Readable();
        testStream._read = () => { };
        testStream.push(textTablePrePostSpaces);
        testStream.push(null);
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });
});

describe("--- Sync tests ---", () => {
    it("Sync | String similar to \"TextTable.txt\" should return textTable with right properties", () => {
        // Arrange
        // Act
        const result = main.parseTextTableToObjectSync(textTable);
        // Assert
        expect(result).to.eql(expectedTable);
    });
    it("Sync | String similar to \"TextTable-Pre-Post.txt\" should return textTable with right properties", () => {
        // Arrange
        // Act
        const result = main.parseTextTableToObjectSync(textTablePrePost);
        // Assert
        expect(result).to.eql(expectedTable);
    });
    it("Sync | String similar to \"TextTable-Pre-Post-Spaces.txt\" should return textTable with right properties", () => {
        // Arrange
        // Act
        const result = main.parseTextTableToObjectSync(textTablePrePostSpaces);
        // Assert
        expect(result).to.eql(expectedTable);
    });
});