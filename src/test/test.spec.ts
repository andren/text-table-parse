import * as main from "../main";
import * as fs from "fs";
const expect = require("chai").expect;
import "mocha";

describe("Testing outputTenantsNoSpace.txt", () => {
    // Arrange
    let testFileDir: string = "src\\test\\outputTenantsNoSpace.txt";
    let testStream = fs.createReadStream(testFileDir);
    let testCorrect_Table: main.TextTable = new main.TextTable();
    testCorrect_Table.nCols = 3;
    testCorrect_Table.nLins = 9;
    
    let testCorrect_Column: main.TextColumn = new main.TextColumn(0,37);
    testCorrect_Column.label = "ID";
    testCorrect_Column.startIndex = 0;
    testCorrect_Column.endIndex = 37;
    testCorrect_Column.colWidth = 37;
    testCorrect_Column.lin = [ ,
                               ,
                               "aaaaaa11-bb22-c3c3-d44d-dsa8cjas0dja", 
                               "sda89ca8-4aa3-4558-adbb-d3fc34631830",
                               "v12avs23-4d25-4b16-agqd-a9a2t8d11e3a",
                               "av12v12v-36f6-421a-ag25-34e41e53d2ta",
                               "a125125n-76e1-4wb4-bac5-c83b2387f120",
                               "bbbbbb22-09ge-41de-b212-b1t40ttet9e6"];
    
    let testCorrect_Column2: main.TextColumn = new main.TextColumn(37,34);
    testCorrect_Column2.label = "Name";
    testCorrect_Column2.startIndex = 37;
    testCorrect_Column2.endIndex = 71;
    testCorrect_Column2.colWidth = 34;
    testCorrect_Column2.lin = [ ,
                                ,
                                "smallletters", 
                                "Startcap",
                                "this test spaces",
                                "Some_NAME_HereInalternatingCases",
                                "--startswith---endswith----",
                                "'allthethingsarebetweenquotessss'"];

    let testCorrect_Column3: main.TextColumn = new main.TextColumn(37,34);
    testCorrect_Column3.label = "Roles";
    testCorrect_Column3.startIndex = 71;
    testCorrect_Column3.endIndex = NaN;
    testCorrect_Column3.colWidth = undefined;
    testCorrect_Column3.lin = [ ,
                                ,
                                "Administrator", 
                                "Administrator",
                                "Administrator",
                                "Contributor",
                                "Contributor",
                                "Reader"];

    testCorrect_Table.col.push(testCorrect_Column);
    testCorrect_Table.col.push(testCorrect_Column2);
    testCorrect_Table.col.push(testCorrect_Column3);

    it("Should return textTable with right properties", async () => {
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);
        
        // Assert
        expect(result).to.eql(testCorrect_Table);
    });
});

describe("Testing outputTenants.txt", () => {
    // Arrange
    let testFileDir: string = "src\\test\\outputTenants.txt";
    let testStream = fs.createReadStream(testFileDir);
    let testCorrect_Table: main.TextTable = new main.TextTable();
    testCorrect_Table.nCols = 3;
    testCorrect_Table.nLins = 9;
    
    let testCorrect_Column: main.TextColumn = new main.TextColumn(0,37);
    testCorrect_Column.label = "ID";
    testCorrect_Column.startIndex = 0;
    testCorrect_Column.endIndex = 37;
    testCorrect_Column.colWidth = 37;
    testCorrect_Column.lin = [ ,
                               ,
                               "aaaaaa11-bb22-c3c3-d44d-dsa8cjas0dja", 
                               "sda89ca8-4aa3-4558-adbb-d3fc34631830",
                               "v12avs23-4d25-4b16-agqd-a9a2t8d11e3a",
                               "av12v12v-36f6-421a-ag25-34e41e53d2ta",
                               "a125125n-76e1-4wb4-bac5-c83b2387f120",
                               "bbbbbb22-09ge-41de-b212-b1t40ttet9e6"];
    
    let testCorrect_Column2: main.TextColumn = new main.TextColumn(37,34);
    testCorrect_Column2.label = "Name";
    testCorrect_Column2.startIndex = 37;
    testCorrect_Column2.endIndex = 71;
    testCorrect_Column2.colWidth = 34;
    testCorrect_Column2.lin = [ ,
                                ,
                                "smallletters", 
                                "Startcap",
                                "this test spaces",
                                "Some_NAME_HereInalternatingCases",
                                "--startswith---endswith----",
                                "'allthethingsarebetweenquotessss'"];

    let testCorrect_Column3: main.TextColumn = new main.TextColumn(37,34);
    testCorrect_Column3.label = "Roles";
    testCorrect_Column3.startIndex = 71;
    testCorrect_Column3.endIndex = NaN;
    testCorrect_Column3.colWidth = undefined;
    testCorrect_Column3.lin = [ ,
                                ,
                                "Administrator", 
                                "Administrator",
                                "Administrator",
                                "Contributor",
                                "Contributor",
                                "Reader"];

    testCorrect_Table.col.push(testCorrect_Column);
    testCorrect_Table.col.push(testCorrect_Column2);
    testCorrect_Table.col.push(testCorrect_Column3);

    it("Should return textTable with right properties", async () => {
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);
        
        // Assert
        expect(result).to.eql(testCorrect_Table);
    });
});