export default async function displayNewsroom() {
    document.getElementById('place').innerHTML = await getMarkup();
    addListeners();
}

async function getMarkup() {
    let anchor = await dapp.provider.listAccounts();
    anchor = anchor[0];
    console.log('anchor:', anchor);

    if (!anchor) {
        return `<div class="newsroom">${appendNetworkStatus()}</div>`;
    }

    return `<div class="newsroom">
		${appendHeader()}
		${appendNewsTeam()}
		${await appendNewsStory(anchor)}
	</div>`;
}

function appendNetworkStatus(anchor) {
    return '<div class="network-status"><div>Network Not Connected</div><div>Trying Connecting to Ropsten</div></div>';
}

function appendHeader() {
    return `<div class="space">
        <h1>THE NEWSROOM</h1>
        <h4>Where news making happens</h4>
    </div>`;
}

function appendNewsTeam(anchor) {
    return `<div class="action">
        <h2>Create a News Team 👥</h2>
        <input id="team_name" type="text" placeholder="Team Name">
        <textarea id="anchors" rows="12" cols="50" placeholder="For each News Anchor on your team enter one 0x address per line"></textarea>
        <button id="create_news_team">Create News Team</button>
    </div>`;
}

async function appendNewsStory(anchor) {
    const teams = await dapp.contracts.NewsRoom.contract.getTeams(anchor);
    console.log('teams:', teams);

    if (!teams.length) {
        return '';
    }

    return `<div class="action">
        <h2>Create a News Story 🗞</h2>
        <select id="team_list">
            ${teams.map((team) => {
                return `<option value="${team}">${ethers.utils.parseBytes32String(team)}</option>`;
            }).join('')}
        </select>
        <input id="headline" type="text" placeholder="My Captivating Headline">
        <input id="url" type="text" placeholder="https://www.example.com">
        <input id="tags" type="text" placeholder="Enter up to three comma, separated, tags">
        <button id="create_news_story">Create News Story</button>
    </div>`;
}

function addListeners() {
    if (document.getElementById('create_news_team')) {
        document.getElementById('create_news_team').addEventListener('click', createNewsTeam);
    }
    
    if (document.getElementById('create_news_story')) {
        document.getElementById('create_news_story').addEventListener('click', createNewsStory);
    }
}

async function createNewsTeam() {
    console.log('Create a News Team!');

    const teamName = document.getElementById('team_name').value;
    const anchors = document.getElementById('anchors').value.split('\n').map(item => item.trim());

    console.log('team name:', teamName);
    console.log('anchors:', anchors);

    await dapp.contracts.NewsRoom.contract.createNewsTeam(teamName, anchors);
}

async function createNewsStory() {
    console.log('Create a News Story!');

    const teamName = document.getElementById('team_list').value;
    const headline = document.getElementById('headline').value;
    const url = document.getElementById('url').value;
    const tags = document.getElementById('tags')
        .value
        .split(',')
        .slice(0, 3)
        .map(tag => window.ethers.utils.formatBytes32String(tag.trim()));

    await dapp.contracts.NewsRoom.contract.createNewsStory(teamName, headline, url, tags);
}