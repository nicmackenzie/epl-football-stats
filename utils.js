// variables
const themeToggle = document.querySelector('.theme-toggle');
const switchEl = document.querySelector('.switch');
const form = document.querySelector('form');
const input = document.querySelector('input');
const domainUrl = 'https://api-football-v1.p.rapidapi.com/v3';
const mainContent = document.querySelector('.main-content');

//animate tranistion between themes
function transition() {
  document.documentElement.classList.add('transition');
  window.setTimeout(() => {
    document.documentElement.classList.remove('transition');
  }, 1000);
}

function changeTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light') {
    transition();
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    transition();
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

async function sendRequest(url, apiKey) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '915f65df84msh2ef701f1718c032p1f5431jsnfed3d971dc76',
    },
  });
  return await response.json();
}

async function getSecondaryTeams() {
  const { teams } = await sendRequest(
    'https://football-web-pages1.p.rapidapi.com/teams.json?comp=1'
  );
  return teams;
}

async function getTeams() {
  const teams = await sendRequest(
    'https://api-football-beta.p.rapidapi.com/teams?league=39&season=2022'
  );
  const formattedTeams = teams.response.map(team => {
    return {
      id: team.team.id,
      name: team.team.name,
    };
  });

  const secondaryTeams = await getSecondaryTeams();

  formattedTeams.forEach(team => {
    const secTeam = secondaryTeams.find(
      tm =>
        tm['full-name'] === team.name ||
        tm['short-name'] === team.name ||
        tm['short-name'].toLowerCase().includes(team.name.toLowerCase())
    );
    team.secondaryId = secTeam?.id;
  });

  return formattedTeams;
}

function errorHandler(name) {
  mainContent.innerHTML = `<div class="error">No search results found for: ${name}</div>`;
  setTimeout(() => {
    mainContent.innerHTML = '';
  }, 8000);
}

async function getClubInfo(id) {
  return await sendRequest(`${domainUrl}/teams?id=${id}&league=39&season=2022`);
}

async function getClubStats(id) {
  return await sendRequest(
    `${domainUrl}/teams/statistics?league=39&season=2022&team=${id}`
  );
}

async function getLeagueRankings() {
  return await sendRequest(
    `https://football-web-pages1.p.rapidapi.com/league-table.json?comp=1`
  );
}

async function getTopScorers(id) {
  return await sendRequest(
    `https://football-web-pages1.p.rapidapi.com/goalscorers.json?comp=1&team=${id}`
  );
}

function setLoadingSpinner() {
  mainContent.innerHTML = `
  <div class="spinner">
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
      class="spinner_P7sC"
    />
    </svg>
  </div>
  `;
}

function removeSpinner() {
  mainContent.querySelector('.spinner').remove();
}

function findRankAndPoints(teamsArray, id) {
  const foundResult = teamsArray.find(team => team.id === id);
  return { rank: foundResult.position, points: foundResult['total-points'] };
}

function getLastTen(form) {
  return form.substr(form.length - 10);
}
