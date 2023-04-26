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
    <div class="action">
      <button class="like-btn"> 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
        </svg>
        <span>Like</span>
      </button>
    </div>
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
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Goals Scored</th>
        </tr>
      </thead>
      <tbody>
      ${scorers.goalscorers.players
        .slice(0, 5)
        .map(player => {
          return `
          <tr>
            <td>${player['first-name']} ${player['last-name']}</td>
            <td>${player.goals.length}</td>
          </tr>  
        `;
        })
        .join('')}
      </tbody>
    </table>
  `;
  mainContent.innerHTML = html;
}
