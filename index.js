// Variables

var mathExpression = "";
var resultFlag = false;

// Functions

function applyColorScheme() {
  for (var i = 1; i < 4; i++) {
    if (i == $("input").val()) {
      $("body").addClass("body-theme-" + i);
      $(".digit-operator-key").addClass("digit-operator-key-theme-" + i);
      $(".del-reset-key").addClass("del-reset-key-theme-" + i);
      $(".screen").addClass("screen-theme-" + i);
      $(".keypad").addClass("keypad-theme-" + i);
      $(".equal-key").addClass("equal-key-theme-" + i);
      $(".attribution a").addClass("attribution-link-theme-" + i);
      $("input").addClass("slider-theme-" + i);
    }
    else {
      $("body").removeClass("body-theme-" + i);
      $(".digit-operator-key").removeClass("digit-operator-key-theme-" + i);
      $(".del-reset-key").removeClass("del-reset-key-theme-" + i);
      $(".screen").removeClass("screen-theme-" + i);
      $(".keypad").removeClass("keypad-theme-" + i);
      $(".equal-key").removeClass("equal-key-theme-" + i);
      $(".attribution a").removeClass("attribution-link-theme-" + i);
      $("input").removeClass("slider-theme-" + i);
    }
  }
}

// All keys

function animateKey(key) {
  $(key).addClass("pressed-key");
  setTimeout(function() {
    $(key).removeClass("pressed-key");
  }, 100);
}

// 1-9 keys

function printDigit(digit) {
  if (resultFlag) {
    mathExpression = $(digit).text();
    $(".screen-text").text($(digit).text());
    resultFlag = false;
  }
  else {
    if (/[-+x/][0]$/.test(mathExpression)) {
      mathExpression = mathExpression.replace(/0$/, $(digit).text());
    }
    else {
      mathExpression += $(digit).text();
    }
    $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
  }
}

// 0 key

function printZero() {
  if (resultFlag) {
    mathExpression = "";
    $(".screen-text").text("0");
    resultFlag = false;
  }
  else {
    if (mathExpression !== "" && /[-+x/][0]$/.test(mathExpression) === false) {
      mathExpression += "0";
      $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
    }
  }
}

// Decimal key

function printDecimal() {
  if (resultFlag) {
    mathExpression = "0,";
    $(".screen-text").text("0,");
    resultFlag = false;
  }
  else {
    if (mathExpression === "" || /[-+x/]$/.test(mathExpression)) {
      mathExpression += "0,";
      $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
    }
    else if (/^[1-9][0-9]*$/.test(mathExpression) || /[-+x/]([0-9]|[1-9][0-9]+)$/.test(mathExpression)) {
      mathExpression += ",";
      $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
    }
  }
}

// +, x and / keys

function printOperator(operator) {
  if (mathExpression === "") {
    mathExpression += "0" + $(operator).text();
  }
  else if (/([-+]|[x/][-]?|,0*)$/.test(mathExpression)) {
    mathExpression = mathExpression.replace(/([-+]|[x/][-]?|,0*)$/, $(operator).text());
  }
  else if (/[,][0]*[1-9][0-9]*[0]+$/.test(mathExpression)) {
    mathExpression = mathExpression.replace(/[0]+$/, $(operator).text());
  }
  else {
    mathExpression += $(operator).text();
  }
  $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
  resultFlag = false;
}

// - key

function printMinus() {
  if (mathExpression === "") {
    mathExpression = "0-";
  }
  else if (/([-+]|,0*)$/.test(mathExpression)) {
    mathExpression = mathExpression.replace(/([-+]|,0*)$/, "-");
  }
  else if (/[,][0]*[1-9][0-9]*[0]+$/.test(mathExpression)) {
    mathExpression = mathExpression.replace(/[0]+$/, "-");
  }
  else {
    mathExpression += "-";
  }
  $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
  resultFlag = false;
}

// Delete key

function deleteCharacter() {
  if (resultFlag) {
    mathExpression = "";
    $(".screen-text").text("0");
    resultFlag = false;
  }
  else {
    mathExpression = mathExpression.slice(0, mathExpression.length - 1);
    if (mathExpression === "") {
      $(".screen-text").text("0");
    }
    else if (mathExpression === "0") {
      mathExpression = "";
      $(".screen-text").text("0");
    }
    else {
      $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
    }
  }
}

// Equal key

