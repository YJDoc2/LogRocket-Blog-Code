{{
  // const { characterClass} = require('../character.js')
}}

{
  const config = {};
}

Config = (CharacterName / CharacterClass / ItemRandom)|.., _ | { return config; }

CharacterName "Name" = "name"i _? ":" _? val:$[a-zA-Z]+{
  config.name = val;
}


CharacterClass = "class"i _? ":" _? cls:Class {
  // config.class = characterClass[cls];
  config.class = cls
}

ItemRandom = "item_randomness"i _? ":" _? rand:RndVal{
  let temp =  rand.toLowerCase();
  let bounds = {
      "very low"  : [ 0.05 , 0.2 ],
      "low"       : [ 0.2 , 0.4],
      "medium"    : [ 0.4 , 0.6],
      "high"      : [ 0.6 , 0.8],
      "very high" : [ 0.8 , 1 ]
  }[temp];
  let r = Math.random();
  config.itemRand = bounds[0]+(bounds[1]-bounds[0])*r
}

Class = "Wizard"i / "Dwarf"i / "Human"i
RndVal = "very low"i / "low"i / "medium"i / "high"i / "very high"i
_ "whitespace" = [ \t\n\r]*
