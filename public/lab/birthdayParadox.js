function simulateBirthdayParadox() {
  const trials = 10000;
  let sameBirthday = 0;

  for (let i = 0; i < trials; i++) {
    let birthdays = new Set();
    let people = 23;

    for (let j = 0; j < people; j++) {
      const birthday = Math.floor(Math.random() * 365);
      if (birthdays.has(birthday)) {
        sameBirthday++;
        break;
      } else {
        birthdays.add(birthday);
      }
    }
  }

  const result = `Probability of the same birthday in a group of 23 people: ${(sameBirthday / trials) * 100}%`;
  document.getElementById("birthdayResult").innerHTML = result;
}
