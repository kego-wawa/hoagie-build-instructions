const {forEach, find, pathOr, propEq} = require('ramda');

// Returns the dependent instruction IDs.
function hasDependentInstructions(instructionConfig) {
    const dependsOnInstructionsIds = pathOr([], ['rules', 'dependsOn'], instructionConfig);
    if (dependsOnInstructionsIds.length) {
        return dependsOnInstructionsIds;
    } else {
        return false;
    }
}

function parseDependentInstructions(
    dependsOnInstructionsIds, 
    finalInstructions,
    allInstructionsConfig
) {
    forEach((instructionId) => {
        const instructionConfig = find(propEq('id', instructionId))(allInstructionsConfig);
        if (!instructionConfig.visited) {
            instructionConfig.visited = true;

            const drilledDownDependsOnInstructionIds = hasDependentInstructions(instructionConfig);
            if (drilledDownDependsOnInstructionIds) {
                parseDependentInstructions(
                    drilledDownDependsOnInstructionIds,
                    finalInstructions,
                    allInstructionsConfig
                );
            }
            finalInstructions.push(`${instructionConfig.id}. ${instructionConfig.description}`);
        }
    }, dependsOnInstructionsIds);
}

exports.generateBuildInstructions = function(hoagieInstructionsJson) {
    const allInstructionsConfig = pathOr([], ['build', 'instructions'], hoagieInstructionsJson);
    const finalInstructions = [];
    forEach((instructionConfig) => {
        if (!instructionConfig.visited) {
            instructionConfig.visited = true;

            const dependsOnInstructionIds = hasDependentInstructions(instructionConfig);
            if (dependsOnInstructionIds) {
                parseDependentInstructions(
                    dependsOnInstructionIds,
                    finalInstructions,
                    allInstructionsConfig
                );
            }
            finalInstructions.push(`${instructionConfig.id}. ${instructionConfig.description}`);
        }
    }, allInstructionsConfig);
    return finalInstructions;
};