import * as fs from "fs";
import * as readline from "readline";

export class TextTable {
    nCols: number;
    nLins: number;
    colArray: TextColumn[];

    constructor() {
        this.colArray = [];
    }
}

export class TextColumn {
    startIndex: number;
    endIndex: number;
    colWidth: number;
    label: string;
    lines: string[];

    constructor(startIndex: number, colWidth: number) {
        this.startIndex = startIndex;
        this.colWidth = colWidth;
        this.endIndex = this.startIndex + this.colWidth;
        this.lines = [];
    }
}

export function textTableToObject(filePath: string) {

}

var fileDir: string = "src\\test\\outputTenants.txt";

const readInterface = readline.createInterface({
    input: fs.createReadStream(fileDir),
    output: process.stdout,
    terminal: false
});

export function parseTenants(fileLoc: string): void {
    console.log(fileLoc);
}

var lineNum = 0;
var table: string[][] = [];
var labelLine: string;
let textTable = new TextTable();

readInterface.on("line", (line) => {
    let colIndexes: number[] = [];
    let delimFlag: boolean = false;

    // Table line 0 - Labels of each column
    if(lineNum == 0) {
        labelLine = line;
    }
    // Table line 1 - Delimiters - Number of columns, indexes and widths are determined here
    else if(lineNum == 1) {

        // Determine number of columns
        for(let x=0; x<line.length; x++) {
            if(line[x] == '-' && delimFlag == false) {
                colIndexes.push(x);
                delimFlag = true;
            }
            else if(line[x] == ' ') {
                delimFlag = false;
            }
        }

        // adding number of columns to textTable Object
        textTable.nCols = colIndexes.length;

        // adding all columns with indexes and widths to textTable Object
        for(let y=0; y<textTable.nCols; y++) {
            let colWidth;

            // column width can be determined based on column Indexes...
            if( y != textTable.nCols-1)
                colWidth = Math.abs(colIndexes[y+1]-colIndexes[y]);
            else    // ...except for the last element to be left undefined, as later it is computed to NaN, easier to detect
                colWidth = undefined;                   // colWidth = null; // TODO: maybe null?

            let col = new TextColumn(colIndexes[y], colWidth);
            textTable.colArray.push(col)
        }

        // Determine label line
        for(let nCol = 0; nCol < textTable.nCols; nCol ++) {
            let start = textTable.colArray[nCol].startIndex;
            let end = textTable.colArray[nCol].endIndex;

            let label;
            if(isNaN(end))
                end = labelLine.length;

            label = labelLine.slice(start,end).trimRight();
            textTable.colArray[nCol].label = label;
        }
        // console.log(textTable.colArray[0].label);
        // console.log(textTable.colArray[1].label);
        // console.log(textTable.colArray[2].label);

    //  Table lines 2,3,... - Data
    } else {
        for(let nCol = 0; nCol < textTable.nCols; nCol ++) {
            let start = textTable.colArray[nCol].startIndex;
            let end = textTable.colArray[nCol].endIndex;

            let oneColumnLine;
            if(isNaN(end))
                end = line.length;

            oneColumnLine = line.slice(start,end).trimRight();
            textTable.colArray[nCol].lines[lineNum] = oneColumnLine;
        }
        console.log(textTable.colArray[0].lines[lineNum]);
        console.log(textTable.colArray[1].lines[lineNum]);
        console.log(textTable.colArray[2].lines[lineNum]);
        console.log("---");
        
    }

    lineNum++;
});

parseTenants(fileDir);

// ID                                   Name                  Roles
// --                                   ----                  -----
// becedd69-8539-4d5e-a9f8-82d6569c6c4b cssiot                Administrator
// d343c263-4aa3-4558-adbb-d3fc34631800 Microsoft             Administrator
// f33183ab-4b45-4b16-a8cd-a9aa83d11e6a bentho test migration Administrator     
// 
/**
 * index[]
 * if( char="-" AND indexFlag==false )
 *    index[].push(getIndex);
 *    indexFlag = true;
 * elseif( char=" " )
 *    indexFlag = false;
 */
// X                                    X      X
// ID                                   Name   Roles
// --                                   ----   -----
// becedd69-8539-4d5e-a9f8-82d6569c6c4b cssiot Administrator