import { AppBar, TableCell, TableRow, makeStyles, withStyles } from '@material-ui/core';
import React, { useState } from 'react';
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
  const [openn, setOpenn] = React.useState(true);
  let [leveldata, setLeveldata] = useState({
    Level0: 0,
    Level1: 0,
    Level2: 0,
    Level3: 0
  });
  let rows = [];
  function createData(username, avatar, prnums, score, prlinks, Level0, Level1, Level2, Level3) {
    return {username, avatar, prnums, score, prlinks, Level0, Level1, Level2, Level3 };
  }

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
      
    </div>
  )
}