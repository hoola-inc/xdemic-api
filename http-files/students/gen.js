function* generatorFunction() { // Line 1
    console.log('This will be executed first.');
    yield 'Hello, ';   // Line 2  console.log('I will be printed after the pause');  
    yield 'World!';
} 

const generatorObject = generatorFunction(); // Line 3

console.log(generatorObject.next().value); // Line 4
// console.log(generatorObject.next().value); // Line 5
// console.log(generatorObject.next().value); // Line 6