function printResult() {

  if (/^[-]/.test(mathExpression)) {
    mathExpression = "0" + mathExpression;
  }
  if (/[-+x/]$/.test(mathExpression)) {
    mathExpression = mathExpression.replace(/[-+x/]$/, "");
  }
  mathExpression = mathExpression.replace(/,/g, ".");

  var numbers = [];
  if (/([x/][-])?[0-9]+[.]?[0-9]*([e][-+][0-9]+)?/.test(mathExpression)) {
    numbers = mathExpression.match(/([x/][-])?[0-9]+[.]?[0-9]*([e][-+][0-9]+)?/g);
  }
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = numbers[i].replace(/[x/]/, "");
    numbers[i] = numbers[i] / 1;
  }

  var operators = [];
  if (/([x/][-]?|[^e][-+])/.test(mathExpression)) {
    operators = mathExpression.match(/([x/][-]?|[^e][-+])/g);
  }
  for (let i = 0; i < operators.length; i++) {
    if (/[x/][-]/.test(operators[i])) {
      operators[i] = operators[i].replace("-", "");
    }
    else if (/[^e][-+]/.test(operators[i])) {
      operators[i] = operators[i].replace(/[^e]/, "");
    }
  }

  while (operators.includes("x") || operators.includes("/")) {
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "x" || operators[i] === "/") {
        if (operators[i] === "x") {
          numbers.splice(i, 2, numbers[i] * numbers[i + 1]);
        }
        else {
          numbers.splice(i, 2, numbers[i] / numbers[i + 1]);
        }
        operators.splice(i, 1);
        break;
      }
    }
  }

  while (operators.length > 0) {
    if (operators[0] === "+") {
      numbers.splice(0, 2, numbers[0] + numbers[1]);
    }
    else {
      numbers.splice(0, 2, numbers[0] - numbers[1]);
    }
    operators.shift();
  }

  if (numbers.length === 0 || numbers[0] === 0) {
    mathExpression = "";
    $(".screen-text").text("0");
  }
  else if (!isFinite(numbers[0]) || isNaN(numbers[0])) {
    mathExpression = "";
    $(".screen-text").text("Error");
  }
  else {
    mathExpression = ("" + numbers[0]).replace(".", ",");
    $(".screen-text").text(mathExpression).scrollLeft($(".screen-text")[0].scrollWidth - $(".screen-text").width());
  }

  resultFlag = true;

}

// Start

if (localStorage.getItem("theme") === null) {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    $("input").val("2");
  }
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    $("input").val("3");
  }
  else {
    $("input").val("1");
  }
}
else {
  $("input").val(localStorage.getItem("theme"));
}
applyColorScheme();

// Slider

$("input").on("input", function() {
  applyColorScheme();
  localStorage.setItem("theme", $(this).val());
});

// Mouse

$("button").click(function() {
  var $this = $(this);

  $(this).addClass("pressed-key");
  setTimeout(function() {
    $this.removeClass("pressed-key");
  }, 100);
});

$(".digit-key").click(function() {
  printDigit(this);
});

$(".zero-key").click(function() {
  printZero();
});

$(".decimal-key").click(function() {
  printDecimal();
});

$(".operator-key").click(function() {
  printOperator(this);
});

$(".minus-key").click(function() {
  printMinus();
});

$(".del-key").click(function() {
  deleteCharacter();
});

$(".reset-key").click(function() {
  mathExpression = "";
  $(".screen-text").text("0");
  resultFlag = false;
});

$(".equal-key").click(function() {
  printResult();
});

// Keyboard

$(document).keydown(function(e) {
  if (/([0-9-]|Delete|Backspace|Enter)/.test(e.key)) {
    animateKey("#" + e.key);
  }
  else if (e.key === "+") {
    animateKey("#plus");
  }
  else if (e.key === "*") {
    animateKey("#times");
  }
  else if (e.key === "/") {
    animateKey("#divided-by");
  }
  else if (/[.,]/.test(e.key)) {
    animateKey(".decimal-key");
  }
});

$(document).keydown(function(e) {
  if (/[1-9]/.test(e.key)) {
    printDigit("#" + e.key);
  }
  else if (e.key === "0") {
    printZero();
  }
  else if (/[.,]/.test(e.key)) {
    printDecimal();
  }
  else if (e.key === "+") {
    printOperator("#plus");
  }
  else if (e.key === "*") {
    printOperator("#times");
  }
  else if (e.key === "/") {
    printOperator("#divided-by");
  }
  else if (e.key === "-") {
    printMinus();
  }
  else if (e.key === "Backspace") {
    deleteCharacter();
  }
  else if (e.key === "Delete") {
    mathExpression = "";
    $(".screen-text").text("0");
    resultFlag = false;
  }
  else if (e.key === "Enter") {
    printResult();
  }
});
