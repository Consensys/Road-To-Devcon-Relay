import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import BaseDialog from './BaseDialog';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    maxWidth: 600,
    flexGrow: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  bottomMargin: {
    marginBottom: theme.spacing(2)
  }
});

const ValidationTextField = withStyles({
  root: {
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important', // override inline-style
    },
  },
})(TextField);

class InstructionDialog extends Component {

  render() {
    const { classes } = this.props;
    console.log(this.props);
    return (
      <BaseDialog {...this.props} >
        <div className={classes.bottomMargin}>
          <Typography variant="body2" gutterBottom>
            Borrow Ether from the contract
          </Typography>
        </div>
        <ValidationTextField
          className={classes.margin}
          label="Insert Amount"
          required
          value={this.props.inputValue}
          onChange={(e) => this.props.changeValue(e.target.value)}
          variant="outlined"
          defaultValue="0"
          id="validation-outlined-input"
      />
      <br/>
      <ValidationTextField
        className={classes.margin}
        label="Insert Date for scadency"
        required
        value={this.props.dateValue}
        onChange={(e) => this.props.changeDate(e.target.value)}
        variant="outlined"
        defaultValue="0"
        id="validation-outlined-input"
    />
        <Button className={classes.bottomMargin} variant='contained' onClick={this.props.onClose} color="primary" autoFocus>
          Borrow Ether
        </Button>
      </BaseDialog>
    )
  }
}

export default withRouter(withStyles(styles)(InstructionDialog));
