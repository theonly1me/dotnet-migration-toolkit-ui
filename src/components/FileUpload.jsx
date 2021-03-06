import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Paper, TextField, Container } from '@material-ui/core';
import { connect } from 'react-redux';

import useStyles from '../utils/styles';
import * as actions from '../actions';

const FileUpload = ({ generateReport, projectPath }) => {
  const classes = useStyles();
  const inputRef = useRef();
  return (
    <Container className={classes.browseContainer}>
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={5}>
          <Paper className={classes.fileUploadContainer} elevation={3}>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  inputRef={inputRef}
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={9} />
              <Grid item xs={1}>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: 20 }}
                  onClick={() => generateReport(inputRef.current.value, 'json')}
                  component={Link}
                  to="/report"
                >
                  Analyze
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => {
  if (!state.app) return {};
  const {
    app: { projectPath },
  } = state;

  return {
    projectPath,
  };
};

export default connect(mapStateToProps, actions)(FileUpload);
