const { prompt } = require("enquirer");

const results = prompt([
  {
    type: "input",
    name: "name",
    message: "What is name of your  character?",
  },
  {
    type: "select",
    name: "class",
    message: "What is your character class?",
    choices: [
      {
        name: "Dwarf",
        value: "dwarf",
      },
      { name: "Wizard", value: "wizard" },
      { name: "Dragon", value: "dragon" },
    ],
  },
  {
    type: "Toggle",
    name: "custom",
    message: "Do advance customization?",
    enabled: "Yes",
    disabled: "No",
  },
  {
    type: "select",
    name: "difficulty",
    message: "Select difficulty level",
    choices: [
      { message: "Easy", value: "1" },
      { message: "Medium", value: "2" },
      { message: "Hard", value: "3" },
    ],
    initial: "2",
    skip: function () {
      return !this.state.answers.custom;
    },
  },
  {
    type: "select",
    name: "random",
    message: "Select item randomness level",
    choices: [
      { message: "Minimum", value: "1" },
      { message: "Low", value: "2" },
      { message: "Medium", value: "3" },
      { message: "High", value: "4" },
      { message: "Maximum", value: "5" },
    ],
    initial: "3",
    skip: function () {
      return !this.state.answers.custom;
    },
  },
]);

async function main() {
  const response = await results;
  console.log(response);
}

main();
