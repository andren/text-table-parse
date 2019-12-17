import * as fs from "fs";
import * as readline from "readline";

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
 * 
 * @param stream A file stream created 
 */
export async function parseTextTableToObjectAsync(stream: fs.ReadStream):Promise<TextTable> {
    const rl = readline.createInterface({
        input: stream,
        output: process.stdout,
        terminal: false     // TODO
    });

    return new Promise( (resolve,reject) => {
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
                if(line.match(/^\s*$/)) {
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
            textTable.nLins = lineNum+1;
            resolve(textTable);
        });
    });
}