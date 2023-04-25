// variables
const themeToggle = document.querySelector('.theme-toggle');
const switchEl = document.querySelector('.switch');
const form = document.querySelector('form');
const input = document.querySelector('input');
const domainUrl = 'https://api-football-v1.p.rapidapi.com/v3';

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
