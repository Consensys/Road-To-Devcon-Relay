import React,  { Component } from 'react';
import Web3 from 'web3';
import SecureCredit from '../SecureCredit.json'
import withStyles from '@material-ui/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InstructionDialog from './dialogs/InstructionDialog';
import SwipeDialog from './dialogs/SwipeDialog';
import DepositEtherDialog from './dialogs/DepositEtherDialog';
import DepositDAIDialog from './dialogs/DepositDAIDialog';
import LoanEtherDialog from './dialogs/LoanEtherDialog';
import LoanDaiDialog from './dialogs/LoanDaiDialog';
import BorrowEtherDialog from './dialogs/BorrowEtherDialog';
import BorrowDaiDialog from './dialogs/BorrowDaiDialog';
import TextField from '@material-ui/core/TextField';
import CardMedia from '@material-ui/core/CardMedia';
import Background from '../images/icons8-ethereum-512.png';
import Icon from '@material-ui/core/Icon';
import Topbar from './Topbar';

//const backgroundShape = require('../images/shape.svg');
const logo = 'https://raw.githubusercontent.com/ethhub-io/ethhub/master/docs/assets/files/builtoneth_branding/PNG/Tall%20light%20color.png';
const abi = require('human-standard-token-abi');

const background = {
    backgroundImage: `url(${Background})`,

    overflow: 'hidden',
    paddingBottom:250,
    backgroundPosition: '0 200px'
  }

const styles = theme => ({
  /*root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200
  },*/
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    }
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1),
    width: 152
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing(2),
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  alignRight: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: 'absolute',
    top: '40%',
    left: '40%'
  }
});
var web3;

const daiAddr = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';

class Main extends Component {

  state = {
    learnMoredialog: false,
    getStartedDialog: false,
    LoanDialogEther: false,
    LoanDialogDAI: false,
    BorrowDialogEther: false,
    BorrowDialogDAI: false,
    DepositDialogEther: false,
    DepositDialogDAI: false,
    amountDepositEther: 0,
    amountDepositDAI: 0,
    amountLoanEther: 0,
    amountLoanDAI: 0,
    amountBorrowEther: 0,
    amountBorrowDAI: 0,
    dateBorrowEther: 0,
    dateBorrowDAI: 0
  };

  changeValueEther = (amountDepositEther) => {
    this.setState({amountDepositEther});
  }

  changeValueDAI = (amountDepositDAI) => {
    this.setState({amountDepositDAI});
  }

  changeValueEtherLoan = (amountLoanEther) => {
    this.setState({amountLoanEther});
  }

  changeValueDAILoan = (amountLoanDAI) => {
    this.setState({amountLoanDAI});
  }

  changeValueEtherBorrow = (amountBorrowEther) => {
    this.setState({amountBorrowEther});
  }

  changeValueDAIBorrow = (amountBorrowDAI) => {
    this.setState({amountBorrowDAI});
  }

  changeDateEtherBorrow = (dateBorrowEther) => {
    this.setState({dateBorrowEther});
  }

  changeDateDAIBorrow = (dateBorrowDAI) => {
    this.setState({dateBorrowDAI});
  }

  componentDidMount() {}

  componentWillMount() {
    this.loadWeb3()
    this.loadBlockchainData()
  }


async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
      web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId()
      const networkData = SecureCredit.networks[networkId]

