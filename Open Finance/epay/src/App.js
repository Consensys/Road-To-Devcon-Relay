import React from 'react';
import web3Obj from './helper';
import Button from 'react-bootstrap-button-loader';


class App extends React.Component {
    state = {
        account: '',
        balance: '',
        transaction: {
            receiver_email: '',
            pay_amount: 0
        },
        loading: false,
        loadingPay: false
    };

    componentDidMount() {
        const isTorus = sessionStorage.getItem('pageUsingTorus');
        if (isTorus) {
            web3Obj.initialize().then(() => {
                this.setStateInfo()
            })
        }
    }

    setStateInfo = () => {
        web3Obj.web3.eth.getAccounts().then(accounts => {
            this.setState({account: accounts[0]});
            web3Obj.web3.eth.getBalance(accounts[0]).then(balance => {
                this.setState({balance: web3Obj.web3.utils.fromWei(balance, "ether")})
            })
        })
    };

    enableTorus = async () => {
        this.setState({loading: true});
        try {
            await web3Obj.initialize();
            this.setStateInfo()
        } catch (error) {
            console.error(error)
        }
        this.setState({loading: false});
    };

    updatePaymentDetails = (key, value) => {
        const transaction = this.state.transaction;
        transaction[key] = value;
        this.setState({
            transaction: transaction
        })
    };

    sendPayment = async () => {
        this.setState({loadingPay: true});
        let address = await web3Obj.fetchAddressUsingEmail(this.state.transaction.receiver_email);
        await web3Obj.web3.eth.sendTransaction({
            from: this.state.account,
            to: address,
            value: web3Obj.web3.utils.toWei(this.state.transaction.pay_amount, "ether")
        });
        web3Obj.web3.eth.getBalance(this.state.account).then(balance => {
            this.setState({balance: web3Obj.web3.utils.fromWei(balance, "ether")})
        });
        this.setState({loadingPay: false});
    };

    logout = async () => {
        await web3Obj.logout();
        this.setState({
            account: '',
            balance: '',
            transaction: {
                receiver_email: '',
                pay_amount: 0
            }
        });
    };

    render() {
        let loggedIn = this.state.account !== '';
        return (
            <div className="App">
                <div className="panel-landing  h-100 d-flex" id="section-1">
                    <div className="jumbotron" style={{margin: "auto", textAlign: "center"}}>
                        <img src="/logo.png" width="200" height="200"/>
                        <p><b>Send or receive ETH using your Google/Gsuite emails</b></p>
                        <br/>
                        {!loggedIn &&
                        <div>
                            <Button variant="primary btn" onClick={this.enableTorus} loading={this.state.loading}>Login
                                using gmail</Button>
                        </div>
                        }
                        {loggedIn &&
                        <div>
                            <div>Account: {this.state.account}</div>
                            <div>Balance: {this.state.balance}</div>
                            <Button variant="secondary btn btn-sm" onClick={this.logout}>Logout</Button>
                            <br/>
                            <br/>
                            <div><p className="h5">Pay Using Email</p></div>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Receiver Email"
                                       onChange={e => this.updatePaymentDetails('receiver_email', e.target.value)}/>
                            </div>
                            <div>
                                <input className="form-control" type="text" placeholder="Amount in ETH"
                                       onChange={e => this.updatePaymentDetails('pay_amount', e.target.value)}/>
                            </div>
                            <br/>
                            <div>
                                <Button variant="primary btn" onClick={this.sendPayment} loading={this.state.loadingPay}>Send ETH</Button>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App
