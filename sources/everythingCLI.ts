import { CurrentProcess } from "./currentProcess";

function main(process: CurrentProcess): void
{
    console.log(`Hello ${JSON.stringify(process.getArguments())}!`);
}

main(CurrentProcess.create());