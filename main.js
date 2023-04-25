themeToggle.addEventListener('click', () => {
  switchEl.classList.toggle('dark');
  changeTheme();
});

input.addEventListener('blur', e => {
  if (e.target.value.trim() === '') {
    input.classList.add('is-invalid');
  }
});

input.addEventListener('change', e => {
  if (e.target.value.trim() !== '') {
    input.classList.remove('is-invalid');
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  input.classList.remove('is-invalid');
  if (input.value.trim() === '') {
    input.classList.add('is-invalid');
    return;
  }
  mainContent.innerHTML = '';
  fetchData(input.value.trim());
});

async function fetchData(name) {
  setLoadingSpinner();
  const teams = await getTeams();
  const team = teams.find(
    team => team.name.toLowerCase() === name.toLowerCase()
  );
  if (!team) {
    errorHandler(name);
    return;
  }

  setLoadingSpinner();
  const [info, stats, rank, scorers] = await Promise.all([
    getClubInfo(team.id),
    getClubStats(team.id),
    getLeagueRankings(),
    getTopScorers(team.secondaryId),
  ]);
  removeSpinner();
  console.log(stats, rank, scorers);
  renderHTML(info, stats, rank, scorers, team.secondaryId);
}

function renderHTML(info, stats, rank, scorers, secondaryId) {
  const pointsRanks = findRankAndPoints(
    rank['league-table'].teams,
    secondaryId
  );
  const html = `
    <div class="club-information">
      <div class="flex">
        <img src="${info.response[0].team.logo}" alt="${info.response[0].team.name}" />
        <div class="about-club">
          <h2>${info.response[0].team.name}</h2>
          <p>Founded in ${info.response[0].team.founded}</p>
          <p>Venue: ${info.response[0].venue.name}</p>
          <p>Capacity: ${info.response[0].venue.capacity}</p>
        </div>
      </div>
      <div class="points-rank">
          <span class="rank">${pointsRanks.rank}</span>
          <span class="points">${pointsRanks.points} points</span>
      </div>
    </div>  
  `;
  mainContent.innerHTML = html;
}
