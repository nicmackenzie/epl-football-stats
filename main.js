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
  // input.value = '';
  fetchData(input.value.trim());
  input.value = '';
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
  console.log(scorers);
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
        <img src="${info.response[0].team.logo}" alt="${
    info.response[0].team.name
  }" />
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
      <div class="self-center">
         <p class="club-form">Club Form (Last 10 matches)</p>
         <div class="flex gap">
           ${getLastTen(stats.response.form)
             .split('')
             .map(form => {
               return `<div class="form ${form.toLowerCase()}">${form}</div>`;
             })
             .join('')}
         </div>
      </div>
    </div>
    <div class="match-stats">
      <div class="stat-card">       
        <div class="title">Games Played</div>
        <div class="content">
          <div class="stat">
            <p>Wins</p>
            <span>${stats.response.fixtures.wins.total}</span>
          </div>
          <div class="stat">
            <p>Draws</p>
            <span>${stats.response.fixtures.draws.total}</span>
          </div>
          <div class="stat">
            <p>Losses</p>
            <span>${stats.response.fixtures.loses.total}</span>
          </div>   
        </div>
      </div>
      <div class="stat-card">
        <div class="title">Goals Scored</div>
          <div class="content">
            <div class="stat">
              <p>For</p>
              <span>${stats.response.goals.for.total.total}</span>
            </div>
            <div class="stat">
              <p>Againist</p>
              <span>${stats.response.goals.against.total.total}</span>
            </div>
            <div class="stat">
              <p>Goal Difference</p>
              <span>${
                +stats.response.goals.for.total.total -
                stats.response.goals.against.total.total
              }</span>
            </div>
          </div>
      </div>
      <div class="stat-card">
        <div class="title">Clean Sheets</div>
          <div class="content">
            <div class="stat">
              <p>Home</p>
              <span>${stats.response['clean_sheet'].home}</span>
            </div>
            <div class="stat">
              <p>Away</p>
              <span>${stats.response['clean_sheet'].away}</span>
            </div>
            <div class="stat">
              <p>Total</p>
              <span>${stats.response['clean_sheet'].total}</span>
            </div>
          </div>
      </div>
      <div class="stat-card">
        <div class="title">Failed To Score</div>
        <div class="content">
          <div class="stat">
            <p>Home</p>
            <span>${stats.response['failed_to_score'].home}</span>
          </div>
          <div class="stat">
            <p>Away</p>
            <span>${stats.response['failed_to_score'].away}</span>
          </div>
          <div class="stat">
            <p>Total</p>
            <span>${stats.response['failed_to_score'].total}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  mainContent.innerHTML = html;
}
