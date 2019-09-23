const hoagieInstructionsJson = require('./data/hoagie-instructions.json');
const { generateBuildInstructions } = require('./helpers');
console.log(generateBuildInstructions(hoagieInstructionsJson));