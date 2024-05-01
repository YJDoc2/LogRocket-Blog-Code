import { createToken, Lexer, EmbeddedActionsParser } from "chevrotain";
const nameKey = createToken({ name: "nameKey", pattern: /name/ });
const classKey = createToken({ name: "classKey", pattern: /class/ });
const irandKey = createToken({ name: "irandKey", pattern: /item_randomness/ });
const colon = createToken({ name: "colon", pattern: /:/ });
const whiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});
const nameString = createToken({ name: "nameString", pattern: /[a-zA-Z]+/ });
const classString = createToken({
  name: "classString",
  pattern: /human|dwarf|wizard/i,
});
const irandString = createToken({
  name: "randString",
  pattern: /very low|low|medium|high|very high/i,
});

const allTokens = [
  nameKey,
  classKey,
  classString,
  irandKey,
  irandString,
  whiteSpace,
  colon,
  nameString,
];

const lexer = new Lexer(allTokens);

class ConfigParser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE("config", () => {
      return $.SUBRULE($.configKeys);
    });

    $.RULE("configKeys", () => {
      let obj = {};
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              obj.name = $.SUBRULE($.characterName);
            },
          },
          {
            ALT: () => {
              obj.class = $.SUBRULE($.characterClass);
            },
          },
          {
            ALT: () => {
              obj.item_randomness = $.SUBRULE($.itemRandomness);
            },
          },
        ]);
      });
      return obj;
    });

    $.RULE("characterName", () => {
      $.CONSUME(nameKey);
      $.CONSUME(colon);
      let name = $.CONSUME(nameString).image;
      return name;
    });
    $.RULE("characterClass", () => {
      $.CONSUME(classKey);
      $.CONSUME(colon);
      let cls = $.CONSUME(classString).image.toLowerCase();
      return cls;
    });
    $.RULE("itemRandomness", () => {
      $.CONSUME(irandKey);
      $.CONSUME(colon);
      let temp = $.CONSUME(irandString).image.toLowerCase();

      let bounds = {
        "very low": [0.05, 0.2],
        low: [0.2, 0.4],
        medium: [0.4, 0.6],
        high: [0.6, 0.8],
        "very high": [0.8, 1],
      }[temp];
      let rand = Math.random();
      return $.ACTION(() => bounds[0] + (bounds[1] - bounds[0]) * rand);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

const parser = new ConfigParser();

// wrapping it all together
const lexResult = lexer.tokenize(
  "name: Rincewind\nclass: Wizard\nitem_randomness: very high\n",
);
// setting a new input will RESET the parser instance's state.
parser.input = lexResult.tokens;
// any top level rule may be used as an entry point
const value = parser.config();
console.log(value);
