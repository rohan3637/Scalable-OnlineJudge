process.stdin.resume();
process.stdin.setEncoding("utf-8");
var stdin_input = "";
process.stdin.on("data", function (input) {
    stdin_input += input; 
});
process.stdin.on("end", function () {
    main(stdin_input);
});

function main(input) {
    const numbers = input.trim().split("\n").map(Number);
    const num1 = numbers[0];
    const num2 = numbers[1];
    const num3 = numbers[2];
    const sum = num1 + num2 + num3;
    console.log(sum)
}