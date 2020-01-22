A very basic parser that processes PowerShell style TextTables for my personal projects.

Assumptions of TextTable format:
- 1st and 2nd line are always label and delimiter
- Delimiters are the same number of characters as each column label
- Delimiters delimit the width of each column

What is a PowerShell style TextTable? It's something like this:
```
Column1                              LabelCol2            Column 3
-------                              ---------            --------
1a24e24d-k29d-2982-ak29-c12u882c291h This is a line       Administrator
asf212fa-f12f-f1g4-asf9-08h20n1nt01n This is another line Reader
```

You can use this library like so, assuming output is your TextTable as a string:

```javascript
let s = new Readable();
s.push(output);
s.push(null);
const tenantTable: ttp.TextTable = await ttp.parseTextTableToObjectAsync(s);

for (let y = 2; y < tenantTable.nLins; y++) { // magic number 2 is for skipping label and delimiter lines
    tenantList.push(new tenant(tenantTable.col[0].lin[y], tenantTable.col[1].lin[y])); // col 0 and 1 are name and id respectively
}
```

For more details, check the [test folder](https://github.com/andren/text-table-parse/blob/master/src/test/test.spec.ts)
