const ohm = require("ohm-js");

const configGrammer = ohm.grammar(String.raw`
ConfigGrammer{
Config
	= ListOf< ConfigKey, "">
ConfigKey
	= characterName | CharacterClass | ItemRand

characterName
	= "name" spaces ":" spaces letter+ 
CharacterClass
	= "class" ":"  class
ItemRand
	= "item_randomness" ":" randomness
class
	= caseInsensitive<"Wizard"> | caseInsensitive<"Dwarf"> | caseInsensitive<"Human">
randomness
	= caseInsensitive<"very low"> | caseInsensitive<"low"> | caseInsensitive<"medium"> 
    	| caseInsensitive<"high"> | caseInsensitive<"very high">
}
`);

const userInput = String.raw`
name: Rincewind
class: wizard
item_randomness: Very High
`;
const m = configGrammer.match(userInput.trim());
console.log(m.succeeded());
const semantics = configGrammer.createSemantics();
semantics.addOperation("parse", {
  Config(config) {
    const obj = {};
    for (const c of config.asIteration().children) {
      let v = c.parse();
      obj[v[0]] = v[1];
    }
    return obj;
  },
  characterName(_1, _2, _3, _4, name) {
    return ["name", name.sourceString];
  },
  CharacterClass(_1, _2, cls) {
    return ["class", cls.sourceString.toLowerCase()];
  },
  ItemRand(_1, _2, r) {
    let temp = r.sourceString.toLowerCase();
    let bounds = {
      "very low": [0.05, 0.2],
      low: [0.2, 0.4],
      medium: [0.4, 0.6],
      high: [0.6, 0.8],
      "very high": [0.8, 1],
    }[temp];
    let rand = Math.random();
    return ["itemRand", bounds[0] + (bounds[1] - bounds[0]) * rand];
  },
});
console.log(semantics(m).parse());
