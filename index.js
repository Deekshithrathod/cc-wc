#!/usr/bin/env node

import path from "path";
import fs from "node:fs";

const flag = process.argv[2];
if (!flag) {
	console.log("Please provide a flag like -c, -w, -l");
	process.exit(1);
}

const fileName = process.argv[3];
if (!fileName) {
	console.log("Please provide a file name");
	process.exit(1);
}

const pathToFile = path.join(process.cwd(), fileName);

try {
	const data = fs.readFileSync(pathToFile, "utf8");
	switch (flag) {
		case "-c":
			console.log(new Blob([data]).size, fileName);
			break;
		case "-l":
			console.log(data.split("\n").length, fileName);
			break;
		case "-w":
			let count = 0;
			data
				.split("\n")
				.forEach((line) => (count += line.trim().split(/\s+/).length));
			console.log(count, fileName);
			break;

		default:
			break;
	}

	// console.log(data.split("\n").length, fileName);
} catch (err) {
	console.error(err);
}
