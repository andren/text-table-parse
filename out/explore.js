"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var TextTable = /** @class */ (function () {
    function TextTable() {
        this.colArray = [];
    }
    return TextTable;
}());
exports.TextTable = TextTable;
var TextColumn = /** @class */ (function () {
    function TextColumn(startIndex, colWidth) {
        this.startIndex = startIndex;
        this.colWidth = colWidth;
        this.endIndex = this.startIndex + this.colWidth;
        this.lines = [];
    }
    return TextColumn;
}());
exports.TextColumn = TextColumn;
var fileDir = "src\\outputTenants.txt";
var readInterface = readline.createInterface({
    input: fs.createReadStream(fileDir),
    output: process.stdout,
    terminal: false
});
function parseTenants(fileLoc) {
    console.log(fileLoc);
}
exports.parseTenants = parseTenants;
var lineNum = 0;
var table = [];
var labelLine;
var textTable = new TextTable();
readInterface.on("line", function (line) {
    var colIndexes = [];
    var delimFlag = false;
    // Table line 0 - Labels of each column
    if (lineNum == 0) {
        labelLine = line;
    }
    // Table line 1 - Delimiters - Number of columns, indexes and widths are determined here
    else if (lineNum == 1) {
        // Determine number of columns
        for (var x = 0; x < line.length; x++) {
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
        for (var y = 0; y < textTable.nCols; y++) {
            var colWidth = void 0;
            // column width can be determined based on column Indexes...
            if (y != textTable.nCols - 1)
                colWidth = Math.abs(colIndexes[y + 1] - colIndexes[y]);
            else // ...except for the last element to be left undefined, as later it is computed to NaN, easier to detect
                colWidth = undefined; // colWidth = null; // TODO: maybe null?
            var col = new TextColumn(colIndexes[y], colWidth);
            textTable.colArray.push(col);
        }
        // Determine label line
        for (var nCol = 0; nCol < textTable.nCols; nCol++) {
            var start = textTable.colArray[nCol].startIndex;
            var end = textTable.colArray[nCol].endIndex;
            var label = void 0;
            if (isNaN(end))
                end = labelLine.length;
            label = labelLine.slice(start, end).trimRight();
            textTable.colArray[nCol].label = label;
        }
        // console.log(textTable.colArray[0].label);
        // console.log(textTable.colArray[1].label);
        // console.log(textTable.colArray[2].label);
        //  Table lines 2,3,... - Data
    }
    else {
        for (var nCol = 0; nCol < textTable.nCols; nCol++) {
            var start = textTable.colArray[nCol].startIndex;
            var end = textTable.colArray[nCol].endIndex;
            var oneColumnLine = void 0;
            if (isNaN(end))
                end = line.length;
            oneColumnLine = line.slice(start, end).trimRight();
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
//# sourceMappingURL=explore.js.map