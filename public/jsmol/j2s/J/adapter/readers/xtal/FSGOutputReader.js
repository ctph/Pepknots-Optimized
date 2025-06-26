Clazz.declarePackage("J.adapter.readers.xtal");
Clazz.load(["J.adapter.smarter.AtomSetCollectionReader"], "J.adapter.readers.xtal.FSGOutputReader", ["JU.Lst", "$.M3", "$.M4", "$.P3", "$.PT", "$.SB", "J.api.JmolAdapter", "JS.SymmetryOperation", "JU.Vibration"], function(){
var c$ = Clazz.decorateAsClass(function(){
this.elementSymbols = null;
Clazz.instantialize(this, arguments);}, J.adapter.readers.xtal, "FSGOutputReader", J.adapter.smarter.AtomSetCollectionReader);
Clazz.defineMethod(c$, "initializeReader", 
function(){
Clazz.superCall(this, J.adapter.readers.xtal.FSGOutputReader, "initializeReader", []);
var symbols = this.getFilterWithCase("elements=");
if (symbols != null) {
this.elementSymbols = JU.PT.split(symbols.$replace(',', ' '), " ");
}var sb =  new JU.SB();
try {
while (this.rd() != null) sb.append(this.line);

this.processJSON(this.vwr.parseJSONMap(sb.toString()));
} catch (e) {
if (Clazz.exceptionOf(e, Exception)){
e.printStackTrace();
} else {
throw e;
}
}
this.continuing = false;
});
Clazz.defineMethod(c$, "processJSON", 
function(json){
this.getHeaderInfo(json);
var info = J.adapter.readers.xtal.FSGOutputReader.getList(json, "G0_std_Cell");
this.getCellInfo(this.getListItem(info, 0));
this.readAllOperators(J.adapter.readers.xtal.FSGOutputReader.getList(json, "G0_std_operations"));
this.readAtomsAndMoments(info);
}, "java.util.Map");
Clazz.defineMethod(c$, "getListItem", 
function(info, i){
return info.get(i);
}, "JU.Lst,~N");
c$.getList = Clazz.defineMethod(c$, "getList", 
function(json, key){
return json.get(key);
}, "java.util.Map,~S");
Clazz.defineMethod(c$, "getHeaderInfo", 
function(json){
this.setSpaceGroupName(json.get("FPG_symbol"));
this.appendUnitCellInfo("SSG_international_symbol=" + json.get("SSG_international_symbol"));
}, "java.util.Map");
Clazz.defineMethod(c$, "getCellInfo", 
function(list){
this.setFractionalCoordinates(true);
for (var i = 0; i < 3; i++) {
var v = J.adapter.readers.xtal.FSGOutputReader.getPoint(this.getListItem(list, i));
this.addExplicitLatticeVector(i,  Clazz.newFloatArray(-1, [v.x, v.y, v.z]), 0);
}
}, "JU.Lst");
c$.getPoint = Clazz.defineMethod(c$, "getPoint", 
function(item){
return JU.P3.new3(J.adapter.readers.xtal.FSGOutputReader.getValue(item, 0), J.adapter.readers.xtal.FSGOutputReader.getValue(item, 1), J.adapter.readers.xtal.FSGOutputReader.getValue(item, 2));
}, "JU.Lst");
c$.getValue = Clazz.defineMethod(c$, "getValue", 
function(item, i){
return (item.get(i)).floatValue();
}, "JU.Lst,~N");
Clazz.defineMethod(c$, "readAllOperators", 
function(info){
for (var i = 0, n = info.size(); i < n; i++) {
var op = info.get(i);
var mspin = this.readMatrix(this.getListItem(op, 0), null);
var mop = this.readMatrix(this.getListItem(op, 1), this.getListItem(op, 2));
var s = JS.SymmetryOperation.getXYZFromMatrixFrac(mop, false, false, false, true, true, "xyz") + JS.SymmetryOperation.getSpinString(mspin, true);
System.out.println("FSGOutput op[" + (i + 1) + "]=" + s);
this.setSymmetryOperator(s);
}
}, "JU.Lst");
Clazz.defineMethod(c$, "readMatrix", 
function(rot, trans){
var r =  new JU.M3();
for (var i = 0; i < 3; i++) {
r.setRowV(i, J.adapter.readers.xtal.FSGOutputReader.getPoint(this.getListItem(rot, i)));
}
var t = (trans == null ?  new JU.P3() : J.adapter.readers.xtal.FSGOutputReader.getPoint(trans));
return JU.M4.newMV(r, t);
}, "JU.Lst,JU.Lst");
Clazz.defineMethod(c$, "readAtomsAndMoments", 
function(info){
var atoms = this.getListItem(info, 1);
var ids = this.getListItem(info, 2);
var moments = this.getListItem(info, 3);
for (var i = 0, n = atoms.size(); i < n; i++) {
var xyz = J.adapter.readers.xtal.FSGOutputReader.getPoint(this.getListItem(atoms, i));
var id = Clazz.floatToInt(J.adapter.readers.xtal.FSGOutputReader.getValue(ids, i));
var moment = J.adapter.readers.xtal.FSGOutputReader.getPoint(this.getListItem(moments, i));
var a = this.asc.addNewAtom();
a.setT(xyz);
this.setAtomCoord(a);
if (this.elementSymbols != null && id <= this.elementSymbols.length) {
a.elementSymbol = this.elementSymbols[id - 1];
} else {
a.elementNumber = (id + 2);
}var v =  new JU.Vibration().setType(-2);
v.set(moment.x, moment.y, moment.z);
v.magMoment = v.length();
if (v.magMoment > 0) System.out.println("FGSOutput moment " + i + " " + v.magMoment + " " + v);
a.vib = v;
}
}, "JU.Lst");
Clazz.overrideMethod(c$, "finalizeSubclassReader", 
function(){
this.asc.setNoAutoBond();
this.applySymmetryAndSetTrajectory();
this.addJmolScript("vectors on;vectors 0.15;");
});
});
;//5.0.1-v7 Fri May 30 08:50:10 CDT 2025
