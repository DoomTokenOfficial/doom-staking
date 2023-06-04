import React, { useEffect, useState, useContext } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import FormControlLabel from "@mui/material/FormControlLabel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Web3 from "web3";

import ShoresHell from "../assets/img/strife-small-the-shores-of-hell.png";
import Inferno from "../assets/img/strife-small-inferno.png";

import useStyles from "../assets/constants/styles";
import { Vaults, Currencys, TotalPoolNum } from "../config/app";
import axios from "axios";

import Pool from "./Pool";
import {
    baseCurrency,
    CurrencySymbol,
    setInit,
    tempChart,
    toDec,
} from "../config/config";
import { ThemeModeContext } from "../context/themmode";
import { lang_texts, Filters, Languages } from "../assets/constants/language";
import ChartBox from "./chart";

const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
);
let countable = 0;

const Home = () => {
    const styles = useStyles();
    const theme = useTheme();
    const mode = theme.palette.mode;
    const { currency, setCurrency, setLanguage, language } =
        useContext(ThemeModeContext);

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
    const currencymenu = Boolean(cy);
    const languagemenu = Boolean(lg);

    const _handleFilter = (event) => {
        setFilter(event.currentTarget);
    };

    const _handleCloseFilter = (e, s) => {
        if (s === true) {
            setCurrentFilter(e);
        }
        setFilter(null);
    };

    const _handleLanguage = (event) => {
        setLG(event.currentTarget);
    };

    const _handleCloseLanguage = (e, s) => {
        if (s === true) {
            setLanguage(e);
        }
        setLG(null);
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
        _Expand(id);
        console.log(id, e, i, "232323232323232");
        let initialTop = !mobile ? 40 : 110;
        if (!e) {
            _Expand(id);
        } else if (e.target.tagName === "svg" || e.target.tagName === "path") {
            if (
                e.target.parentElement.tagName === "BUTTON" ||
                e.target.parentElement.parentElement.tagName === "BUTTON"
            ) {
                _Expand(id);
                if (!expanded[id]) {
                    window.scrollTo(0, initialTop + 105 * (i + 1));
                }
            } else {
                return;
            }
        } else {
            if (!expanded[id]) {
                window.scrollTo(0, initialTop + 105 * (i + 1));
            }
            _Expand(id);
        }
    };

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const _handleCurrency = (event) => {
        setCy(event.currentTarget);
    };

    const _handleCloseCurrency = (e, s) => {
        if (s === true) {
            setCurrency(e);
        }
        setCy(null);
    };

    const GetPoolStatus = async () => {
        let total_U = 0;

        for (let i = 0; i < Vaults.length; i++) {
            if (Vaults[i].vault) {
                const Pool = new web3.eth.Contract(
                    Vaults[i].vault.abi,
                    Vaults[i].vault.address
                );
                let t_u = await Pool.methods.userCount().call();
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
        let total_S = 0;
        if (!s) {
            countable++;
            setTotalSupply((prev) => {
                return { ...prev, [id]: Tval };
            });
        }
        const coin = coins.find((item) => item.id === coinId);

        if (coin) {
            total_S = coin.price * Tval;
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

    const GetChartInfo = async () => {
        let startDate = new Date(new Date() - 86400000).toISOString();
        let endDate = new Date().toISOString();
        const endpoint = `https://api.nomics.com/v1/currencies/sparkline?key=11eb38db1f3a30c89a0764bf97c083d0d8d6749b&ids=CFLT,AER2,FCF,PFT2,LLN,FFT2,WNOW,WRAITH2,DAPES,ADREAM&start=${startDate}&end=${endDate}`;
        axios
            .get(endpoint)
            .then(({ data }) => {
                setChartInfo(data);
            })
            .catch(() => {
                setChartInfo(tempChart);
            });
    };

    const GetCoinInfo = async () => {
        await axios
            .get(
                `https://api.nomics.com/v1/currencies/ticker?key=11eb38db1f3a30c89a0764bf97c083d0d8d6749b&ids=CFLT,AER2,FCF,PFT2,LLN,FFT2,WNOW,WRAITH2,DAPES,ADREAM&interval=1d,7d&convert=${currency}`
            )
            .then(({ data }) => {
                for (let i = 0; i < Vaults.length; i++) {
                    if (Object.hasOwnProperty.call(totalSupply, Vaults[i].id)) {
                        UpdatingTotalSupply(
                            Vaults[i].id,
                            totalSupply[Vaults[i].id],
                            Vaults[i].chart.id[1],
                            i,
                            true,
                            data
                        );
                    }
                }
                setCoinInfo([...data]);

                let CFLTINFO = data.find((item) => item.id === "CFLT");
                let priceptc = (
                    CFLTINFO["1d"]
                        ? CFLTINFO["1d"].price_change_pct * 100
                        : CFLTINFO["7d"]
                        ? CFLTINFO["7d"].price_change_pct * 100
                        : 0
                ).toFixed(2);
                let status = "";
                if (priceptc >= 1) {
                    status = "text-green";
                    priceptc = `+${priceptc}`;
                }
                if (priceptc > 0 && priceptc < 1) {
                    status = "text-purple";
                    priceptc = `+${priceptc}`;
                }
                if (priceptc <= -1) {
                    status = "text-red";
                }
                if (priceptc > -1 && priceptc < 0) {
                    status = "text-pink";
                }

                setCoinStatus({
                    price: Number(CFLTINFO.price).toFixed(6),
                    priceptc,
                    status,
                });
            })
            .catch((err) => {
                console.log(err);
                for (let i = 0; i < Vaults.length; i++) {
                    if (Object.hasOwnProperty.call(totalSupply, Vaults[i].id)) {
                        UpdatingTotalSupply(
                            Vaults[i].id,
                            totalSupply[Vaults[i].id],
                            Vaults[i].chart.id[1],
                            i,
                            true
                        );
                    }
                }
            });
    };

    useEffect(() => {
        setCoinInfo([]);
        GetCoinInfo();
    }, [currency]);

    useEffect(() => {
        GetChartInfo();
        GetPoolStatus();
    }, []);

    useEffect(() => {
        setFilter(null);
        setCy(null);
        setLG(null);
    }, [tablet, mobile]);

    useEffect(() => {
        if (!tablet || !mobile) {
            const script = document.createElement("script");
            script.src = "https://widget.nomics.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
            let iframe = document.querySelector("iframe");
            if (iframe) {
                let url = iframe.getAttribute("src");
                iframe.setAttribute(
                    "src",
                    `${url.substr(0, url.length - 4) + currency}/`
                );
            }
        }
    }, [expanded, tablet, currency]);

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
                                    $ Doom
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
                                                      baseCurrency.CFLT.USD,
                                                      0,
                                                      6
                                                  )}
                                        </Typography>
                                        <Typography
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
                                        </Typography>
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
                            <Stack spacing={2}>
                                <Typography
                                    variant="h6"
                                    className="first-box-style"
                                    style={{
                                        color: "#a61919 !important",
                                    }}
                                >
                                    {lang_texts[language][7]}
                                </Typography>
                                {loading ? (
                                    <Stack>
                                        <Typography
                                            variant="h5"
                                            className="first-box-style"
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
                } else if (!mobile && !tablet) {
                    return <></>;
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
                                    width: !key ? "29%" : "12%",
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
