firstFunction();

var secondFunction = function(){
console.log("I was assigned to a variable.");
var aValue = 7*14;
console.log(aValue);
};

secondFunction();

function firstFunction( input ){
console.log("I am called before I am declared.");
};
