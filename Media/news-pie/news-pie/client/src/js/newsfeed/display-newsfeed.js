import apiKey from '../secrets/apiKey';

const urlParams = new URLSearchParams (window.location.search);

async function getMarkup () {
  const feed = await getFeed();
  console.log('feed:', feed);

  return `<div class="newsfeed">
    <div class="feed">
      ${getFeedMarkup(feed.reverse())}
    </div>
	</div>`;
}

async function getFeed() {
  const topic0 = getTopic0();
  const topic1 = getTopic1();
  const topic2 = getTopic2();

  const url = getURL(topic0, topic1, topic2);

  const response = await fetch (url).then (data => {
    return data.json();
  });

  return response.result;
}

function getURL(topic0, topic1, topic2) {
  return `https://api-ropsten.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${window.dapp.contracts.NewsRoom.address}&topic0=${topic0}&topic1=${topic1}&topic2=${topic2}&apikey=${apiKey}`;
}

function getTopic0() {
  if (urlParams.has('tag')) {
    return window.dapp.contracts.NewsRoom.contract.interface.events.OnCreateNewsTopic.topic;
  }

  return window.dapp.contracts.NewsRoom.contract.interface.events.OnCreateNewsStory.topic;
}

function getTopic1 () {
  if (urlParams.has('newsteam')) {
    return window.ethers.utils.formatBytes32String(urlParams.get('newsteam'));
  }
  return '';
}

function getTopic2 () {
  if (urlParams.has('tag')) {
    return window.ethers.utils.formatBytes32String(urlParams.get('tag'));
  }
  return '';
}

function getFeedMarkup(feed) {
  return feed.reduce((acc, item, index) => {
    const data = dapp.contracts.NewsRoom.contract.interface.events.OnCreateNewsStory.decode(item.data);
    const date = new Date(parseInt(data[5]) * 1000);
    const newsteam = ethers.utils.parseBytes32String(item.topics[1]);

    return acc + `<div class="post">
      <div class="timestamp">${date.toDateString()}</div>
      <div class="headline"><a href="${data[3]}" target="_blank">${data[2]}</a></div>
      <a class="team" href="./?place=newsfeed&newsteam=${newsteam}"><div>${newsteam}</div></a>
      <div class="tags">${getTags(data[4])}</div>
    </div>`
  }, '');
}

function getTags(tags) {
  return tags.reduce((acc, tag) => {
    const _tag = ethers.utils.parseBytes32String(tag);

    let href = `./?place=newsfeed&tag=${_tag}`;

    if (urlParams.has('newsteam')) {
      href += ('&newsteam=' + urlParams.get('newsteam'));
    }
    return acc + `<a href="${href}"><span class="tag">${_tag}</span></a>`;
  }, '');
}

export default async function displayNewsfeed () {
  document.getElementById ('place').innerHTML = await getMarkup ();
}