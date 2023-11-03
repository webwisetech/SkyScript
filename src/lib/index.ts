import Environment from "../runtime/env.js";
import fs from 'fs/promises';
import path from 'path';

async function executeFunctionInFile(folderPath, fileName, context) {
  const filePath = new URL(fileName, import.meta.url).toString();
  const fullPath = path.join(folderPath, filePath);

  try {
    const module = await import(fullPath);
    if (typeof module.default === 'function') {
      module.default(context);
    } else {
      console.error(`The file ${fileName} does not export a function.`);
    }
  } catch (error) {
    console.error(`Error loading or executing ${fileName}: ${error}`);
  }
}

// Usage example:
const ssModsFolder = '/path/to/ss_mods'; // Replace with the actual folder path
const targetFileName = 'exact_file_name.js'; // Replace with the filename you're looking for
const context = { tools: 'your_tools' }; // Pass any context you need

executeFunctionInFile(ssModsFolder, targetFileName, context);

export class Library {
    constructor(
        env: Environment,
        packages: string[]
    ){

    }
}