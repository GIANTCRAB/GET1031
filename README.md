# GET1031

This project is used for our school project where we calculate distances from point to point. Currently, it is very slow with a `O(n^2)` peformance and has duplicate records.

## How To Use

Install Node dependencies
```
npm install
```

Compile TypeScript files
```
tsc
```

Provide CSV file `data.csv` in format (point name, coordinates - "0.01,0.4234") into `dist/` directory. Then run the `index.js` file.
```
node dist/index.js
```

It will now output a `my.csv` file in your `dist/` directory.
