import * as fs from "fs";
import * as readline from "readline";
import { Readable } from "stream";

export class TextTable {
    nCols: number;
    nLins: number;
    col: TextColumn[];

    constructor() {
        this.col = [];
    }
}

export class TextColumn {
    startIndex: number;
    endIndex: number;
    colWidth: number;
    label: string;
    lin: string[];

    constructor(startIndex: number, colWidth: number) {
        this.startIndex = startIndex;
        this.colWidth = colWidth;
        this.endIndex = this.startIndex + this.colWidth;
        this.lin = [];
    }
}

/**
 * Takes a PowerShell-style table from a stream and objectifies it to a TextTable asynchronously
 * 
 * @param stream A stream based on fs.ReadStream or stream.Readable
 */
export async function parseTextTableToObjectAsync(stream: fs.ReadStream | Readable): Promise<TextTable> {
    const rl = readline.createInterface({
        input: stream,
        output: process.stdout,
        terminal: false     // TODO
    });

    return new Promise((resolve, reject) => {
        stream.once('error', _ => reject(null));    // TODO

        var lineNum = 0;
        var labelLine: string;
        let textTable = new TextTable();

        rl.on("line", (line) => {

            // ----- Table line 0 - Labels of each column -----
            if (lineNum == 0) {
                labelLine = line;
            }
            // ----- Table line 1 - Delimiters - Number of columns, indexes and widths are determined here -----
            else if (lineNum == 1) {
                let colIndexes: number[] = [];
                let delimFlag: boolean = false;

                // Determine number of columns
                for (let x = 0; x < line.length; x++) {
                    if (line[x] == '-' && delimFlag == false) {
                        colIndexes.push(x);
                        delimFlag = true;
                    }
                    else if (line[x] == ' ') {
                        delimFlag = false;
                    }
                }

                // adding number of columns to textTable Object
                textTable.nCols = colIndexes.length;

                // adding all columns with indexes and widths to textTable Object
                for (let y = 0; y < textTable.nCols; y++) {
                    let colWidth;

                    // column width can be determined based on column Indexes...
                    if (y != textTable.nCols - 1)
                        colWidth = Math.abs(colIndexes[y + 1] - colIndexes[y]);
                    else    // ...except for the last element to be left undefined, as later it is computed to NaN, easier to detect
                        colWidth = undefined;                   // colWidth = null; // TODO: maybe null?

                    let col = new TextColumn(colIndexes[y], colWidth);
                    textTable.col.push(col)
                }

                // Now that we know number of Columns and their widths/indexes - Go back to label line and extract labels
                for (let nCol = 0; nCol < textTable.nCols; nCol++) {
                    let start = textTable.col[nCol].startIndex;
                    let end = textTable.col[nCol].endIndex;

                    let label;
                    if (isNaN(end))
                        end = labelLine.length;

                    label = labelLine.slice(start, end).trimRight();
                    textTable.col[nCol].label = label;
                }

                // ----- Table lines 2,3,... - Data -----
            } else {
                // if a complete whitespace line is found then emit rl.close() event and...
                if (line.match(/^\s*$/)) {
                    rl.close();
                    rl.removeAllListeners();    // ... immediately removeAllListeners() to avoid further non-whitespace lines
                    return;
                }
                else {
                    for (let nCol = 0; nCol < textTable.nCols; nCol++) {
                        let start = textTable.col[nCol].startIndex;
                        let end = textTable.col[nCol].endIndex;

                        let oneColumnLine;
                        if (isNaN(end))
                            end = line.length;

                        oneColumnLine = line.slice(start, end).trimRight();
                        textTable.col[nCol].lin[lineNum] = oneColumnLine;
                    }
                }
            }
            lineNum++;
        });

        rl.on('close', () => {
            textTable.nLins = lineNum;
            resolve(textTable);
        });
    });
}

/**
 * Takes a PowerShell-style table from a string and objectifies it to a TextTable synchronously
 * 
 * @param input A string containing a PowerShell-style text table
 */
export function parseTextTableToObjectSync(input: string): TextTable {
    let textTable = new TextTable();

    // Splits whole input into lines divided by "\n" character
    let inputLines: string[] = input.split("\n");

    // Assuming label and delimiter lines are always first and second, respectively
    let labelLine: string = inputLines[0];
    let delimLine: string = inputLines[1];

    // Determine number of columns
    let colIndexes: number[] = [];
    let delimFlag: boolean = false;
    for (let x = 0; x < delimLine.length; x++) {
        if (delimLine[x] == '-' && delimFlag == false) {
            colIndexes.push(x);
            delimFlag = true;
        }
        else if (delimLine[x] == ' ') {
            delimFlag = false;
        }
    }
    // adding number of columns to textTable Object
    textTable.nCols = colIndexes.length;
    // adding all columns with indexes and widths to textTable Object
    for (let y = 0; y < textTable.nCols; y++) {
        let colWidth;
        // column width can be determined based on column Indexes...
        if (y != textTable.nCols - 1)
            colWidth = Math.abs(colIndexes[y + 1] - colIndexes[y]);
        else    // ...except for the last element to be left undefined, as later it is computed to NaN, easier to detect
            colWidth = undefined;                   // colWidth = null; // TODO: maybe null?
        let col = new TextColumn(colIndexes[y], colWidth);
        textTable.col.push(col)
    }
    // Now that we know number of Columns and their widths/indexes - Go back to label line and extract labels
    for (let nCol = 0; nCol < textTable.nCols; nCol++) {
        let start = textTable.col[nCol].startIndex;
        let end = textTable.col[nCol].endIndex;
        let label;
        if (isNaN(end))
            end = labelLine.length;
        label = labelLine.slice(start, end).trimRight();
        textTable.col[nCol].label = label;
    }

    for (let i = 2; i < inputLines.length; i++) {
        if (inputLines[i].match(/^\s*$/)) {
            break;
        }
        else {
            for (let nCol = 0; nCol < textTable.nCols; nCol++) {
                let start = textTable.col[nCol].startIndex;
                let end = textTable.col[nCol].endIndex;
                let oneColumnLine;
                if (isNaN(end))
                    end = inputLines[i].length;
                oneColumnLine = inputLines[i].slice(start, end).trimRight();
                textTable.col[nCol].lin[i] = oneColumnLine;
            }
        }
    }

    textTable.nLins = textTable.col[0].lin.length;

    return textTable;
}

let expectedStringNoSpace =
`ID                                   Name                              Roles
--                                   ----                              -----
aaaaaa11-bb22-c3c3-d44d-dsa8cjas0dja smallletters                      Administrator
sda89ca8-4aa3-4558-adbb-d3fc34631830 Startcap                          Administrator
v12avs23-4d25-4b16-agqd-a9a2t8d11e3a this test spaces                  Administrator
av12v12v-36f6-421a-ag25-34e41e53d2ta Some_NAME_HereInalternatingCases  Contributor
a125125n-76e1-4wb4-bac5-c83b2387f120 --startswith---endswith----       Contributor
bbbbbb22-09ge-41de-b212-b1t40ttet9e6 'allthethingsarebetweenquotessss' Reader
`

parseTextTableToObjectSync(expectedStringNoSpace);