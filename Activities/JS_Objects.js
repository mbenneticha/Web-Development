function deepEqual(a, b)
{ 
if (a === b)
return true;
if ((typeof a == "object" && a != null) && (typeof b == "object" && b != null))
{
//count # properties in each object
var aProp = 0;
var bProp = 0;

for (var prop_a in a)
{
aProp += 1;
}

for (var prop_b in b)
{
bProp += 1;
//if properties don't match
if ((!prop_b in a) || !deepEqual(a[prop_b], b[prop_b]))
{
return false;
}
}

return aProp === bProp;
}
else
return false;
}

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
console.log(deepEqual(obj, {here: 1, object: 2}));
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
