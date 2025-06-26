Clazz.declarePackage("J.adapter.readers.quantum");
Clazz.load(["J.adapter.readers.quantum.AdfReader"], "J.adapter.readers.quantum.AmsReader", null, function(){
var c$ = Clazz.declareType(J.adapter.readers.quantum, "AmsReader", J.adapter.readers.quantum.AdfReader);
Clazz.overrideMethod(c$, "initializeReader", 
function(){
this.isADF = false;
});
});
;//5.0.1-v7 Fri May 30 04:36:42 CDT 2025
