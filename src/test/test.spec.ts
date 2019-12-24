import * as main from "../main";
import { Readable } from "stream";
import * as fs from "fs";
const expect = require("chai").expect;
import "mocha";

let expectedTable: main.TextTable = new main.TextTable();
expectedTable.nCols = 3;
expectedTable.nLins = 9;

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
    "Some_NAME_HereInalternatingCases",
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

describe("Testing fs.ReadStream from \"fs\" API", () => {
    it("\"outputTenantsNoSpace.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testFileDir: string = "src\\test\\outputTenantsNoSpace.txt";
        let testStream: fs.ReadStream = fs.createReadStream(testFileDir);

        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });

    it("\"outputTenants.txt\" should return textTable with right properties", async () => {
        // Arrange
        let testFileDir: string = "src\\test\\outputTenants.txt";
        let testStream = fs.createReadStream(testFileDir);

        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });
});

describe("Testing Readable streams from \"stream\" API", () => {
    it("String similar to \"outputTenantsNoSpace.txt\" should return textTable with right properties", async () => {
        // Arrange
        let expectedString =
`ID                                   Name                              Roles
--                                   ----                              -----
aaaaaa11-bb22-c3c3-d44d-dsa8cjas0dja smallletters                      Administrator
sda89ca8-4aa3-4558-adbb-d3fc34631830 Startcap                          Administrator
v12avs23-4d25-4b16-agqd-a9a2t8d11e3a this test spaces                  Administrator
av12v12v-36f6-421a-ag25-34e41e53d2ta Some_NAME_HereInalternatingCases  Contributor
a125125n-76e1-4wb4-bac5-c83b2387f120 --startswith---endswith----       Contributor
bbbbbb22-09ge-41de-b212-b1t40ttet9e6 'allthethingsarebetweenquotessss' Reader
`

        let testStream = new Readable();
        testStream._read = () => { };
        testStream.push(expectedString);
        testStream.push(null);
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });
    it("String similar to \"outputTenants.txt\" should return textTable with right properties", async () => {
        // Arrange
        let expectedString =
`ID                                   Name                              Roles
--                                   ----                              -----
aaaaaa11-bb22-c3c3-d44d-dsa8cjas0dja smallletters                      Administrator
sda89ca8-4aa3-4558-adbb-d3fc34631830 Startcap                          Administrator
v12avs23-4d25-4b16-agqd-a9a2t8d11e3a this test spaces                  Administrator
av12v12v-36f6-421a-ag25-34e41e53d2ta Some_NAME_HereInalternatingCases  Contributor
a125125n-76e1-4wb4-bac5-c83b2387f120 --startswith---endswith----       Contributor
bbbbbb22-09ge-41de-b212-b1t40ttet9e6 'allthethingsarebetweenquotessss' Reader
       
Command completed successfully in 00:00:02.4911691.
`

        let testStream = new Readable();
        testStream._read = () => { };
        testStream.push(expectedString);
        testStream.push(null);
        
        // Act
        const result = await main.parseTextTableToObjectAsync(testStream);

        // Assert
        expect(result).to.eql(expectedTable);
    });
});