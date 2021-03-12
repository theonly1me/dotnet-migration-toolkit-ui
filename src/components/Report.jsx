import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DLLIcon from '@material-ui/icons/PlayForWork';
import SubProject from '@material-ui/icons/AccountTree';
import '../utils/loader.css';
import {
  Paper,
  Button,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Grid,
} from '@material-ui/core';

import useStyles from '../utils/styles';
import * as actions from '../actions';

function createData(
  definedInAssemblyIdentity,
  memberDocID,
  recommendedChanges,
  sourceCompatibleChanges
) {
  return {
    definedInAssemblyIdentity,
    memberDocID,
    recommendedChanges,
    sourceCompatibleChanges,
  };
}

const getMissingAssemblyRows = missingAssemblies => {
  return missingAssemblies.map(assembly => {
    return createData(
      assembly.DefinedInAssemblyIdentity,
      assembly.MemberDocId,
      assembly.RecommendedChanges,
      assembly.SourceCompatibleChanges
    );
  });
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const generateList = (unresolvedAssemblies, margin = 0) => {
  return unresolvedAssemblies.map(ua => {
    return (
      <>
        <ListItem key={ua}>
          <ListItemAvatar>
            <Avatar>
              {margin ? (
                <DLLIcon color="secondary" />
              ) : (
                <SubProject color="secondary" />
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={ua} />
        </ListItem>
        <Divider style={{ marginTop: margin, marginBottom: margin }} />
      </>
    );
  });
};

const Report = ({ projectPath, generateReport, jsonReport, clearStore }) => {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const projectName = projectPath?.split('\\').pop();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const missingAssemblyRows =
    (jsonReport && getMissingAssemblyRows(jsonReport.MissingDependencies)) ||
    [];

  const subProjects = jsonReport?.SubProjects?.map(el => el.slice(0, -8));

  return jsonReport ? (
    <>
      <Button component={Link} to="/" color="secondary" onClick={clearStore}>
        Go Back &larr;
      </Button>
      <Button
        component={Link}
        to="/report/html"
        color="secondary"
        style={{ float: 'right' }}
        onClick={() => generateReport(projectPath, 'html')}
      >
        View Detailed Report
      </Button>
      <Paper className={classes.reportContainer} variant="outlined">
        <AppBar position="static" style={{ maxHeight: 43 }} color="secondary">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Project Info" {...a11yProps(0)} />
            <Tab label="Missing Dependencies" {...a11yProps(1)} />
            <Tab label="Unresolved Assemblies" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <div
          style={{
            minHeight: '60%',
            maxHeight: '70%',
            width: '100%',
            overflowY: 'scroll',
            marginTop: '-150px',
          }}
        >
          <TabPanel value={value} index={0}>
            <Paper
              style={{ padding: 20, width: '80vw' }}
              elevation={0}
              variant="outlined"
            >
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body1" gutter>
                    <span style={{ color: '#eb4d4b' }}>Submission Id: </span>{' '}
                    {jsonReport?.SubmissionId}
                  </Typography>
                  <Divider style={{ margin: '10px 10px' }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutter>
                    <span style={{ color: '#eb4d4b' }}>Application Name: </span>
                    {jsonReport?.ApplicationName || projectName}
                  </Typography>
                  <Divider style={{ margin: '10px 10px' }} />
                </Grid>
                {jsonReport?.SubProjects ? (
                  <Grid item xs={12}>
                    <Typography variant="body1" gutter>
                      <span style={{ color: '#eb4d4b' }}>Sub Projects</span>
                      <List>
                        {jsonReport ? generateList(subProjects) : null}
                      </List>
                    </Typography>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Typography variant="body1" gutter>
                    <span style={{ color: '#eb4d4b' }}>Last Updated: </span>
                    {jsonReport?.CatalogLastUpdated}
                  </Typography>
                  <Divider style={{ margin: '10px 10px' }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutter>
                    <span style={{ color: '#eb4d4b' }}>
                      Total Missing Dependencies:{' '}
                    </span>
                    {jsonReport?.MissingDependencies.length}
                  </Typography>
                  <Divider style={{ margin: '10px 10px' }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutter>
                    <span style={{ color: '#eb4d4b' }}>
                      Total Unresolved Assemblies:{' '}
                    </span>
                    {jsonReport?.UnresolvedUserAssemblies.length}
                  </Typography>
                  <Divider style={{ margin: '10px 10px' }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutter>
                    <span style={{ color: '#eb4d4b' }}>Target Platforms </span>
                    <br />
                    {jsonReport?.Targets[0]}
                    <br />
                    {jsonReport?.Targets[1]}
                    <br />
                    {jsonReport?.Targets[2]}
                  </Typography>
                  <Divider style={{ margin: '10px 10px' }} />
                </Grid>
              </Grid>
            </Paper>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead style={{ backgroundColor: '#3a9ce8' }}>
                  <TableRow>
                    <TableCell style={{ color: '#fff' }}>
                      Assembly Name
                    </TableCell>
                    <TableCell style={{ color: '#fff' }} align="right">
                      Member
                    </TableCell>
                    <TableCell style={{ color: '#fff' }} align="right">
                      Recommended Changes
                    </TableCell>
                    <TableCell align="right" style={{ color: '#fff' }}>
                      Source Compatible Changes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {missingAssemblyRows.map(row => (
                    <TableRow key={row.definedInAssemblyIdentity}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ wordBreak: 'break-word', textAlign: 'left' }}
                      >
                        {row.definedInAssemblyIdentity}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          maxWidth: 100,
                          wordBreak: 'break-word',
                          textAlign: 'left',
                        }}
                      >
                        {row.memberDocID}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          maxWidth: 100,
                          wordBreak: 'break-word',
                          textAlign: 'left',
                        }}
                      >
                        {row.recommendedChanges}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          maxWidth: 100,
                          wordBreak: 'break-word',
                          textAlign: 'left',
                        }}
                      >
                        {row.sourceCompatibleChanges}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <List>
              {jsonReport
                ? generateList(jsonReport.UnresolvedUserAssemblies, 20)
                : null}
            </List>
          </TabPanel>
        </div>
      </Paper>
    </>
  ) : (
    <Paper className="loader">
      <Typography color="secondary" variant="h5" style={{ display: 'block' }}>
        Analyzing
      </Typography>
      <br />
      <div className="lds-facebook">
        <div />
        <div />
        <div />
      </div>
    </Paper>
  );
};

const mapStateToProps = state => {
  if (!state.app) return null;

  const {
    app: { projectPath, jsonReport },
  } = state;
  return {
    projectPath,
    jsonReport,
  };
};

export default connect(mapStateToProps, actions)(Report);
