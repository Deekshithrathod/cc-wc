#!/usr/bin/env node

import path from "path";
import fs from "node:fs";
import readline from "node:readline";
import os from "os";

let flag = process.argv[2];
if (!flag) {
	console.log("Please provide a flag like -c, -w, -l");
	process.exit(1);
}

let fileName = process.argv[3];
if (!fileName) {
	if (flag.includes(".")) {
		fileName = flag;
		flag = "";
	} else {
		console.log("Please provide a file name");
		process.exit(1);
	}
}

const pathToFile = path.join(process.cwd(), fileName);

let linesCount = 0;
const rl = readline.createInterface({
	input: fs.createReadStream(pathToFile),
	output: process.stdout,
	terminal: false,
});

// Function to get the system locale
function getSystemLocale() {
	return Intl.DateTimeFormat().resolvedOptions().locale || os.locale();
}
const getCharCountInLocale = (inputString) => {
	let userLocale = getSystemLocale();
	const collator = new Intl.Collator(userLocale, { sensitivity: "base" });
	const normalizedString = inputString.normalize();
	return normalizedString.length;
};

const getBytes = (str) => {
	return new Blob([str]).size;
};

const getWordsCount = (data) => {
	let wordsCount = 0;
	const words = data.split(/\s+/);
	words.forEach((word) => {
		if (word !== "") wordsCount++;
	});
	return wordsCount;
};

try {
	const data = fs.readFileSync(pathToFile, "utf8");
	switch (flag) {
		case "-c":
			console.log("\t", getBytes(data), fileName);
			break;
		case "-l":
			rl.on("line", function (line) {
				linesCount++;
			});

			rl.on("close", function () {
				console.log("\t", linesCount, fileName);
			});
			break;

		case "-w":
			console.log("\t", getWordsCount(data), fileName);
			break;
		case "-m":
			console.log("\t", getCharCountInLocale(data), fileName);
			break;

		default:
			rl.on("line", function (line) {
				linesCount++;
			});

			rl.on("close", function () {
				console.log(
					"\t",
					linesCount,
					getWordsCount(data),
					getBytes(data),
					fileName
				);
			});
			break;
	}
} catch (err) {
	console.error(err);
}