      if(networkData) {
        const contractAddress = networkData.address;
        const contract = new web3.eth.Contract(SecureCredit.abi, contractAddress)
        this.setState({ contract })
        this.setState({ contractAddress })
      } else {
        window.alert('Smart contract not deployed to detected network.')
      }
    }

  openDialog = (event) => {
    this.setState({learnMoredialog: true});
  }

  dialogClose = (event) => {
    this.setState({learnMoredialog: false});
  }

  openGetStartedDialog = (event) => {
    this.setState({getStartedDialog: true});
  }

  closeGetStartedDialog = (event) => {
    this.setState({getStartedDialog: false});
  }

  openDepositEther = (event) => {
    this.setState({DepositDialogEther: true})
  }

  openLoanEther = (event) => {
    this.setState({LoanDialogEther: true})
  }

  openLoanDAI = (event) => {
    this.setState({LoanDialogDAI: true})
  }

  openBorrowEther = (event) => {
    this.setState({BorrowDialogEther: true})
  }

  openBorrowDAI = (event) => {
    this.setState({BorrowDialogDAI: true})
  }

  closeDepositDialogEther = (event) => {
    this.setState({DepositDialog: false});
    console.log(this.state);
    var contract = this.state.contract;
    web3.eth.sendTransaction({
      from: this.state.account,
      to: this.state.contractAddress,
      value: web3.utils.toWei(String(this.state.amountDepositEther))}, function(err, result){ console.log(result)})
  }

  closeLoanEther = (event) => {
    this.setState({LoanDialogEther: false});
    this.state.contract.methods.lendEther(web3.utils.toWei(this.state.amountLoanEther))
    .send({ from: this.state.account });
  }

  closeBorrowEther = (event) => {
    this.setState({BorrowDialogEther: false});
    var expirationEpoch = new Date();
    var timeEpoch = expirationEpoch.setDate(expirationEpoch.getDate() + this.state.dateBorrowEther);
    this.state.contract.methods.borrowEther(web3.utils.toWei(this.state.amountBorrowEther), timeEpoch )
    .send({ from: this.state.account });
  }

  openDepositDAI = (event) => {
    this.setState({DepositDialogDAI: true})
  }

  closeDepositDialogDAI = async (event) => {
    this.setState({DepositDialogDAI: false});
    const token = new web3.eth.Contract(abi, daiAddr)
    const batch = new web3.BatchRequest();
    batch.add(token.methods.approve(this.state.contractAddress, web3.utils.toWei(this.state.amountDepositDAI)).send({
      from: this.state.account
    }))
    batch.add(this.state.contract.methods.depositDAI().send({
      from: this.state.account
    }))
  }

  closeLoanDAI = (event) => {
    this.setState({LoanDialogDAI: false});
    this.state.contract.methods.lendToken(web3.utils.toWei(this.state.amountLoanDAI))
    .send({ from: this.state.account });
  }

  closeBorrowDAI = (event) => {
    this.setState({BorrowDialogDAI: false});
    var expirationEpoch = new Date();
    var timeEpoch = expirationEpoch.setDate(expirationEpoch.getDate() + this.state.dateBorrowDAI);
    this.state.contract.methods.borrowDAI(web3.utils.toWei(this.state.amountBorrowDAI), timeEpoch )
    .send({ from: this.state.account });
  }

  openTypeForm = (event) => {
    window.location.href="https://rachidmoulakhnif.typeform.com/to/my1GLr"
  }



  render() {
    const { classes } = this.props;
    console.log(this.state);
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root} style={background}>
          <Grid container justify="center">
            <Grid spacing={4} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                  <div className={classes.box}>
                    <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      I want to deposit!
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Deposit Ether or DAI to get started. <br/> Start securing your credit score
                    </Typography>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Button onClick={this.openDepositEther}  variant="outlined" className={classes.actionButtom}>
                    Deposit Ether
                  </Button>
                    <Button onClick={this.openDepositDAI} color='primary' variant="contained" className={classes.actionButtom}>
                      Deposit DAI
                    </Button>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                  <div className={classes.box}>
                    <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                      Borrow Ether or DAI from your collateral
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Be sure to repay it in time or you will lower your credit score
                    </Typography>
                  </div>
                  <div className={classes.alignRight}>
                    <Button onClick={this.openBorrowEther}  variant="outlined" className={classes.actionButtom}>
                      Borrow Ether
                    </Button>
                    <Button onClick={this.openBorrowDAI} color='primary' variant="contained" className={classes.actionButtom}>
                      Borrow DAI
                    </Button>
                  </div>
                </Paper>
              </Grid>
              <Grid container item xs={12} md={10} justify="center">
                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <div>
                        <div className={classes.box}>
                          <Typography color='secondary' gutterBottom>
                            Do you want to learn more ?
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Get In contact with us, we will be happy to provide you with the necessary help
                          </Typography>
                        </div>
                        <div className={classes.alignRight}>
                          <Button onClick={this.openTypeForm} color='primary' variant="contained" className={classes.actionButtom}>
                            Learn more
                          </Button>
                        </div>
                      </div>
                    </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <img width={90} src={logo} alt="" hspace="700" vspace="40"/>
          <SwipeDialog
            open={this.state.learnMoredialog}
            onClose={this.dialogClose} />
          <InstructionDialog
            open={this.state.getStartedDialog}
            onClose={this.closeGetStartedDialog}
          />
          <DepositEtherDialog
            open={this.state.DepositDialogEther}
            onClose={this.closeDepositDialogEther}
            inputValue={this.state.amountDepositEther}
            changeValue={this.changeValueEther.bind(this)}
          />
          <DepositDAIDialog
            open={this.state.DepositDialogDAI}
            onClose={this.closeDepositDialogDAI}
            inputValue={this.state.amountDepositDAI}
            changeValue={this.changeValueDAI.bind(this)}
          />
         <LoanEtherDialog
            open={this.state.LoanDialogEther}
            onClose={this.closeLoanEther}
            inputValue={this.state.amountLoanEther}
            changeValue={this.changeValueEtherLoan.bind(this)}
         />
        <LoanDaiDialog
          open={this.state.LoanDialogDAI}
          onClose={this.closeLoanDAI}
          inputValue={this.state.amountLoanDAI}
          changeValue={this.changeValueDAILoan.bind(this)}
        />
        <BorrowEtherDialog
          open={this.state.BorrowDialogEther}
          onClose={this.closeBorrowEther}
          inputValue={this.state.amountBorrowEther}
          dateValue={this.state.dateBorrowEther}
          changeValue={this.changeValueEtherBorrow.bind(this)}
          changeDate={this.changeDateEtherBorrow.bind(this)}
        />
        <BorrowDaiDialog
          open={this.state.BorrowDialogDAI}
          onClose={this.closeBorrowDAI}
          dateValue={this.state.dateBorrowDAI}
          inputValue={this.state.amountBorrowDAI}
          changeValue={this.changeValueDAIBorrow.bind(this)}
          changeDate={this.changeDateDAIBorrow.bind(this)}
        />
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Main));
