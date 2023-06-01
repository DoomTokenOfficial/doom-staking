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
                            <Stack className="active-btn-box">
                                {/* <FormControlLabel
                                    control={
                                        <Switch
                                            className="styled-switch"
                                            focusVisibleClassName=".Mui-focusVisible"
                                            disableRipple
                                            sx={{ m: 1 }}
                                            defaultChecked={false}
                                            onChange={() =>
                                                setStakedFilter(!stakedFilter)
                                            }
                                        />
                                    }
                                    label={lang_texts[language][2]}
                                /> */}
                            </Stack>
                            <Stack className="search-filter-box">
                                <Stack>
                                    <Stack className="search">
                                        {/* <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                        >
                                            <path
                                                d="M4.69435 2.59624C3.19893 2.66017 2.02759 3.90946 2.02759 5.44035C2.02759 5.54863 2.03365 5.65753 2.04552 5.76408C2.06164 5.9094 2.18211 6.01669 2.32185 6.01669C2.33239 6.01669 2.34306 6.01607 2.35372 6.01483C2.50655 5.99711 2.61635 5.85613 2.5989 5.69978C2.58945 5.61454 2.58472 5.52732 2.58472 5.44048C2.58472 4.21571 3.52155 3.21643 4.71762 3.16526C4.8713 3.1587 4.9908 3.02601 4.98437 2.86892C4.97783 2.7117 4.84573 2.58955 4.69435 2.59624Z"
                                                fill={
                                                    mode === "light"
                                                        ? "#027AFF"
                                                        : "#66DC95"
                                                }
                                            />
                                            <path
                                                d="M8.07614 2.06117C6.26838 0.21299 3.32635 0.212866 1.51835 2.06117C-0.289646 3.90934 -0.289646 6.91663 1.51835 8.76481C2.42223 9.68889 3.60971 10.151 4.79718 10.151C5.83935 10.151 6.88139 9.79494 7.73182 9.0832L10.2783 11.6862C10.3688 11.7788 10.4874 11.825 10.6061 11.825C10.7248 11.825 10.8434 11.7788 10.9341 11.6861C11.1152 11.501 11.1152 11.2008 10.9341 11.0157L8.38761 8.41271C9.87711 6.55264 9.77348 3.79611 8.07614 2.06117ZM7.42023 8.09432C5.97387 9.57256 3.62049 9.57281 2.17414 8.09432C0.727793 6.61583 0.727793 4.21015 2.17414 2.73153C2.89732 1.99241 3.84725 1.62272 4.79718 1.62272C5.74724 1.62272 6.69705 1.99241 7.42035 2.73153C8.86658 4.21015 8.86658 6.61583 7.42023 8.09432Z"
                                                fill={
                                                    mode === "light"
                                                        ? "#027AFF"
                                                        : "#66DC95"
                                                }
                                            />
                                        </svg> */}
                                        {/* <input
                                            placeholder={
                                                lang_texts[language][3]
                                            }
                                            value={searchKey}
                                            onChange={(e) =>
                                                setSearchKey(e.target.value)
                                            }
                                        /> */}
                                    </Stack>
                                    {/* <Button
                                        variant="text"
                                        endIcon={
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                            >
                                                <path
                                                    d="M7.10487 5.45501L10.5493 1.28616H1.66624L5.14696 5.45501C5.21948 5.56283 5.25573 5.67064 5.25573 5.77846V9.51605L6.95984 10.3426V5.74252C6.95984 5.6347 7.03236 5.52689 7.10487 5.45501ZM11.8909 1.1424L7.90254 5.92221V11.0614C7.90254 11.4208 7.53996 11.6364 7.2499 11.4927L4.6031 10.2348C4.45807 10.1629 4.31304 10.0192 4.31304 9.80356V5.92221L0.324705 1.1424C0.0709019 0.854895 0.288447 0.387695 0.687281 0.387695H11.5283C11.9271 0.387695 12.1447 0.818956 11.8909 1.1424Z"
                                                    fill={
                                                        mode === "light"
                                                            ? "#027AFF"
                                                            : "#66DC95"
                                                    }
                                                />
                                            </svg>
                                        }
                                        id="demo-customized-button"
                                        aria-controls="demo-customized-menu"
                                        aria-haspopup="true"
                                        aria-expanded={
                                            filtermenu ? "true" : undefined
                                        }
                                        onClick={_handleFilter}
                                    >
                                        {lang_texts[language][4]}
                                    </Button> */}
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
                                    <ChartBox
                                        AllData={chartInfo}
                                        id="CFLT"
                                        type="status"
                                        coin={coinStatus}
                                    />
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
                                >
                                    {lang_texts[language][7]}
                                </Typography>
                                {loading ? (
                                    <Stack>
                                        <Typography
                                            variant="h5"
                                            className="first-box-style"
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
                                        <Typography variant="h5">
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
                                        <Typography variant="h5">
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
            ;
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
                    );
                })}
            </Container>
        </Box>
    );
};

export default Home;
