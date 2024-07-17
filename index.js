const simpleGit = require('simple-git');
const moment = require('moment');
const fs = require('fs');

const git = simpleGit();
const commitMessages = JSON.parse(fs.readFileSync('commits.json', 'utf8')).messages;

// Function to generate a random number of commits for the specific day
const getRandomCommitsCount = () => {
  const prob = Math.random();
  if (prob < 0.7) {
    return Math.floor(Math.random() * 10) + 1; // 70% probability to have between 1 and 10 commits
  } else {
    return Math.floor(Math.random() * 41); // 30% probability to have between 0 and 40 commits
  }
};

const makeCommit = async (date) => {
  const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
  const commitMessage = commitMessages[Math.floor(Math.random() * commitMessages.length)];

  // Create a temporary file to commit
  fs.writeFileSync('temp.txt', formattedDate);

  await git.add('temp.txt');
  await git.commit(commitMessage, 'temp.txt', { '--date': formattedDate });
};

const createCommitsForDate = async (date) => {
  const commitCount = getRandomCommitsCount();

  for (let i = 0; i < commitCount; i++) {
    await makeCommit(date);
  }

  console.log(`Committed ${commitCount} times for date: ${moment(date).format('YYYY-MM-DD')}`);
};

// Set the specific date you want to target
const targetDate = '2024-12-31';

createCommitsForDate(targetDate)
  .then(() => console.log('Done making commits'))
  .catch((err) => console.error('Error making commits', err));
