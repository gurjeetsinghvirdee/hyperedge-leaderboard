import React, { useState, useEffect, useCallback } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SkeletonCircle, SkeletonText, Spinner } from '@chakra-ui/react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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

function useWindowDimensions() {
    const hasWindow = typeof window !== "undefined";

    var getWindowDimensions = useCallback(() => {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height
        };
    }, [hasWindow]);

    const [windowDimesnions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        if (hasWindow) {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize)
        }
    }, [getWindowDimensions, hasWindow]);

    return windowDimesnions;
}


function Leaderboard() {
    const classes = useStyles();
    let [totalData, setTotalData] = useState([]);
    let [leaderss, setLeaderss] = useState([]);
    let [searchData, setSearchData] = useState([]);
    let [links, setLinks] = useState("");
    let [login, setLogin] = useState("");
    let [score, setScore] = useState("");
    let [avatar, setAvatar] = useState("");
    let [isLoading, setIsLoading] = useState("");
    let [isLboardLoading, setIsLboardLoading] = useState("");
    let [loadingMsg, setLoadingMsg] = useState("Request sended to the server");
    let [filter, setFilter] = useState("");
    let [showConfetti, setShowConfetti] = useState("");
    let [lastupdated, setLastupdated] = useState("");
    const [openn, setOpenn] = React.useState(true);
    const [activePage, setActivePage] = useState(1);
    const { height, width } = useWindowDimensions();
    let rows = [];
    function createData(username, avatar, prnums, score, prlinks, level0, level1, level2, level3, level4) {
        return { username, avatar, prnums, score, prlinks, level0, level1, level2, level3, level4 };
    }
    useEffect(() => {
        fetch("https://hyperedgesoc23-backend-production.up.railway.app/Leaderboard").then(res => res.json()).then(data => {
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

    const filterData = () => {
        setIsLboardLoading(true);
        if (filter === "" && leaderss.length !== totalData.length) {
          setSearchData(totalData);
          setActivePage(1);
          setIsLboardLoading(false);
        } else {
          const filtered = totalData.filter((leader) =>
            leader.login.toLowerCase().includes(filter.toLowerCase())
          );
          setSearchData(filtered);
          setActivePage(1);
          setIsLboardLoading(false);
        }
      };

    const handleClose = () => {
        prlinks = []
        setOpen(false);
    };
    // return (
    //     <>
    //         <div>
    //           <AppBar position='static' className={classes.appbar}>
    //             <a href="https://hyperedge.so/wob">
    //                 <img src="https://hyperedge.so/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75" style={{ width: 100, height: "auto", marginTop: 5, marginRight: 30}} />
    //             </a>
    //             <h2>HyperEdge Winter of BlockChain Leaderboard </h2>
    //           </AppBar>
    //           <Confetti 
    //             width={window.innerWidth}
    //             height={window.innerHeight}
    //             numberOfPieces={60}
    //           />
    //             <Backdrop className={classes.backdrop} open={openn}>
    //                 <CircularProgress color="inherit" />
    //             </Backdrop>
    //             <div style={{}} className={classes.mainroot}>
    //                 <div style={{ marginBottom: 40, marginTop: 60, alignItems: "center", display: "flex", justifyContent: "space-between" }} className={classes.leaders}>

    //                     <div>
    //                         <img src={rows[1] !== undefined ? rows[1].avatar : null} className={classes.leaderimg} />
    //                         <h3>2. {rows[1] !== undefined ? rows[1].username[0] : null}</h3>

    //                     </div>
    //                     <div style={{ textAlign: "center" }}>
    //                         <img src={rows[1] !== undefined ? rows[0].avatar : null} className={classes.leaderimgbig} />
    //                         <h3>1. {rows[1] !== undefined ? rows[0].username[0] : null}</h3>
    //                     </div>
    //                     <div>
    //                         <img src={rows[1] !== undefined ? rows[2].avatar : null} className={classes.leaderimg} />
    //                         <h3>3. {rows[1] !== undefined ? rows[2].username[0] : null}</h3>
    //                     </div>

    //                 </div>

    //                 <div style={{ backgroundColor: "#E5F6FD", padding: 5, borderRadius: 5 }}>
    //                     <p style={{ color: "#024361", fontSize: 15 }}>The leaderboard was last updated on: <b>{lastupdated}</b></p>
    //                 </div>

    //                 <Paper>
    //                     <TableContainer component={Paper}>
    //                         <Table className={classes.table} aria-label="simple table">
    //                             <TableHead>
    //                                 <StyledTableRow>
    //                                     {columns.map((column) => (
    //                                         <StyledTableCell
    //                                             key={column.id}
    //                                             align={column.align}
    //                                             style={{ minWidth: column.minWidth }}
    //                                         >
    //                                             {column.label}
    //                                         </StyledTableCell>
    //                                     ))}
    //                                 </StyledTableRow>
    //                             </TableHead>
    //                             <TableBody>
    //                                 {rows.map((row) => {
    //                                     return (
    //                                         // style = {{ display: rows.indexOf(row) === 0 || rows.indexOf(row) === 1 || rows.indexOf(row) === 2 ? "none" : null }
    //                                         <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.username}  >
    //                                             {columns.map((column) => {
    //                                                 const value = row[column.id];
    //                                                 return (
    //                                                     <StyledTableCell key={column.id} align={column.align} onClick={() => { handleClickOpen(rows.indexOf(row)); }}>
    //                                                         {column.id === 'avatar' ? <Avatar alt="Remy Sharp" src={value} /> : column.id === 'position' ? rows.indexOf(row) + 1 : column.id === 'username' ? <div style={{ display: "flex", alignItems: "center" }}><GitHubIcon style={{ marginRight: 20 }} /><a href={value[1]} style={{ textDecoration: "none", color: "black" }}>{value[0]}</a></div> : value}

    //                                                     </StyledTableCell>
    //                                                 );

    //                                             })}
    //                                         </StyledTableRow>
    //                                     );
    //                                 })}
    //                             </TableBody>
    //                         </Table>
    //                     </TableContainer>
    //                 </Paper>
    //                 <Dialog
    //                     open={open}
    //                     onClose={handleClose}
    //                     aria-labelledby="alert-dialog-slide-title"
    //                     aria-describedby="alert-dialog-slide-description"
    //                 >
    //                     <DialogTitle id="alert-dialog-slide-title">{login + "'s Stats"}</DialogTitle>
    //                     <DialogContent>
    //                         <DialogContentText id="alert-dialog-slide-description">
    //                             <div style={{ display: "flex", alignItems: "center" }}>
    //                                 <img alt="Remy Sharp" src={avatar} className={classes.leaderimg} />
    //                                 <p className={classes.levelbadge} style={{ backgroundColor: "#ebfaeb", marginLeft: 20, fontSize: 25 }}>🏆 {score}</p>
    //                             </div>
    //                             <p style={{ "marginTop": 30 }}>List Of PRs: </p>
    //                             {links}
    //                         </DialogContentText>
    //                     </DialogContent>
    //                     <DialogActions>
    //                         <button onClick={handleClose} color="primary" style={{ background: "#FA6329", border: "none", padding: 15, color: "white", borderRadius: 5, cursor: "pointer", marginRight: 10 }}>
    //                             Close
    //                         </button>
    //                     </DialogActions>
    //                 </Dialog>
    //             </div>
    //         </div >
    //     </>
    // );

    return (
        <>
          <header position='static' className={classes.header}>
            <a href="https://hyperedge.so/wob">
                <img src="https://hyperedge.so/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75" style={{ width: 100, height: "auto", marginLeft: 570, marginTop: 20 }} />
            </a>
          </header>
          {isLoading && (
            <div className='loader-div'>
                <div className='overlay dark:bg-darkmode_gray-0'></div>
                <div className='loader-group-container'>
                    <div className='loader-group dark:bg-black'>
                        <Spinner
                            className='loader'
                            thickness='6px'
                            speed='0.7s'
                            emptyColor='gray.200'
                            color='red.400'
                            size="xl"
                        />
                        <span className='loading-msg dark:text-white'>{loadingMsg}</span>
                    </div>
                </div>
            </div>
          )}
          {showConfetti && <Confetti className='fullscreen' />}
          <div
            className='container transition:colors mt-12 mb-0 md:mb-12 p-8 sm:px-10 md:px-10 lg:px-20 2xl:px-32 dark:bg-darkmode_gray-0 dark:transition-colors'
            style={{ margin: "auto" }}
          >
            <div className='items-center justify-center'>
                <div className='font-sans text-center text-2x1 font-extrabold'>
                    <div className='text-black dark:text-white text-4xl text center font-extrabold mb-10 underline underline-offset-4 decoration-primary_red-1'>
                        <span className='text-primary_red-0' style={{ display: "block" }}> HyperEdge WOB 2023 Leaderboard</span>
                        Top Performers
                    </div>
                </div>
            </div>
            <div>
                <div className='py-5 px-0 xl:pb-12 xl:px-24 xl:pt-0 text-center'>
                    <div className='flex md:flex-row justify-between gap-y-1 gap-x-1 md:gap-x-2 items-center my-10'>
                        <div className='bg-white shadow-2xl dark:bg-black rounded-md px-0 sm:px-3 py-2 md:px-16 lg:py-4 relative inline-block w-28 md:w-auto'>
                            {totalData[1] === undefined && (
                                <>
                                    <SkeletonCircle className='skeleton-circle-md' />
                                    <SkeletonText mt="4" noOfLines={1} spacing="4" />
                                </>
                            )}
                            {totalData[1] !== undefined && (
                                <>
                                    <img alt='avatar img'
                                        className='w-12 md:w-16 lg:w-24 rounded-full m-auto inline-block object-cover bg-white'
                                        src={
                                            totalData[1] !== undefined
                                                ? totalData[1].avatar_url
                                                : null
                                        }
                                    />
                                    <FontAwesomeIcon
                                        className="invisible lg:visible w-8 h-8 rounded-full bottom-5 border-white absolute bottom-1/4 right-1/4 bg-red-300 inline-block"
                                        icon={faGithub}
                                        size='2x'
                                    />
                                    <h3 className='text-black dark:text-primary_red-0 font-semibold mt-2 text-xs sm:text-sm md:text-md'>
                                        2.{" "}
                                        {totalData[2] !== undefined ? totalData[2].login : null}
                                    </h3>
                                </>
                            )}
                        </div>
                        <div className='bg-white shadow-2xl dark:bg-black rounded-md px-0 sm:px-3 py-2 md:px-16 lg:py-4  relative inline-block w-28 md:w-auto'>
                            {totalData[0] === undefined && (
                                <>
                                    <SkeletonCircle className='skeleton-circle-lg' />
                                    <SkeletonText mt="4" noOfLines={1} spacing="4" />
                                </>
                            )}
                            {totalData[0] === undefined && (
                                <>
                                    <img alt='avatar'
                                        className='w-12 md:w-16 lg:w-40 rounded-full m-auto bg-white'
                                        src={
                                            totalData[0] !== undefined
                                                ? totalData[0].avatar_url
                                                : null
                                        }
                                    />
                                    <FontAwesomeIcon 
                                        className='invisible lg:visible w-10 h-10 rounded-full border-5 border-white absolute bottom-1/4 right-1/4 bg-cyan-200 inline-block'
                                        icon={faGithub}
                                        size='3x'
                                    />
                                    <h3 className='text-black dark:text-primary_orange-0 font-semibold mt-4 text-xs sm:text-sm md:text-md'>
                                        1.{" "}
                                        {totalData[0] !== undefined ? totalData[0].login : null}
                                    </h3>
                                </>
                            )}
                        </div>

                        <div className="bg-white shadow-2xl dark:bg-black rounded-md px-0 sm:px-3 py-2 md:px-16 lg:py-4 relative inline-block w-28 md:w-auto">
                            {totalData[2] === undefined && (
                                <>
                                    <SkeletonCircle className="skeleton-circle-md" />
                                    <SkeletonText mt="4" noOfLines={1} spacing="4" />
                                </>
                        )}
                            {totalData[2] !== undefined && (
                                <>
                                    <img alt='avatar'
                                    className="w-12 md:w-16 lg:w-24 rounded-full m-auto bg-white"
                                    src={
                                        totalData[2] !== undefined
                                        ? totalData[2].avatar_url
                                        : null
                                    }
                                />
                                <FontAwesomeIcon
                                className="invisible lg:visible w-8 h-8 rounded-full border-5 border-white absolute bottom-1/4 right-1/4 bg-zinc-100 inline-block"
                                icon={faGithub}
                                size="2x"
                                />
                                <h3 className="text-black dark:text-primary_orange-0 font-semibold mt-2 text-xs sm:text-sm md:text-md">
                                    3.{" "}
                                    {totalData[2] !== undefined? totalData[2].login : null}
                                </h3>
                            </>
                            )}
                        </div>
                    </div>

                    <div className='mt-20'>
                        <div className='flex justify-end'>
                            <div className='mb-3 xl:w-96'>
                                <div className='input-group relative flex flex-wrap items-stretch w-full mb-4 justify-end'>
                                    <div className='relative flex search-container'>
                                        <input
                                            onChange={(e) => {
                                                setFilter(e.target.value);
                                            }}
                                            type='search'
                                            className='form-control relative flex flex-auto min-w-0 block px-3 py-1.5 text-base dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-gray-400 focus:outline-none dark:placeholder-neutral-300'
                                            placeholder='Search'
                                            aria-label='Search'
                                            aria-describedby='button-addon2'
                                            onKeyUp={(e) => {
                                                e.key = "Enter" ? filterData() : "";  // have to fix this error
                                            }}
                                         />
                                         <span className='search-count dark:text-neutral-300'>
                                            {searchData.length}
                                         </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            filterData();
                                        }}
                                        className='btn inline-block px-6 py-2.5 bg-gray-300 dark:bg-neutral-600 text-gray-600 font-medium text-xs leading-tight uppercase hover:text-gray-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out flex items-center'
                                        type='button'
                                        id='button-addon2'
                                        style={{
                                            padding: "10px 18px",
                                            maxWidth: "50px",
                                            width: "20%",
                                        }}
                                    >
                                        <svg className='w-4 fill-neutral-600 hover:fill-neutral-800 dark:fill-neutral-300 dark:hover:fill-neutral-100'
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="search"
                                            role='img'
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 512 512'                                        
                                        >
                                            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </>
    )
}

export default Leaderboard;