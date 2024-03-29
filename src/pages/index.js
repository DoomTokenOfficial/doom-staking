import React, { useEffect, useState, useContext } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import useMediaQuery from "@mui/material/useMediaQuery";

import Web3 from "web3";

import ShoresHell from "../assets/img/strife-small-the-shores-of-hell.png";
import Inferno from "../assets/img/strife-small-inferno.png";

import useStyles from "../assets/constants/styles";
import { Vaults, TotalPoolNum } from "../config/app";
import axios from "axios";

import Pool from "./Pool";
import { baseCurrency, CurrencySymbol, setInit, toDec } from "../config/config";
import { ThemeModeContext } from "../context/themmode";
import { lang_texts, Filters } from "../assets/constants/language";
import ChartBox from "./chart";

const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rpc.testnet.fantom.network/")
);
let countable = 0;

const Home = () => {
    const styles = useStyles();
    const { currency, language } = useContext(ThemeModeContext);

    const tablet = useMediaQuery("(min-width:1200px)");
    const mobile = useMediaQuery("(min-width:800px)");

    const [cy, setCy] = React.useState(null);
    const [lg, setLG] = React.useState(null);
    const [APS, setAPS] = useState({});
    const [filter, setFilter] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const [totalSpy, setTotalSpy] = useState(setInit(Vaults));
    const [expanded, setExpanded] = useState({});
    const [CoinInfo, setCoinInfo] = useState([]);
    const [TimeBlog, setTimeBlog] = useState({});
    const [totalUser, setTotalUser] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    const [chartInfo, setChartInfo] = useState([]);
    const [userStaked, setUserStaked] = useState({});
    const [coinStatus, setCoinStatus] = useState({});
    const [totalSupply, setTotalSupply] = useState({});
    const [stakedFilter, setStakedFilter] = useState(false);
    const [currentFilter, setCurrentFilter] = React.useState("");

    const filtermenu = Boolean(filter);
    let response = null;
    const _handleCloseFilter = (e, s) => {
        if (s === true) {
            setCurrentFilter(e);
        }
        setFilter(null);
    };

    const _Expand = (id) => {
        setExpanded((prev) => {
            let tp = prev[id];
            for (const key in prev) {
                prev[key] = false;
            }
            prev[id] = tp === true ? false : true;
            return { ...prev };
        });
    };

    const _handleExpaned = (id, e, i) => {
        return _Expand(id);
        // console.log(id, e, i, "232323232323232");
        // let initialTop = !mobile ? 40 : 110;
        // if (!e) {
        //     _Expand(id);
        // } else if (e.target.tagName === "svg" || e.target.tagName === "path") {
        //     if (
        //         e.target.parentElement.tagName === "BUTTON" ||
        //         e.target.parentElement.parentElement.tagName === "BUTTON"
        //     ) {
        //         _Expand(id);
        //         if (!expanded[id]) {
        //             window.scrollTo(0, initialTop + 105 * (i + 1));
        //         }
        //     } else {
        //         return;
        //     }
        // } else {
        //     if (!expanded[id]) {
        //         window.scrollTo(0, initialTop + 105 * (i + 1));
        //     }
        //     _Expand(id);
        // }
    };

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const GetPoolStatus = async () => {
        let total_U = 0;

        for (let i = 0; i < Vaults.length; i++) {
            if (Vaults[i].vault) {
                // const Pool = new web3.eth.Contract(
                //     Vaults[i].vault.abi,
                //     Vaults[i].vault.address
                // );
                let t_u = 100;
                total_U += Number(t_u);
            }
        }

        setTotalUser(total_U);
    };

    const updateStakedState = (id, balance, rewardB) => {
        setUserStaked((prev) => {
            return { ...prev, [id]: Number(balance) > 0 ? balance : rewardB };
        });
    };

    const updateEndTime = (id, t) => {
        setTimeBlog((prev) => {
            return { ...prev, [id]: t };
        });
    };

    const updateAPRs = (id, apr) => {
        setAPS((prev) => {
            return { ...prev, [id]: apr };
        });
    };

    const UpdatingTotalSupply = (id, Tval, coinId, i, s, coins = []) => {
        console.log(
            id,
            Tval,
            coinId,
            i,
            s,
            coins,
            "id, Tval, coinId, i, s, coins"
        );
        let total_S = 0;
        if (!s) {
            countable++;
            setTotalSupply((prev) => {
                return { ...prev, [id]: Tval };
            });
        }
        const coin = coins.find((item) => item.tokenSymbol === coinId);

        if (coin) {
            total_S = coin.usdPrice * Tval;
        } else {
            total_S = baseCurrency[Vaults[i].tokenId[0]][currency] * Tval;
        }

        setTotalSpy((prev) => {
            prev[i] = total_S;
            return [...prev];
        });

        if (countable === Vaults.length - 1) {
            setLoading(true);
        }
    };

    const GetCoinInfo = async () => {
        response = await axios
            .get(
                "https://deep-index.moralis.io/api/v2/erc20/0xa594f09ad2f031a286eae64c5ab3ce05191668ae/price?chain=eth&include=percent_change&exchange=uniswapv3",
                {
                    headers: {
                        accept: "application/json",
                        "X-API-Key":
                            "6yQovJ4FlVFcu4o6rSmnPbCsIXgpM62X9vY8xHFfB3I1d2xKmwBTCs9hM9ky3hSp",
                    },
                }
            )
            .then((res) => {
                const data = res.data;
                console.log(data, "123123123123123");
                for (let i = 0; i < Vaults.length; i++) {
                    if (Object.hasOwnProperty.call(totalSupply, Vaults[i].id)) {
                        UpdatingTotalSupply(
                            Vaults[i].id,
                            totalSupply[Vaults[i].id],
                            Vaults[i].chart.id[1],
                            i,
                            true,
                            [data]
                        );
                    }
                }
                setCoinInfo([data]);
                console.log(data, "23423423");
                // let CFLTINFO = data.find((item) => item.id === "CFLT");
                // let priceptc = (
                //     CFLTINFO["1d"]
                //         ? CFLTINFO["1d"].price_change_pct * 100
                //         : CFLTINFO["7d"]
                //         ? CFLTINFO["7d"].price_change_pct * 100
                //         : 0
                // ).toFixed(2);
                // let status = "";
                // if (priceptc >= 1) {
                //     status = "text-green";
                //     priceptc = `+${priceptc}`;
                // }
                // if (priceptc > 0 && priceptc < 1) {
                //     status = "text-purple";
                //     priceptc = `+${priceptc}`;
                // }
                // if (priceptc <= -1) {
                //     status = "text-red";
                // }
                // if (priceptc > -1 && priceptc < 0) {
                //     status = "text-pink";
                // }
                setCoinStatus({
                    price: data.usdPrice,
                    status: "text-pink",
                });
                // setCoinStatus({
                //     price: Number(CFLTINFO.price).toFixed(6),
                //     priceptc,
                //     status,
                // });
            })
            .catch((err) => {
                console.log(err);
                // for (let i = 0; i < Vaults.length; i++) {
                //     if (Object.hasOwnProperty.call(totalSupply, Vaults[i].id)) {
                //         UpdatingTotalSupply(
                //             Vaults[i].id,
                //             totalSupply[Vaults[i].id],
                //             Vaults[i].chart.id[1],
                //             i,
                //             true
                //         );
                //     }
                // }
            });
    };

    useEffect(() => {
        setCoinInfo([]);
        GetCoinInfo();
    }, [currency]);

    useEffect(() => {
        GetCoinInfo();
        GetPoolStatus();
        return () => {
            if (response && response !== null) {
                response.cancel();
            }
        };
    }, []);

    useEffect(() => {
        setFilter(null);
        setCy(null);
        setLG(null);
    }, [tablet, mobile]);

    // useEffect(() => {
    //     if (!tablet || !mobile) {
    //         const script = document.createElement("script");
    //         script.src = "https://widget.nomics.com/embed.js";
    //         script.async = true;
    //         document.body.appendChild(script);
    //         let iframe = document.querySelector("iframe");

    //         console.log(iframe.getAttribute("src"), "-------------");
    //         if (iframe) {
    //             let url = iframe.getAttribute("src");
    //             iframe.setAttribute(
    //                 "src",
    //                 `${url.substr(0, url.length - 4) + currency}/`
    //             );
    //         }
    //     }
    // }, [expanded, tablet, currency]);

    return (
        <Box className={styles.Home}>
            {(() => {
                if (!mobile && !tablet) {
                    return (
                        <Stack
                            className={styles.mobileControlbar}
                            spacing={1}
                        ></Stack>
                    );
                } else {
                    return (
                        <Stack className={styles.laptopControlBar}>
                            <Stack className="active-btn-box"></Stack>
                            <Stack className="search-filter-box">
                                <Stack>
                                    <Stack className="search"></Stack>
                                    <Menu
                                        elevation={0}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        id="demo-customized-menu"
                                        MenuListProps={{
                                            "aria-labelledby":
                                                "demo-customized-button",
                                        }}
                                        className={styles.filter}
                                        anchorEl={filter}
                                        open={filtermenu}
                                        onClose={_handleCloseFilter}
                                    >
                                        {Filters[language].map((item, key) => (
                                            <MenuItem
                                                key={key}
                                                onClick={() =>
                                                    _handleCloseFilter(
                                                        item.id,
                                                        true
                                                    )
                                                }
                                                disableRipple
                                            >
                                                {item.text}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Stack>
                            </Stack>
                        </Stack>
                    );
                }
            })()}
            {(() => {
                if (mobile && tablet) {
                    return (
                        <Stack
                            className="state-bar"
                            direction="row"
                            spacing={4}
                        >
                            <Stack spacing={2} className="token-state">
                                <Typography
                                    className="first-box-style"
                                    variant="h6"
                                >
                                    $Doom
                                </Typography>
                                <Stack direction="row">
                                    <Stack>
                                        <Typography
                                            className="first-box-style"
                                            variant="h5"
                                            style={{
                                                color: "white !important;",
                                            }}
                                        >
                                            {CurrencySymbol[currency]}{" "}
                                            {coinStatus.price
                                                ? toDec(coinStatus.price, 0, 9)
                                                : toDec(
                                                      baseCurrency.DOOM.USD,
                                                      0,
                                                      6
                                                  )}
                                        </Typography>
                                        {/* <Typography
                                            variant="span"
                                            style={{
                                                color: "#a61919 !important",
                                            }}
                                            className={
                                                coinStatus.status
                                                    ? `first-box-style state-percent ${coinStatus.status}`
                                                    : "first-box-style state-percent"
                                            }
                                        >
                                            {coinStatus.priceptc
                                                ? coinStatus.priceptc
                                                : "0.00"}
                                            %
                                        </Typography> */}
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack spacing={2}>
                                <Typography
                                    className="first-box-style"
                                    variant="h6"
                                >
                                    {lang_texts[language][5]}
                                </Typography>
                                <Stack>
                                    <Typography
                                        variant="h5"
                                        className="first-box-style"
                                    >
                                        {TotalPoolNum}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack spacing={2}>
                                <Typography
                                    variant="h6"
                                    className="first-box-style"
                                    style={{
                                        color: "#a61919 !important",
                                    }}
                                >
                                    {lang_texts[language][6]}
                                </Typography>
                                {loading ? (
                                    <Stack>
                                        <Typography
                                            variant="h5"
                                            className="first-box-style"
                                        >
                                            {CurrencySymbol[currency]}{" "}
                                            {numberWithCommas(
                                                toDec(
                                                    totalSpy.reduce(
                                                        (a, b) => a + b,
                                                        0
                                                    ),
                                                    0,
                                                    2
                                                )
                                            )}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Skeleton height={32} animation="wave" />
                                )}
                            </Stack>
                        </Stack>
                    );
                } else if (!mobile && !tablet) {
                    return (
                        <>
                            <Stack
                                style={{
                                    display: "block !important",
                                    width: "323px",
                                }}
                                className="state-bar"
                                direction="row"
                                spacing={4}
                            >
                                <Stack spacing={2} className="token-state">
                                    <Typography
                                        className="first-box-style"
                                        variant="h6"
                                    >
                                        $Doom
                                    </Typography>
                                    <Stack direction="row">
                                        <Stack>
                                            <Typography
                                                className="first-box-style"
                                                variant="h5"
                                                style={{
                                                    color: "white !important;",
                                                }}
                                            >
                                                {CurrencySymbol[currency]}{" "}
                                                {coinStatus.price
                                                    ? coinStatus.price
                                                    : toDec(
                                                          baseCurrency.DOOM.USD,
                                                          0,
                                                          6
                                                      )}
                                            </Typography>
                                            {/* <Typography
                                            variant="span"
                                            style={{
                                                color: "#a61919 !important",
                                            }}
                                            className={
                                                coinStatus.status
                                                    ? `first-box-style state-percent ${coinStatus.status}`
                                                    : "first-box-style state-percent"
                                            }
                                        >
                                            {coinStatus.priceptc
                                                ? coinStatus.priceptc
                                                : "0.00"}
                                            %
                                        </Typography> */}
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack spacing={2} className="token-state">
                                    <Typography
                                        className="first-box-style"
                                        variant="h6"
                                    >
                                        {lang_texts[language][5]}
                                    </Typography>
                                    <Stack>
                                        <Typography
                                            variant="h5"
                                            className="first-box-style"
                                        >
                                            {TotalPoolNum}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack spacing={2} className="token-state">
                                    <Typography
                                        variant="h6"
                                        className="first-box-style"
                                        style={{
                                            color: "#a61919 !important",
                                        }}
                                    >
                                        {lang_texts[language][6]}
                                    </Typography>
                                    {loading ? (
                                        <Stack>
                                            <Typography
                                                variant="h5"
                                                className="first-box-style"
                                            >
                                                {CurrencySymbol[currency]}{" "}
                                                {numberWithCommas(
                                                    toDec(
                                                        totalSpy.reduce(
                                                            (a, b) => a + b,
                                                            0
                                                        ),
                                                        0,
                                                        2
                                                    )
                                                )}
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        <Skeleton
                                            height={32}
                                            animation="wave"
                                        />
                                    )}
                                </Stack>
                            </Stack>
                        </>
                    );
                } else {
                    return (
                        <Stack
                            className="state-bar"
                            direction="row"
                            spacing={4}
                        >
                            <Stack spacing={2} className="token-state">
                                <Typography variant="h6">$ Doom</Typography>
                                <Stack direction="row">
                                    <Stack>
                                        <Typography
                                            variant="h5"
                                            style={{
                                                color: "white !important",
                                            }}
                                        >
                                            {CurrencySymbol[currency]}{" "}
                                            {coinStatus
                                                ? coinStatus.price
                                                : toDec(
                                                      baseCurrency.CFLT.USD,
                                                      0,
                                                      6
                                                  )}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            className={
                                                coinStatus
                                                    ? `state-percent ${coinStatus.status}`
                                                    : "state-percent"
                                            }
                                        >
                                            {coinStatus
                                                ? coinStatus.priceptc
                                                : "0.00"}
                                            %
                                        </Typography>
                                    </Stack>
                                    <ChartBox
                                        AllData={chartInfo}
                                        id="CFLT"
                                        type="status"
                                        coin={coinStatus}
                                    />
                                </Stack>
                            </Stack>
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    {lang_texts[language][5]}
                                </Typography>
                                <Stack>
                                    <Typography variant="h5">
                                        {TotalPoolNum}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    {lang_texts[language][6]}
                                </Typography>
                                {loading ? (
                                    <Stack>
                                        <Typography variant="h5">
                                            {CurrencySymbol[currency]}{" "}
                                            {numberWithCommas(
                                                toDec(
                                                    totalSpy.reduce(
                                                        (a, b) => a + b,
                                                        0
                                                    ),
                                                    0,
                                                    2
                                                )
                                            )}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Skeleton height={32} animation="wave" />
                                )}
                            </Stack>
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    {lang_texts[language][7]}
                                </Typography>
                                {loading ? (
                                    <Stack>
                                        <Typography
                                            variant="h5"
                                            style={{
                                                color: "white !important",
                                            }}
                                        >
                                            {totalUser}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Skeleton height={32} animation="wave" />
                                )}
                            </Stack>
                        </Stack>
                    );
                }
            })()}

            <Container className="vault-lists">
                {Vaults.map((item, key) => {
                    let dp = stakedFilter
                        ? Number(userStaked[item.id]) > 0
                            ? "flex"
                            : "none"
                        : "flex";
                    if (
                        searchKey !== "" &&
                        item.search
                            .toLowerCase()
                            .search(searchKey.toLowerCase()) === -1
                    ) {
                        dp = "none";
                    }
                    let order = {
                        order: key,
                    };
                    if (currentFilter && currentFilter != "") {
                        switch (currentFilter) {
                            case "aprl":
                                order.order = APS[item.id];
                                break;
                            case "aprh":
                                order.order = APS[item.id] * -1;
                                break;
                            case "timelowhigh":
                                order.order = TimeBlog[item.id];
                                break;
                            case "timehighlow":
                                order.order = TimeBlog[item.id] * -1;
                                break;
                            case "stakedlowhigh":
                                order.order = totalSupply[item.id];
                                break;
                            case "stakedhighlow":
                                order.order = totalSupply[item.id] * -1;
                                break;
                            default:
                                order.order = key;
                                break;
                        }
                    }
                    return (
                        <>
                            <img
                                src={!key ? ShoresHell : Inferno}
                                style={{
                                    width: mobile
                                        ? !key
                                            ? "29%"
                                            : "12%"
                                        : !key
                                        ? "100%"
                                        : "45%",
                                }}
                            />
                            <Stack
                                direction="row"
                                key={key}
                                display={dp}
                                style={order}
                            >
                                <Pool
                                    item={item}
                                    index={key}
                                    handleExpand={_handleExpaned}
                                    loading={loading}
                                    _web3={web3}
                                    updateTime={updateEndTime}
                                    updateStaked={updateStakedState}
                                    expand={expanded}
                                    CoinInfo={CoinInfo}
                                    UpdatingTVL={UpdatingTotalSupply}
                                    updateAPRs={updateAPRs}
                                    chartInfo={chartInfo}
                                />
                            </Stack>
                        </>
                    );
                })}
            </Container>
        </Box>
    );
};

export default Home;
