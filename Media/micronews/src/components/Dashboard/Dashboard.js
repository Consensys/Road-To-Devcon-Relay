import React from "react";
import DashboardCard from "./DashboardCard";
import DashboardItem from "./DashboardItem";
import MicronewsContract from "../../contracts/Micronews.json";
import getWeb3 from "../../utils/getWeb3";
import getContract from "../../utils/getContract";

class Dashboard extends React.Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    ready: false
  };

  componentDidMount = async () => {
    const { accounts, web3, contract } = await getContract();

    this.setState({ web3, accounts, contract }, this.setReady);
  };

  setReady = () => {
    this.setState({ ready: true });
  };

  render() {
    const numTokens = 16.41;
    const tokenVal = 0.73;
    const channelEquity = numTokens * tokenVal;
    const tokenCostBasis = 0.61;
    const costBasis = tokenCostBasis * numTokens;
    const monthlyDiv = 0.007;

    const subscribers = 643;
    const subFee = 0.1;
    const channelRev = subscribers * subFee;

    return (
      <div className="d-flex flex-column w-100 mx-auto">
        <div className="d-flex flex-column w-100 mt-5">
          <h1 className="dashboard-headline mb-3">Equity Ownership</h1>
          <DashboardCard>
            <div className="d-flex flex-column">
              <div className="d-flex">
                <DashboardItem title="Channel" value="Gaming" />
                <DashboardItem title="Equity Tokens" value={`${numTokens}`} />
                <DashboardItem
                  title="Value per Token"
                  value={`${tokenVal} ETH`}
                />
                <DashboardItem
                  title="Channel Equity"
                  value={`${channelEquity.toFixed(2)} ETH`}
                />
                <DashboardItem
                  title="Cost Basis"
                  value={`${costBasis.toFixed(2)} ETH`}
                />
                <DashboardItem
                  title="Equity return"
                  value={`${String((channelEquity / costBasis - 1) * 100).slice(0, 5)}%`}
                />
              </div>
              <div className="d-flex mt-3">
                <DashboardItem
                  title="Est. monthly div"
                  value={`${monthlyDiv} ETH`}
                />
                <DashboardItem
                  title="Est. annual yield"
                  value={`${(((monthlyDiv * 12) / tokenVal) * 100).toFixed(
                    2
                  )}%`}
                />
                <DashboardItem
                  title="Claimable dividends"
                  value={`${monthlyDiv * 2} ETH`}
                />
                <DashboardItem title="Channel Ownership" value={`2.93%`} />
              </div>
            </div>
          </DashboardCard>
          <h1 className="dashboard-headline mb-3">Creator Channels</h1>

          <DashboardCard>
            <div className="d-flex flex-column">
              <div className="d-flex">
                <DashboardItem title="Channel" value="Film" />
                <DashboardItem title="Subscribers" value={`${subscribers}`} />
                <DashboardItem
                  title="Weekly revenue"
                  value={`${channelRev} ETH`}
                />
                <DashboardItem title="Fee period posts" value={`256`} />
                <DashboardItem
                  title="Exp. creator revenue"
                  value={`${channelRev / 2} ETH`}
                />
                <DashboardItem title="Creators" value={`81`} />
              </div>
              <div className="d-flex flex-column">
                <div className="current-period ml-1 mt-3 mb-2">
                  Your stats this period
                </div>
                <div className="d-flex">
                  <DashboardItem title="Posts" value="9" />
                  <DashboardItem title="Quality rating" value="89%" />
                  <DashboardItem title="Bookmarks" value="19" />
                  <DashboardItem title="Expected revenue" value="2.71 ETH" />
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    );
  }
}

export default Dashboard;
