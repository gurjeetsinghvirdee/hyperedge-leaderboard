import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar  from '@material-ui/core/AppBar'; 
import Confetti from 'react-confetti';

const columns = [
    { id: 'position', label: 'Position', minWidth: 50, align: 'center' },
    { id: 'avatar', label: 'Avatar', minWidth: 100 },
    { id: 'username', label: 'Username', minWidth: 170 },

    {
        id: 'prnums',
        label: 'No. Of PRs',
        minWidth: 170,
        align: 'center'
    },
    {
        id: 'score',
        label: 'Score',
        minWidth: 170,
        align: 'center'
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
}))(TableRow);

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
            width: 100,
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
            paddingLeft: 100, paddingRight: 100, paddingTop: 0, paddingBottom: 50, textAlign: "center",
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

function Leaderboard() {
    const classes = useStyles();
    let [leaderss, setLeaderss] = useState({});
    let [links, setLinks] = useState("");
    let [login, setLogin] = useState("");
    let [score, setScore] = useState("");
    let [avatar, setAvatar] = useState("");
    let [lastupdated, setLastupdated] = useState("");
    const [openn, setOpenn] = React.useState(true);
    let rows = [];
    function createData(username, avatar, prnums, score, prlinks, level0, level1, level2, level3, level4) {
        return { username, avatar, prnums, score, prlinks, level0, level1, level2, level3, level4 };
    }
    useEffect(() => {
        fetch("https://localhost:8000/Leaderboard").then(res => res.json()).then(data => {
            data.leaderboard.sort(function (a, b) { return b.score - a.score || b.level4 - a.level4 || b.level3 - a.level3 || b.level2 - a.level2 || b.level1 - a.level1 || b.level0 - a.level0 || a.login < b.login });
            setLeaderss(data.leaderboard);
            setOpenn(false);
            setLastupdated(data.updatedTimestring);
        });
    }, []);

    for (let leader in leaderss) {
        rows.push(createData([leaderss[leader].login, leaderss[leader].url], leaderss[leader].avatar_url, leaderss[leader].pr_urls.filter((item, i, ar) => ar.indexOf(item) === i).length, leaderss[leader].score, leaderss[leader].profile_url, leaderss[leader].pr_urls, leaderss[leader].level0, leaderss[leader].level1, leaderss[leader].level2, leaderss[leader].level3, leaderss[leader].level4))
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
        setLogin(leaderss[num].login);
        setAvatar(leaderss[num].avatar_url);
        setScore(leaderss[num].score);
    };

    const handleClose = () => {
        prlinks = []
        setOpen(false);
    };
    return (
        <>
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
                        <p style={{ color: "#024361", fontSize: 15 }}>The leaderboard was last updated on: <b>{lastupdated}</b></p>
                    </div>

                    <Paper>
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
                                            // style = {{ display: rows.indexOf(row) === 0 || rows.indexOf(row) === 1 || rows.indexOf(row) === 2 ? "none" : null }
                                            <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.username}  >
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align} onClick={() => { handleClickOpen(rows.indexOf(row)); }}>
                                                            {column.id === 'avatar' ? <Avatar alt="Remy Sharp" src={value} /> : column.id === 'position' ? rows.indexOf(row) + 1 : column.id === 'username' ? <div style={{ display: "flex", alignItems: "center" }}><GitHubIcon style={{ marginRight: 20 }} /><a href={value[1]} style={{ textDecoration: "none", color: "black" }}>{value[0]}</a></div> : value}

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
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{login + "'s Stats"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img alt="Remy Sharp" src={avatar} className={classes.leaderimg} />
                                    <p className={classes.levelbadge} style={{ backgroundColor: "#ebfaeb", marginLeft: 20, fontSize: 25 }}>🏆 {score}</p>
                                </div>
                                <p style={{ "marginTop": 30 }}>List Of PRs: </p>
                                {links}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <button onClick={handleClose} color="primary" style={{ background: "#FA6329", border: "none", padding: 15, color: "white", borderRadius: 5, cursor: "pointer", marginRight: 10 }}>
                                Close
                            </button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div >
        </>
    );
}

export default Leaderboard;