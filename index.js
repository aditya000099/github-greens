const simpleGit = require('simple-git');
const moment = require('moment');
const fs = require('fs');

const git = simpleGit();
const commitMessages = JSON.parse(fs.readFileSync('commits.json', 'utf8')).messages;

const makeCommit = async (date) => {
  const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
  const commitMessage = commitMessages[Math.floor(Math.random() * commitMessages.length)];

  // Create a temporary file to commit
  fs.writeFileSync('temp.txt', formattedDate);

  await git.add('temp.txt');
  await git.commit(commitMessage, 'temp.txt', { '--date': formattedDate });
};

const createCommitsForYear = async (year) => {
  let currentDate = moment(`${year}-01-01`);
  const endDate = moment(`${year}-12-31`);

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const date = currentDate.toDate();
    await makeCommit(date);
    console.log(`Committed for date: ${currentDate.format('YYYY-MM-DD')}`);
    currentDate = currentDate.add(1, 'days'); // Move to the next day
  }
};

// Set the year you want to target
const targetYear = 2022;

createCommitsForYear(targetYear)
  .then(() => console.log('Done making commits'))
  .catch((err) => console.error('Error making commits', err));
