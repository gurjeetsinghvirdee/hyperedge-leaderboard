import { AppBar, Avatar, Backdrop, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles, withStyles } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const columns = [
  { id: 'position', label: 'Position', minWidth: 50 },
  { id: 'avatar', label: 'Avatar', minWidth: 100 },
  { id: 'username', label: 'Username', minWidth: 170 },

  {
    id: 'prnums',
    label: 'No. of PRs',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'score',
    label: 'Score',
    minWidth: 170,
    align: 'right'
  }
];

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    cursor: 'pointer',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow)

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
    appbar: {
      padding: 25,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "black"
    },
    leaderimg: {
      width: 150,
      borderRadius: 1000,
      [theme.breakpoints.down(1200)]: {
        width: 50,
      }
    },
    leaderimgbig: {
      width: 150,
      borderRadius: 1000,
      [theme.breakpoints.down(1200)]: {
        width: 90,
      }
    },
    popover: {
      pointerEvents: 'none',
    },
    levelbadge: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#f5f5f5',
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 'bold',
    },
    leaders: {
      [theme.breakpoints.down(1200)]: {
        padding: "0px 50px",
        fontSize: "12px"
      },
      [theme.breakpoints.down(700)]: {
        padding: "0px 0px",
      }
    },
    mainroot: {
      paddingLeft: 100, paddingRight: 100, paddingTop: 50, paddingBottom: 50, textAlign: "center",
      [theme.breakpoints.down(1200)]: {
        padding: 20
      }
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }
});

export default function BasicTable() {
  const classes = useStyles();
  let [leaderss, setLeaderss] = useState({});
  let [links, setLinks] = useState("");
  let [login, setLogin] = useState("");
  let [score, setScore] = useState("");
  let [avatar, setAvatar] = useState("");
  let [lastupdated, setLastupdated] = useState("");
  const [openn, setOpenn] = React.useState(true);
  let [leveldata, setLeveldata] = useState({
    level0: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0
  });
  let rows = [];
  function createData(username, avatar, prnums, score, prlinks, level0, level1, level2, level3, level4) {
    return {username, avatar, prnums, score, prlinks, level0, level1, level2, level3, level4 };
  }

  useEffect(() => {
    fetch("https://hyperedgesoc23-backend.vercel.app/").then(res => res.json()).then(data => {
      data.leaderboard.sort(function (a, b) {
        return b.score - a.score || b.level4 - a.level4 || b.level3 - a.level3 || b.level2 - a.level2 || b.level1 - a.level1 || b.level0 - a.level0 || a.login < b.login 
      });

      setLeaderss(data.leaderboard);
      setOpenn(false);

      setLastupdated(data.updatedTimeString);
    })
  }, []);

  for (let leader in leaderss) {
    rows.push(createData([leaderss[leader].login, leaderss[leader].url], leaderss[leader].pr_urls.filter((item, i, ar) => ar.indexOf(item) === i).length, leaderss[leader].score, leaderss[leader].profile_url, leaderss[leader].pr_urls, leaderss[leader].Level0, leaderss[leader].Level1, leaderss[leader].Level2, leaderss[leader].Level3))
  }

  const [open, setOpen] = React.useState(false);
  let prlinks = []
  let handleClickOpen = (num) => {
    setOpen(true);
    for (let link in leaderss[num].pr_urls) {
      prlinks.push(leaderss[num].pr_urls[link] + "\n\n\n\n");
    }
    let unique = prlinks.filter((item, i, ar) => ar.indexOf(item) === i);
    setLinks(unique)
    setLeveldata({
      Level0: leaderss[num].Level0,
      Level1: leaderss[num].Level1,
      Level2: leaderss[num].Level2,
      Level3: leaderss[num].Level3,
    });
    setAvatar(leaderss[num].login);
    setAvatar(leaderss[num].avatar_url);
    setScore(leaderss[num].score);
  };

  const handleClose = () => {
    prlinks = []
    setOpen(false);
  };
  return (
    <div>
      <AppBar position='static' className={classes.appbar}>
        <img src="https://hyperedge.so/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75" style={{ width: 100, height: "auto", marginTop: 5, marginRight: 30}} />
        <h2>HyperEdge Winter of BlockChain Leaderboard </h2>
      </AppBar>
      <Confetti 
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={60}
      />
      <Backdrop className={classes.backdrop} open={openn}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{}} className={classes.mainroot}>
        <div style={{ marginBottom: 40, marginTop: 60, alignItems: "center", display: "flex", justifyContent: "space-between" }} className={classes.leaders}>

          <div>
            <img src={rows[1] !== undefined ? rows[1].avatar : null} className={classes.leaderimg} />
            <h3>2. {rows[1] !== undefined ? rows[1].username[0] : null}</h3>
          </div>

          <div style={{ textAlign: "center" }}>
            <img src={rows[1] !== undefined ? rows[0].avatar : null} className={classes.leaderimgbig} />
            <h3>1. {rows[1] !== undefined ? rows[0].username[0] : null}</h3>
          </div>

          <div>
            <img src={rows[1] !== undefined ? rows[2].avatar : null} className={classes.leaderimg} />
            <h3>3. {rows[1] !== undefined ? rows[2].username[0] : null}</h3>
          </div>

        </div>

        <div style={{ backgroundColor: "#E5F6FD", padding: 5, borderRadius: 5 }}>
          <p style={{ color: "#024361", fontSize: 15 }}>The leaderboard was updated on: </p>
        </div>

        <Paper>
          {/* <SearchBar 
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => onCancelSearch()}
          /> */}
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.username} >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align} onClick={() => {handleClickOpen(rows.indexOf(row)); }}>
                            {column.id === 'avatar' ? <Avatar alt='' src={value} >T</Avatar> : column.id === 'position' ? rows.indexOf(row) + 1 : column.id === 'username' ? <div style={{ display: "flex", alignItems: "center" }}><GitHubIcon style={{ marginRight: 20 }} /><a href={value[1]} style={{ textDecoration: "none", color: "black" }}>{value[0]}</a></div> : value}
                          </StyledTableCell>
                        );
                      })}

                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-lablelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{login + "'s Stats"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div style={{ display: "flex", alignItems: "center" }}>
                <img alt="Remy Sharp" src={avatar} className={classes.leaderimg} />
                <p className={classes.levelbadge} style={{ backgroundColor: "#ebfaeb", marginLeft: 20, fontSize: 25 }}>🏆 {score}</p>
              </div>

            </DialogContentText>
          </DialogContent>

        </Dialog>
      </div>
    </div>
  )
}