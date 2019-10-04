import React,  { Component } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import CardItem from './cards/CardItem';
import Topbar from './Topbar';
import SectionHeader from './typo/SectionHeader';
//const backgroundShape = require('../images/shape.svg');

const styles = theme => ({

  grid: {
    width: 1000
  }
})

class Cards extends Component {

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <SectionHeader title="Cards" subtitle="One page with a list of a collection" />
                <CardItem />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Cards);
