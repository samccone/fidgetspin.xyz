interface rangeArgs {
  inputMin: number;
  inputMax: number;
  outputFloor: number;
  outputCeil: number;
};

export function generateRange(args: rangeArgs) {
	return function (x: number) {
		const outputRange = args.outputCeil - args.outputFloor;
		const inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
		return args.outputFloor  + (inputPct * outputRange);
  }
}

// function testRange() {
// 	const range0to10 = generateRange({
// 		inputMin: 0,
// 		inputMax: 10,
// 		outputFloor: 0,
// 		outputCeil: 10
// 	});

// 	console.assert(range0to10(5) === 5);
// 	console.assert(range0to10(0) === 0);
// 	console.assert(range0to10(10) === 10);

// 	const range5to15 = generateRange({
// 		inputMin: 0,
// 		inputMax: 1,
// 		outputFloor: 5,
// 		outputCeil: 15
// 	});

// 	console.assert(range5to15(.5) === 10);
// 	console.assert(range5to15(0) === 5);
// 	console.assert(range5to15(1) === 15);

// 	const range5to15_taking10to20 = generateRange({
// 		inputMin: 10,
// 		inputMax: 20,
// 		outputFloor: 5,
// 		outputCeil: 15
// 	});
// 	console.assert(range5to15_taking10to20(15) === 10);
// 	console.assert(range5to15_taking10to20(10) === 5);
// 	console.assert(range5to15_taking10to20(20) === 15);
// 	console.log('pass!')
// }


