
import numberPickerQuestions from './questions';
import pointItOutQuestions from './pointItOutQuestions';
import whosTheImposterQuestions from './whosTheImposterQuestions';
import raiseYourHandQuestions from './raiseYourHandQuestions';
import whosTheCelebrityQuestions from './whosTheCelebrityQuestions';

const gameConfig = {
  numberPicker: {
    questions: numberPickerQuestions,
    fakerPrompt: "You’re the IMPOSTER. Show any random number of fingers from 0 to 10!"
  },
  pointItOut: {
    questions: pointItOutQuestions,
    fakerPrompt: "You're the Faker! Point to any option confidently!"
  },
  whosTheImposter: {
    questions: whosTheImposterQuestions,
    fakerPrompt: "You're the IMPOSTER! Act like you know who it is."
  },
  raiseYourHand: {
    questions: raiseYourHandQuestions,
    fakerPrompt: "You're the Faker! Raise your hand wisely."
  },
  whosTheCelebrity: {
    questions: whosTheCelebrityQuestions,
    fakerPrompt: "You’re the IMPOSTER! Pretend you recognize the celebrity!"
  }
};

export default gameConfig;
