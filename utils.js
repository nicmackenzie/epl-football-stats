const domainUrl = 'https://api-football-v1.p.rapidapi.com/v3';
export const mainContent = document.querySelector('.main-content');
//animate tranistion between themes
export function transition() {
  document.documentElement.classList.add('transition');
  window.setTimeout(() => {
    document.documentElement.classList.remove('transition');
  }, 1000);
}

export function changeTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light') {
    transition();
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    transition();
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

export async function sendRequest(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '915f65df84msh2ef701f1718c032p1f5431jsnfed3d971dc76',
    },
  });
  return await response.json();
}

export async function getSecondaryTeams() {
  const { teams } = await sendRequest(
    'https://football-web-pages1.p.rapidapi.com/teams.json?comp=1'
  );
  return teams;
}

export async function getTeams() {
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

export function errorHandler(name) {
  mainContent.innerHTML = `<div class="error">No search results found for: ${name}</div>`;
  setTimeout(() => {
    mainContent.innerHTML = '';
  }, 8000);
}

export async function getClubInfo(id) {
  return await sendRequest(`${domainUrl}/teams?id=${id}&league=39&season=2022`);
}

export async function getClubStats(id) {
  return await sendRequest(
    `${domainUrl}/teams/statistics?league=39&season=2022&team=${id}`
  );
}

export async function getLeagueRankings() {
  return await sendRequest(
    `https://football-web-pages1.p.rapidapi.com/league-table.json?comp=1`
  );
}

export async function getTopScorers(id) {
  return await sendRequest(
    `https://football-web-pages1.p.rapidapi.com/goalscorers.json?comp=1&team=${id}`
  );
}

export function setLoadingSpinner() {
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

export function removeSpinner() {
  mainContent.querySelector('.spinner').remove();
}

export function findRankAndPoints(teamsArray, id) {
  const foundResult = teamsArray.find(team => team.id === id);
  return { rank: foundResult.position, points: foundResult['total-points'] };
}

export function getLastTen(form) {
  return form.substr(form.length - 10);
}

export function likeButtonText(liked) {
  if (!liked) {
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
            </svg>
            <span>Like</span>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
          </svg>
          <span>Unlike</span>`;
}

export function getFavoriteClub() {
  return localStorage.getItem('favoriteClub');
}
