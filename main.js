import {
  getFavoriteClub,
  likeButtonText,
  getLastTen,
  findRankAndPoints,
  removeSpinner,
  setLoadingSpinner,
  getTopScorers,
  getLeagueRankings,
  getClubStats,
  getClubInfo,
  errorHandler,
  getTeams,
  changeTheme,
  mainContent,
  getStandings,
} from './utils.js';
// variables
const themeToggle = document.querySelector('.theme-toggle');
const switchEl = document.querySelector('.switch');
const form = document.querySelector('form');
const input = document.querySelector('input');

let teamName;
let isLiked = false;
let searchDone = false;

document.addEventListener('DOMContentLoaded', () => {
  const favClub = getFavoriteClub()?.toString();
  if (favClub) {
    fetchData(favClub);
  } else {
    renderLeagueStandings();
  }
});

themeToggle.addEventListener('click', () => {
  switchEl.classList.toggle('dark');
  changeTheme();
});

input.addEventListener('blur', e => {
  if (e.target.value.trim() === '' && !searchDone) {
    input.classList.add('is-invalid');
  }
});

input.addEventListener('change', e => {
  if (e.target.value.trim() !== '') {
    input.classList.remove('is-invalid');
  }
});

input.addEventListener('focus', () => {
  searchDone = false;
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
  searchDone = true;
  input.value = '';
  input.blur();
});

async function fetchData(name) {
  setLoadingSpinner();
  const teams = await getTeams();
  const team = teams.find(
    team => team.name.toLowerCase() === name.toLowerCase()
  );
  if (!team) {
    removeSpinner();
    errorHandler(name);
    return;
  }

  teamName = team.name;
  if (getFavoriteClub() === teamName) {
    isLiked = true;
  } else {
    isLiked = false;
  }

  const [info, stats, rank, scorers] = await Promise.all([
    getClubInfo(team.id),
    getClubStats(team.id),
    getLeagueRankings(),
    getTopScorers(team.secondaryId),
  ]);
  removeSpinner();
  renderHTML(info, stats, rank, scorers, team.secondaryId);
}

function renderHTML(info, stats, rank, scorers, secondaryId) {
  const pointsRanks = findRankAndPoints(
    rank['league-table'].teams,
    secondaryId
  );
  const html = `
    <div class="action">
      <button class="like-btn ${isLiked && 'liked'}">${likeButtonText(
    isLiked
  )}</button>
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
  const btn = mainContent.querySelector('.like-btn');
  btn.addEventListener('click', likeUnlikeHandler);
}

async function renderLeagueStandings() {
  mainContent.innerHTML = '';
  setLoadingSpinner();
  const response = await getStandings();
  removeSpinner();
  const [standings] = response.response[0].league.standings;
  const html = `
    <table>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Club</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        ${standings
          .map(
            standing => `
            <tr>
              <td>${standing.rank}</td>
              <td>${standing.team.name}</td>
              <td>${standing.points}</td>
            </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
  mainContent.innerHTML = html;
}

function likeUnlikeHandler(e) {
  // console.log(e.currentTarget);
  // check if there is record in local storage
  const favoriteClub = getFavoriteClub();
  // if not record, add record and add liked class to button,change innerText to unlike + change svg
  if (!favoriteClub) {
    localStorage.setItem('favoriteClub', teamName);
    isLiked = true;
    e.currentTarget.classList.add('liked');
    e.currentTarget.innerHTML = likeButtonText(isLiked);
    return;
  }
  if (favoriteClub && favoriteClub.toLowerCase() !== teamName.toLowerCase()) {
    alert(
      `You have already liked ${favoriteClub}! You can only like one club at a time`
    );
    return;
  }
  localStorage.removeItem('favoriteClub');
  isLiked = false;
  e.currentTarget.classList.remove('liked');
  e.currentTarget.innerHTML = likeButtonText(isLiked);
  // if record exists and club name not same as stored, alert user
  // if record exists and club name same as one opened, remove from local storage and change button text + svg
}
