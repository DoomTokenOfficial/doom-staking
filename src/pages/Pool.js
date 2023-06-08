import React, { useCallback, useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import styled from "@mui/material/styles/styled";
import Skeleton from "@mui/material/Skeleton";
import Collapse from "@mui/material/Collapse";
import useTheme from "@mui/material/styles/useTheme";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutlinedInput from "@mui/material/OutlinedInput";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import ShoresHell from "../assets/img/strife-small-the-shores-of-hell.png";
import { Link } from "@mui/material";
import { ThemeModeContext } from "../context/themmode";
import { netId, Tokens, Vaults } from "../config/app";
import claimOrStakeBtn from "../assets/img/StakeClaimButton.png";
import depositWithdraw from "../assets/img/DepositWithdrawClaimButton.png";
import StakeClaimButtonMobile from "../assets/img/StakeClaimButtonMobile.png";
import {
    baseCurrency,
    CurrencySymbol,
    customToFixed,
    numberWithCommas,
    secsForYear,
    secsPerDay,
    toDec,
} from "../config/config";
import { lang_texts } from "../assets/constants/language";
import LeftTime from "./leftTime";
import ClaimTime from "./claimTime";
import ChartBox from "./chart";
import StatusBar1 from "../assets/img/StatusBar1.png";
import StatusBar2 from "../assets/img/StatusBar2.png";
import StatusBarLower from "../assets/img/StatusBarLower.png";
import StatusBarMobile from "../assets/img/StatusBar1-Mobile.png";
const Pool = ({
    item,
    handleExpand,
    expand,
    CoinInfo,
    index,
    UpdatingTVL,
    updateAPRs,
    updateTime,
    updateStaked,
    _web3,
    loading = false,
}) => {
    const Coin = CoinInfo.find((co) => co.tokenSymbol === item.chart.id[0]);
    const BaseCoin = CoinInfo.find((co) => co.tokenSymbol === item.chart.id[1]);
    const { currency, language } = useContext(ThemeModeContext);
    const { account, chainId, library } = useWeb3React();

    console.log(CoinInfo, Coin, BaseCoin, "------------------------------");
    const tablet = useMediaQuery("(min-width:1200px)");
    const mobile = useMediaQuery("(min-width:800px)");

    const [dv, setDV] = useState();
    const [wv, setWV] = useState();
    const [sb, setSB] = useState(0);
    const [cb, setCB] = useState(0);
    const [CR, setCR] = useState(0);
    const [DR, setDR] = useState(0);
    const [APR, setAPR] = useState(0);
    const [slider, setSlider] = useState(0);
    const [balance, setBalance] = useState({});
    const [timeblog, setTimeblog] = useState();
    const [dloading, setDloading] = useState(false);
    const [wloading, setWloading] = useState(false);
    const [claimedAt, setClaimedAt] = useState(0);
    const [poolState, setPoolState] = useState(true);
    const [totalSupply, setTotalSupply] = useState();
    const [tokenTotalS, settokenTotalS] = useState(0);
    const [tokenDecimals, setTokenDecimals] = useState({});
    const [displayInfo, setDisplayInfo] = useState(false);

    const toBN = useCallback((web3, val) => {
        if (val) {
            val = val.toString();
            return new web3.utils.BN(val);
        } else {
            return "0";
        }
    }, []);

    const toWei = useCallback((web3, val) => {
        if (val) {
            val = val.toString();
            return web3.utils.toWei(val);
        } else {
            return "0";
        }
    }, []);

    const UpdateAllInfo = async (state) => {
        const Pool = new _web3.eth.Contract(item.vault.abi, item.vault.address);
        const CT_base = new _web3.eth.Contract(
            Tokens.abi[item.tokenId[0]],
            Tokens.address[item.tokenId[0]]
        );
        const CT_vault = new _web3.eth.Contract(
            Tokens.abi[item.tokenId[1]],
            Tokens.address[item.tokenId[1]]
        );
        const BaseDecimal = await CT_base.methods.decimals().call();
        const RewardDecimal = await CT_vault.methods.decimals().call();
        const TokenTotalSupply = await CT_base.methods.totalSupply().call();

        console.log(
            "11111111111111111111111111111111111111111111111111111111111111",
            item.tokenId[0],
            BaseDecimal,
            "BaseDecimal",
            item.tokenId[1],
            RewardDecimal,
            "RewardDecimal",
            "TokenTotalSup2p11ly"
        );
        let t_s = await Pool.methods.totalStaked().call();
        let rewardRate = await Pool.methods.rewardRate().call();
        rewardRate = rewardRate * 10 ** (18 - RewardDecimal);
        t_s = String(
            toBN(_web3, t_s).mul(toBN(_web3, 10 ** (18 - BaseDecimal)))
        );
        setTotalSupply(toDec(t_s, 18, 0));

        if (state) {
            const base_balance = await CT_base.methods
                .balanceOf(account)
                .call();
            const Reward_Balance = await CT_vault.methods
                .balanceOf(account)
                .call();
            // const stakedToken = { amount: 0 };
            const stakedToken = await Pool.methods
                .stakedBalanceOf(account)
                .call();
            const rewarded = await Pool.methods.earned(account).call();

            console.log(rewarded, "rewarded");
            // const rewarded = await Pool.methods.claimable(account).call();
            const userInfo = {
                amount: 0,
                rewardDebt: 0,
                pedingRewards: 0,
                depositedAt: 0,
                claimedAt: 0,
            };
            // const userInfo = await Pool.methods.userInfo(account).call();
            const rewardC = await Pool.methods.rewardRate().call();

            const Endtime = await Pool.methods.lastUpdateTime().call();
            Promise.resolve(Endtime).then((res) => {
                const poolLifeCycle = res
                    ? toDec(Math.abs(res - new Date() / 1000), 0, 0)
                    : 0;
                const c_r =
                    Number(t_s) > 0 ? (poolLifeCycle * rewardRate) / t_s : 0;
                const d_r =
                    Number(t_s) > 0 ? (secsPerDay * rewardRate) / t_s : 0;
                setCR(toDec(c_r, 0, 8));
                setDR(toDec(d_r, 0, 8));
            });

            let OB = {};
            OB[item.tokenId[0]] = base_balance.toString();
            OB[item.tokenId[1]] = Reward_Balance.toString();
            setBalance(OB);
            setSB(stakedToken);
            setCB(toDec(rewarded, RewardDecimal, 2));
            updateStaked(
                item.id,
                toDec(stakedToken, BaseDecimal, 2),
                toDec(rewarded, RewardDecimal, 2)
            );
            setClaimedAt(userInfo.claimedAt);
            settokenTotalS(toDec(TokenTotalSupply, BaseDecimal, 0));
        } else {
            const Endtime = await Pool.methods.periodFinish().call();
            Promise.resolve(Endtime).then((res) => {
                console.log(res, "res--------");
                if (Number(res) - new Date() / 1000 < 0) {
                    setPoolState(false);
                }
                setTimeblog(res);
                updateTime(item.id, res);
            });

            if (Coin && BaseCoin) {
                const APR =
                    (((Coin.usdPrice / BaseCoin.usdPrice) *
                        secsForYear *
                        rewardRate) /
                        (t_s > 0 ? t_s : 10 ** BaseDecimal)) *
                    100;
                setAPR(toDec(APR, 0, 0));
                console.log(APR, "00303030303003");

                updateAPRs(item.id, toDec(APR, 0, 0));
            } else {
                const APR =
                    (((baseCurrency[item.tokenId[1]]["USD"] /
                        baseCurrency[item.tokenId[0]]["USD"]) *
                        secsForYear *
                        rewardRate) /
                        (t_s > 0 ? t_s : 10 ** BaseDecimal)) *
                    100;
                setAPR(APR < 10 ? toDec(APR, 0, 1) : toDec(APR, 0, 0));
                updateAPRs(
                    item.id,
                    APR < 10 ? toDec(APR, 0, 1) : toDec(APR, 0, 0)
                );
            }
            UpdatingTVL(item.id, toDec(t_s, 18, 0), item.chart.id[1], index);
            setTokenDecimals({ BaseDecimal, RewardDecimal });
        }
    };

    const setMax = () => {
        if (Number(balance[item.tokenId[0]]) > 0) {
            setDV(
                new BigNumber(balance[item.tokenId[0]]).div(
                    new BigNumber(10).pow(tokenDecimals.BaseDecimal)
                )
            );
        }
    };

    const setWmax = () => {
        if (Number(sb) > 0) {
            setWV(
                new BigNumber(sb).div(
                    new BigNumber(10).pow(tokenDecimals.BaseDecimal)
                )
            );
        }
    };

    const deposit = async () => {
        setDloading(true);
        const WB = balance[item.tokenId[0]];
        if (
            Number(dv) > 0 &&
            new BigNumber(dv).times(
                new BigNumber(10).pow(tokenDecimals.BaseDecimal)
            ) <= new BigNumber(WB) &&
            item.vault
        ) {
            const web3 = new Web3(library.provider);
            const Pool = new web3.eth.Contract(
                item.vault.abi,
                item.vault.address
            );
            const TokenContract = new web3.eth.Contract(
                Tokens.abi[item.tokenId[0]],
                Tokens.address[item.tokenId[0]]
            );
            try {
                const allowance = await TokenContract.methods
                    .allowance(account, item.vault.address)
                    .call({ from: account });
                if (
                    toBN(web3, allowance).lt(
                        toBN(
                            web3,
                            String(
                                toBN(web3, dv).mul(
                                    toBN(web3, 10 ** tokenDecimals.BaseDecimal)
                                )
                            )
                        )
                    )
                ) {
                    await TokenContract.methods
                        .approve(
                            item.vault.address,
                            toWei(web3, "100000000000000000000000000000")
                        )
                        .send({ from: account });
                }
                await Pool.methods
                    .stake(
                        String(
                            toBN(web3, toWei(web3, dv))
                                .mul(
                                    toBN(web3, 10 ** tokenDecimals.BaseDecimal)
                                )
                                .div(toBN(web3, 10 ** 18))
                        )
                    )
                    .send({ from: account });
                UpdateAllInfo();
                setDV(0);
                setDloading(false);
            } catch (error) {
                console.log(error);
                setDloading(false);
            }
        } else {
            setDloading(false);
        }
    };

    const withdraw = async () => {
        setWloading(true);
        if (
            Number(wv) > 0 &&
            new BigNumber(wv).times(
                new BigNumber(10).pow(tokenDecimals.BaseDecimal)
            ) <= new BigNumber(sb) &&
            item.vault
        ) {
            const web3 = new Web3(library.provider);
            const Pool = new web3.eth.Contract(
                item.vault.abi,
                item.vault.address
            );
            try {
                await Pool.methods
                    .withdraw(
                        String(
                            toBN(web3, toWei(web3, wv))
                                .mul(
                                    toBN(web3, 10 ** tokenDecimals.BaseDecimal)
                                )
                                .div(toBN(web3, 10 ** 18))
                        )
                    )
                    .send({ from: account });
                UpdateAllInfo();
                setWV();
                setWloading(false);
            } catch (error) {
                setWloading(false);
            }
        } else {
            setWloading(false);
        }
    };

    const claim = async () => {
        if (Number(cb) > 0) {
            try {
                const web3 = new Web3(library.provider);
                const Pool = new web3.eth.Contract(
                    item.vault.abi,
                    item.vault.address
                );
                await Pool.methods.getReward().send({ from: account });
                await UpdateAllInfo(true);
            } catch {
                await UpdateAllInfo(true);
            }
        }
    };

    const UnsetAllData = () => {
        setDV();
        setWV();
        setSB(0);
        setCB(0);
        setCR(0);
        setDR(0);
        setSlider(0);
        setBalance({});
        setClaimedAt(0);
        settokenTotalS(0);
    };

    useEffect(() => {
        let timer;
        if (chainId === netId && library && chainId) {
            UpdateAllInfo(true);
            clearInterval(timer);
            timer = setInterval(() => {
                UpdateAllInfo(true);
            }, 20000);
            // console.clear();
        } else {
            clearInterval(timer);
            timer = setInterval(() => {
                UpdateAllInfo(false);
            }, 60000);
            UnsetAllData();
            // console.clear();
        }
        return () => {
            clearInterval(timer);
            // console.clear();
        };
    }, [account, library, chainId]);

    useEffect(() => {
        UpdateAllInfo(false);
    }, []);

    return (
        <>
            <Box
                style={{
                    padding: "0px",
                }}
            >
                {(() => {
                    if (mobile) {
                        return (
                            <>
                                <Stack
                                    style={{
                                        backgroundImage: `url(${item.img_url})`,
                                        padding: "20.7px 40px",
                                        display: "grid",
                                        gridTemplateColumns: "repeat(6, 1fr)",
                                    }}
                                    className="item-box"
                                >
                                    <Stack
                                        className="item-1"
                                        style={{
                                            marginLeft: "-18px",
                                        }}
                                    >
                                        <Stack spacing={1} direction="row">
                                            <Typography
                                                style={{
                                                    fontFamily: "PublicFont",
                                                    textShadow:
                                                        "3px 2px 2px black, 3px 2px 0px black",
                                                    fontSize: "13px",
                                                    color: "red",
                                                    // letterSpacing: "1px",
                                                    // fontWeight: "bolder",
                                                    fontPalette: "dark",
                                                }}
                                                variant="span"
                                                className="sub-description"
                                            >
                                                {lang_texts[language][9]} $
                                                {item.stake_token}
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            variant="span"
                                            className="value"
                                            style={{
                                                fontFamily: "PublicFont",
                                                textShadow:
                                                    "3px 2px 2px black, 3px 2px 0px black",
                                                fontSize: "13px",
                                                color: "red",
                                                // letterSpacing: "2px",
                                                fontWeight: "bolder",
                                                fontPalette: "dark",
                                                paddingTop: "10px",
                                            }}
                                        >
                                            {lang_texts[language][8]} &nbsp;$
                                            {item.stake_token}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        justifyContent="center"
                                        className="item-3"
                                        spacing={0.75}
                                    >
                                        <Stack>
                                            <Typography
                                                variant="span"
                                                className="value"
                                                style={
                                                    Number(APR) > 10000
                                                        ? {
                                                              fontFamily:
                                                                  "PublicFont",
                                                              textShadow:
                                                                  "4px 3px 1px black, 6px 4px 1px black",
                                                              fontSize: "27px",
                                                              color: "red",

                                                              position:
                                                                  "relative",
                                                              left: "-37px",
                                                              // fontWeight: "bolder",
                                                          }
                                                        : {
                                                              fontFamily:
                                                                  "PublicFont",
                                                              textShadow:
                                                                  "4px 3px 1px black, 6px 4px 1px black",
                                                              fontSize: "27px",
                                                              color: "red",

                                                              // fontWeight: "bolder",
                                                          }
                                                }
                                            >
                                                {APR
                                                    ? Number(APR) > 10000
                                                        ? "+10000"
                                                        : APR
                                                    : 0}
                                                %
                                            </Typography>
                                        </Stack>

                                        <Stack spacing={1} direction="row">
                                            <Typography
                                                style={{
                                                    fontFamily: "PublicFont",
                                                    textShadow:
                                                        "black -1px 2px 2px",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    marginLeft: " 45px",
                                                    marginTop: "10px",
                                                }}
                                                variant="span"
                                                className="sub-description"
                                            >
                                                APY
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack className="item-4" spacing={0.75}>
                                        <Stack
                                            className="help"
                                            direction="row"
                                            spacing={1}
                                            style={{
                                                fontFamily: "StackFont",
                                                textShadow:
                                                    "4px 1px 1px black, 4px 2px 1px black",
                                                fontSize: "20px",
                                                color: "red",
                                                // letterSpacing: "3px",
                                                fontWeight: "bolder",
                                                marginTop: "-17px",
                                                // marginLeft: "10px",
                                            }}
                                        >
                                            <Typography
                                                variant="span"
                                                className="title left-time"
                                                style={{
                                                    fontFamily: "PublicFont",
                                                    textShadow:
                                                        "black -1px 2px 2px",
                                                    fontSize: "14px",
                                                    color: "red",
                                                    letterSpacing: "1px",
                                                    marginTop: "10px",
                                                    marginLeft: "-12px",
                                                    position: "relative",
                                                }}
                                            >
                                                {lang_texts[language][10]}
                                            </Typography>
                                        </Stack>
                                        <Stack>
                                            <LeftTime
                                                timeLeft={timeblog}
                                                device="laptop"
                                                poolState={poolState}
                                                loading={loading}
                                            />
                                            <Typography
                                                variant="span"
                                                className="description"
                                                style={{
                                                    // letterSpacing: "38px",
                                                    marginLeft: "7px",
                                                    position: "relative",
                                                    top: "19px",
                                                    fontFamily: "PublicFont",
                                                    fontSize: "16px",
                                                    textShadow:
                                                        "2px 3px 2px black",
                                                    letterSpacing: "-9.9px",
                                                }}
                                            >
                                                D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;H&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        className="item-5"
                                        spacing={0}
                                        style={{
                                            position: "relative",
                                            left: "93px",
                                        }}
                                    >
                                        <Stack
                                            className="help"
                                            direction="row"
                                            spacing={1}
                                        >
                                            <Typography
                                                variant="span"
                                                className="title"
                                                style={{
                                                    fontFamily: "PublicFont",
                                                    fontSize: "12px",
                                                    letterSpacing: "3px",
                                                    color: "red",
                                                    textShadow:
                                                        "4px 2px 1px black, 6px 5px 6px black",
                                                    fontWeight: "bold",
                                                    marginTop: "-3px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {lang_texts[language][11]}
                                            </Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography
                                                variant="span"
                                                className="sub-description"
                                                style={{
                                                    textShadow:
                                                        "1px 1px 1px black",
                                                    fontFamily: "PublicFont",
                                                    fontSize: "14px",
                                                    marginLeft: "-10px",
                                                    letterSpacing: "2px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {totalSupply
                                                    ? numberWithCommas(
                                                          totalSupply
                                                      )
                                                    : 0}{" "}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        className="item-6"
                                        height={0}
                                        marginLeft={"-70px"}
                                    ></Stack>
                                    <Stack className="item-7">
                                        <Button
                                            onClick={() =>
                                                handleExpand(item.id, null)
                                            }
                                            variant="contained"
                                            endIcon={
                                                <ChevronRightIcon
                                                    className={
                                                        expand[item.id] === true
                                                            ? "expand-icon activate"
                                                            : "expand-icon"
                                                    }
                                                />
                                            }
                                            disableElevation
                                            style={
                                                poolState
                                                    ? {
                                                          color: "white",
                                                          position: "relative",

                                                          background: `url(${claimOrStakeBtn})`,
                                                          width: "175px",
                                                          height: "64px",
                                                          fontFamily:
                                                              "EternalUI",
                                                          fontSize: "18px",
                                                          //   letterSpacing: "2px",
                                                          borderRadius:
                                                              "unset !important",
                                                      }
                                                    : {
                                                          color: "white",
                                                          position: "relative",

                                                          background: `url(${claimOrStakeBtn})`,
                                                          width: "175px",
                                                          height: "64px",
                                                          fontFamily:
                                                              "EternalUI",
                                                          fontSize: "18px",
                                                          //   letterSpacing: "2px",
                                                          borderRadius:
                                                              "unset !important",
                                                      }
                                            }
                                        >
                                            STAKE/CLAIM
                                        </Button>
                                    </Stack>
                                </Stack>

                                <Collapse
                                    style={{
                                        backgroundImage: `url(${StatusBarLower})`,
                                        padding: "0px",
                                        height: "112px !important",
                                        paddingTop: "8px",
                                    }}
                                    className="collapse"
                                    in={expand[item.id] === true ? true : false}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <Stack
                                        className="collapse-body col-nun-padding"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                " repeat(2, 1fr)",
                                        }}
                                    >
                                        <Stack className="collapse-1">
                                            <Stack className="sub-title pd-0">
                                                <Stack
                                                    className="help"
                                                    direction="row"
                                                    spacing={0}
                                                >
                                                    <Typography
                                                        variant="span"
                                                        className="title text-font"
                                                        alignSelf="flex-start"
                                                        style={{
                                                            fontFamily:
                                                                "EternalUI",
                                                            textShadow:
                                                                "2px 3px 2px black",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {
                                                            lang_texts[
                                                                language
                                                            ][16]
                                                        }
                                                    </Typography>
                                                </Stack>
                                                <Typography
                                                    variant="span"
                                                    className="sub-description text-font"
                                                    alignSelf="flex-start"
                                                    style={{
                                                        fontFamily: "EternalUI",
                                                        textShadow:
                                                            "2px 3px 2px black",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {(() => {
                                                        if (
                                                            Number(
                                                                balance[
                                                                    item
                                                                        .tokenId[0]
                                                                ]
                                                            ) > 0
                                                        ) {
                                                            return `${numberWithCommas(
                                                                customToFixed(
                                                                    new BigNumber(
                                                                        balance[
                                                                            item.tokenId[0]
                                                                        ]
                                                                    ).div(
                                                                        new BigNumber(
                                                                            10
                                                                        ).pow(
                                                                            tokenDecimals.BaseDecimal
                                                                        )
                                                                    ),
                                                                    3
                                                                )
                                                            )} ${
                                                                item.stake_token
                                                            }`;
                                                        } else {
                                                            return `0 ${item.stake_token}`;
                                                        }
                                                    })()}
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                spacing={0}
                                                mb={0}
                                            >
                                                <Stack className="col-row-1">
                                                    <OutlinedInput
                                                        disabled={
                                                            Number(
                                                                balance[
                                                                    item
                                                                        .tokenId[0]
                                                                ]
                                                            ) > 0
                                                                ? false
                                                                : true
                                                        }
                                                        className={
                                                            Number(
                                                                balance[
                                                                    item
                                                                        .tokenId[0]
                                                                ]
                                                            ) > 0
                                                                ? "cal-in bg-white"
                                                                : "cal-in disabled"
                                                        }
                                                        placeholder="0"
                                                        value={dv}
                                                        onChange={(e) =>
                                                            setDV(
                                                                e.target.value
                                                            )
                                                        }
                                                        type="number"
                                                        endAdornment={
                                                            <Typography
                                                                onClick={setMax}
                                                                variant="span"
                                                                className={
                                                                    Number(
                                                                        balance[
                                                                            item
                                                                                .tokenId[0]
                                                                        ]
                                                                    ) > 0
                                                                        ? "sub-description c-max"
                                                                        : "sub-description"
                                                                }
                                                            >
                                                                Max
                                                            </Typography>
                                                        }
                                                    />
                                                </Stack>
                                                <Stack
                                                    className={
                                                        Number(
                                                            balance[
                                                                item.tokenId[0]
                                                            ]
                                                        ) > 0 && poolState
                                                            ? "col-row-2"
                                                            : "col-row-2 disabled"
                                                    }
                                                >
                                                    {dloading ? (
                                                        <LoadingButton
                                                            loading
                                                            variant="contained"
                                                            // className="deposit-btn"
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "132px",
                                                                height: "32px",
                                                            }}
                                                        ></LoadingButton>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            onClick={deposit}
                                                            disabled={
                                                                Number(
                                                                    balance[
                                                                        item
                                                                            .tokenId[0]
                                                                    ]
                                                                ) > 0
                                                                    ? false
                                                                    : true
                                                            }
                                                            className={
                                                                Number(
                                                                    balance[
                                                                        item
                                                                            .tokenId[0]
                                                                    ]
                                                                ) > 0
                                                                    ? "deposit-btn"
                                                                    : "disabled deposit-btn"
                                                            }
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "132px",
                                                                height: "32px",
                                                                fontFamily:
                                                                    "EternalUI",
                                                            }}
                                                        >
                                                            {
                                                                lang_texts[
                                                                    language
                                                                ][18]
                                                            }{" "}
                                                            {/* {item.tokenId[0]} */}
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                            <Stack className="sub-title">
                                                <Stack
                                                    className="help"
                                                    direction="row"
                                                    spacing={0}
                                                >
                                                    <Typography
                                                        variant="span"
                                                        className="title"
                                                        alignSelf="flex-start"
                                                        style={{
                                                            fontFamily:
                                                                "EternalUI",
                                                            textShadow:
                                                                "2px 3px 2px black",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {
                                                            lang_texts[
                                                                language
                                                            ][17]
                                                        }
                                                    </Typography>
                                                </Stack>

                                                <Typography
                                                    variant="span"
                                                    className="sub-description"
                                                    alignSelf="flex-start"
                                                    style={{
                                                        fontFamily: "EternalUI",
                                                        textShadow:
                                                            "2px 3px 2px black",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {numberWithCommas(
                                                        customToFixed(
                                                            new BigNumber(
                                                                sb
                                                            ).div(
                                                                new BigNumber(
                                                                    10
                                                                ).pow(
                                                                    tokenDecimals.BaseDecimal
                                                                )
                                                            ),
                                                            3
                                                        )
                                                    )}{" "}
                                                    {item.stake_token}
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                spacing={1.25}
                                            >
                                                <Stack className="col-row-1">
                                                    <OutlinedInput
                                                        disabled={
                                                            Number(sb) > 0
                                                                ? false
                                                                : true
                                                        }
                                                        className={
                                                            Number(sb) > 0
                                                                ? "cal-in bg-white"
                                                                : "cal-in disabled"
                                                        }
                                                        placeholder="0"
                                                        value={wv}
                                                        type="number"
                                                        onChange={(e) =>
                                                            setWV(
                                                                e.target.value
                                                            )
                                                        }
                                                        endAdornment={
                                                            <Typography
                                                                onClick={
                                                                    setWmax
                                                                }
                                                                variant="span"
                                                                className={
                                                                    Number(sb) >
                                                                    0
                                                                        ? "sub-description c-max"
                                                                        : "sub-description"
                                                                }
                                                            >
                                                                Max
                                                            </Typography>
                                                        }
                                                    />
                                                </Stack>
                                                <Stack className="col-row-2">
                                                    {wloading ? (
                                                        <LoadingButton
                                                            loading
                                                            variant="contained"
                                                            // className="return-btn"
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "132px",
                                                                height: "32px",
                                                                position:
                                                                    "relative",
                                                                left: "-10px",
                                                                // left: "26px",
                                                            }}
                                                        ></LoadingButton>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            className={
                                                                Number(sb) > 0
                                                                    ? "deposit-btn"
                                                                    : "disabled deposit-btn"
                                                            }
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "132px",
                                                                height: "32px",
                                                                position:
                                                                    "relative",
                                                                left: "-10px",
                                                                fontFamily:
                                                                    "EternalUI",
                                                            }}
                                                            onClick={withdraw}
                                                        >
                                                            {
                                                                lang_texts[
                                                                    language
                                                                ][19]
                                                            }{" "}
                                                            {/* {item.tokenId[0]} */}
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        <Stack
                                            className="collapse-5"
                                            spacing={0}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1.25}
                                            >
                                                <Stack
                                                    spacing={1.25}
                                                    className="col-row-1"
                                                >
                                                    <Typography
                                                        variant="span"
                                                        className="sub-description"
                                                        alignSelf="flex-start"
                                                        style={{
                                                            marginLeft: "21px",
                                                            position:
                                                                "relative",
                                                            top: "-40%",
                                                            fontFamily:
                                                                "EternalUI",
                                                            fontSize: "14px",
                                                            textShadow:
                                                                "2px 3px 2px black",
                                                            right: "-80%",
                                                            color: "red",
                                                            fontWeight:
                                                                "bolder",
                                                        }}
                                                    >
                                                        Your Rewards
                                                    </Typography>
                                                </Stack>

                                                <Stack className="col-row-1 col-md-6">
                                                    <Typography
                                                        variant="span"
                                                        className="sub-description"
                                                        alignSelf="flex-start"
                                                        style={{
                                                            marginLeft: "21px",
                                                            color: "white",
                                                            position:
                                                                "relative",
                                                            top: "-40%",
                                                            fontFamily:
                                                                "EternalUI",
                                                            fontSize: "14px",
                                                            textShadow:
                                                                "2px 3px 2px black",
                                                            right: "-84px",
                                                            fontWeight:
                                                                "bolder",
                                                        }}
                                                    >
                                                        {cb} {item.tokenId[0]}
                                                        {/* 30000 DOOM */}
                                                    </Typography>
                                                </Stack>
                                                <Stack className="">
                                                    <Button
                                                        onClick={claim}
                                                        // className="depositWithdraw"
                                                        variant="contained"
                                                        className={
                                                            Number(cb) > 0
                                                                ? " "
                                                                : "disabled"
                                                        }
                                                        style={{
                                                            // color: "white !important",
                                                            position:
                                                                "relative",
                                                            background: `url(${depositWithdraw})`,
                                                            width: "132px",
                                                            height: "32px",
                                                            fontFamily:
                                                                "EternalUI",
                                                            fontSize: "12px",
                                                            letterSpacing:
                                                                "2px",
                                                            top: "65%",
                                                            right: "121px",
                                                            backgroundRadius:
                                                                "unset !important",
                                                            // left: "35%",
                                                        }}
                                                    >
                                                        Claim
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Collapse>
                            </>
                        );
                    } else {
                        return (
                            <>
                                <Stack
                                    style={{
                                        display: "block",
                                        // gridTemplateColumns: "repeat(6, 1fr)",
                                        // width: "99vw",
                                        left: "0px",
                                        position: "relative",
                                    }}
                                    className="item-box"
                                >
                                    <Stack
                                        className="item-1"
                                        style={{
                                            width: "323px",
                                            position: "relative",
                                            margin: "auto",
                                            height: "106px",
                                            marginBottom: "5px",
                                            backgroundImage: `url(${StatusBarMobile})`,
                                        }}
                                    >
                                        <Stack
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                marginTop: "-20px",
                                            }}
                                        >
                                            <Typography
                                                variant="span"
                                                className="value"
                                                style={{
                                                    fontFamily: "PublicFont",
                                                    textShadow:
                                                        "4px 3px 1px black, 6px 4px 1px black",
                                                    fontSize: "30px",
                                                    color: "red",
                                                    textAlign: "right",
                                                    left: "30px",
                                                    position: "relative",

                                                    // fontWeight: "bolder",
                                                }}
                                            >
                                                {APR
                                                    ? Number(APR) > 10000
                                                        ? "+10000"
                                                        : APR
                                                    : 0}
                                                %
                                            </Typography>

                                            <Typography
                                                style={{
                                                    fontFamily: "PublicFont",
                                                    textShadow:
                                                        "black -1px 2px 2px",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    marginLeft: " 45px",
                                                    marginTop: "10px",
                                                }}
                                                variant="span"
                                                className="sub-description"
                                            >
                                                APY
                                            </Typography>
                                            <Stack
                                                style={{
                                                    position: "relative",
                                                    top: "18px",
                                                    marginLeft: "12px",
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        fontFamily:
                                                            "PublicFont",
                                                        textShadow:
                                                            "3px 2px 2px black, 3px 2px 0px black",
                                                        fontSize: "10px",
                                                        color: "red",

                                                        // letterSpacing: "1px",
                                                        // fontWeight: "bolder",
                                                        // paddingTop:"30px",
                                                        fontPalette: "dark",
                                                    }}
                                                    variant="span"
                                                    className="sub-description"
                                                >
                                                    {lang_texts[language][9]} $
                                                    {item.stake_token}
                                                </Typography>
                                                <Typography
                                                    variant="span"
                                                    className="value"
                                                    style={{
                                                        fontFamily:
                                                            "PublicFont",
                                                        textShadow:
                                                            "3px 2px 2px black, 3px 2px 0px black",
                                                        fontSize: "10px",
                                                        color: "red",
                                                        // letterSpacing: "2px",
                                                        fontWeight: "bolder",
                                                        fontPalette: "dark",
                                                        paddingTop: "10px",
                                                    }}
                                                >
                                                    {lang_texts[language][8]}{" "}
                                                    &nbsp;$
                                                    {item.stake_token}
                                                </Typography>
                                            </Stack>
                                            <Button
                                                onClick={() =>
                                                    setDisplayInfo(!displayInfo)
                                                }
                                                variant="contained"
                                                disableElevation
                                                style={
                                                    poolState
                                                        ? {
                                                              color: "white",
                                                              position:
                                                                  "absolute",

                                                              background: `url(${StakeClaimButtonMobile})`,

                                                              fontFamily:
                                                                  "EternalUI",
                                                              // letterSpacing: "1px",
                                                              borderRadius:
                                                                  "unset !important",
                                                              //  width:"100%",
                                                              left: "194px",
                                                              top: "60px",
                                                              // height:"10vw",
                                                              width: "100px",
                                                              fontSize: "11px",
                                                          }
                                                        : {
                                                              color: "white",
                                                              position:
                                                                  "absolute",

                                                              background: `url(${StakeClaimButtonMobile})`,

                                                              fontFamily:
                                                                  "EternalUI",
                                                              // letterSpacing: "2px",
                                                              borderRadius:
                                                                  "unset !important",
                                                              //  width:"100%",
                                                              left: "194px",
                                                              top: "60px",
                                                              // height:"10vw",
                                                              width: "100px",
                                                              fontSize: "7px",
                                                          }
                                                }
                                            >
                                                STAKE/CLAIM
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        className="item-1"
                                        style={{
                                            width: "323px",
                                            position: "relative",
                                            margin: "auto",
                                            height: "106px",
                                            marginBottom: "5px",
                                            backgroundImage: `url(${StatusBarMobile})`,
                                        }}
                                    >
                                        <Stack
                                            className="item-2"
                                            spacing={0.75}
                                        >
                                            <Stack
                                                className="help"
                                                direction="row"
                                                spacing={1}
                                                style={{
                                                    fontFamily: "StackFont",
                                                    textShadow:
                                                        "4px 1px 1px black, 4px 2px 1px black",
                                                    fontSize: "20px",
                                                    color: "red",
                                                    // letterSpacing: "3px",
                                                    fontWeight: "bolder",
                                                    marginTop: "-17px",
                                                    // marginLeft: "10px",
                                                }}
                                            >
                                                <Typography
                                                    variant="span"
                                                    className="title"
                                                    style={{
                                                        fontFamily:
                                                            "PublicFont",
                                                        textShadow:
                                                            "black -1px 2px 2px",
                                                        fontSize: "14px",
                                                        color: "red",
                                                        letterSpacing: "1px",
                                                        marginTop: "10px",
                                                        marginLeft: "-9px",
                                                    }}
                                                >
                                                    {lang_texts[language][10]}
                                                </Typography>
                                            </Stack>
                                            <Stack>
                                                <LeftTime
                                                    timeLeft={timeblog}
                                                    device="laptop"
                                                    poolState={poolState}
                                                    loading={loading}
                                                />
                                            </Stack>
                                            <Stack>
                                                <Typography
                                                    variant="span"
                                                    className="title"
                                                    style={{
                                                        fontFamily:
                                                            "PublicFont",
                                                        fontSize: "12px",
                                                        letterSpacing: "3px",
                                                        color: "red",
                                                        textShadow:
                                                            "4px 2px 1px black, 6px 5px 6px black",
                                                        fontWeight: "bold",
                                                        marginTop: "10px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {lang_texts[language][11]}
                                                </Typography>
                                            </Stack>
                                            <Stack>
                                                <Typography
                                                    variant="span"
                                                    className="sub-description"
                                                    style={{
                                                        textShadow:
                                                            "1px 1px 1px black",
                                                        fontFamily:
                                                            "PublicFont",
                                                        fontSize: "14px",
                                                        marginLeft: "-10px",
                                                        letterSpacing: "2px",
                                                        textAlign: "center",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    {totalSupply
                                                        ? numberWithCommas(
                                                              totalSupply
                                                          )
                                                        : 0}{" "}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        className="item-1"
                                        style={{
                                            width: "323px",
                                            position: "relative",
                                            margin: "auto",
                                            height: "106px",
                                            marginBottom: "5px",
                                            backgroundImage: `url(${StatusBarMobile})`,
                                            display: displayInfo
                                                ? "block"
                                                : "none",
                                            paddingTop: "9px",
                                        }}
                                    >
                                        <Stack className="collapse-1">
                                            <Stack className="sub-title pd-0 grid-columns">
                                                <Stack
                                                    className="help"
                                                    direction="row"
                                                    spacing={0}
                                                >
                                                    <Typography
                                                        variant="span"
                                                        className="title text-font"
                                                        alignSelf="flex-start"
                                                        style={{
                                                            fontFamily:
                                                                "EternalUI",
                                                            textShadow:
                                                                "2px 3px 2px black",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {
                                                            lang_texts[
                                                                language
                                                            ][16]
                                                        }
                                                    </Typography>
                                                </Stack>
                                                <Typography
                                                    variant="span"
                                                    className="sub-description text-font"
                                                    alignSelf="flex-start"
                                                    style={{
                                                        fontFamily: "EternalUI",
                                                        textShadow:
                                                            "2px 3px 2px black",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {(() => {
                                                        if (
                                                            Number(
                                                                balance[
                                                                    item
                                                                        .tokenId[0]
                                                                ]
                                                            ) > 0
                                                        ) {
                                                            return `${numberWithCommas(
                                                                customToFixed(
                                                                    new BigNumber(
                                                                        balance[
                                                                            item.tokenId[0]
                                                                        ]
                                                                    ).div(
                                                                        new BigNumber(
                                                                            10
                                                                        ).pow(
                                                                            tokenDecimals.BaseDecimal
                                                                        )
                                                                    ),
                                                                    3
                                                                )
                                                            )} ${
                                                                item.stake_token
                                                            }`;
                                                        } else {
                                                            return `0 ${item.stake_token}`;
                                                        }
                                                    })()}
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                spacing={0}
                                                mb={0}
                                            >
                                                <Stack className="col-row-1">
                                                    <OutlinedInput
                                                        disabled={
                                                            Number(
                                                                balance[
                                                                    item
                                                                        .tokenId[0]
                                                                ]
                                                            ) > 0
                                                                ? false
                                                                : true
                                                        }
                                                        className={
                                                            Number(
                                                                balance[
                                                                    item
                                                                        .tokenId[0]
                                                                ]
                                                            ) > 0
                                                                ? "cal-in mobile-input"
                                                                : "cal-in disabled mobile-input"
                                                        }
                                                        style={{
                                                            width: "214px",
                                                        }}
                                                        placeholder="0"
                                                        value={dv}
                                                        onChange={(e) =>
                                                            setDV(
                                                                e.target.value
                                                            )
                                                        }
                                                        type="number"
                                                        endAdornment={
                                                            <Typography
                                                                onClick={setMax}
                                                                variant="span"
                                                                className={
                                                                    Number(
                                                                        balance[
                                                                            item
                                                                                .tokenId[0]
                                                                        ]
                                                                    ) > 0
                                                                        ? "sub-description c-max"
                                                                        : "sub-description"
                                                                }
                                                            >
                                                                Max
                                                            </Typography>
                                                        }
                                                    />
                                                </Stack>
                                                <Stack
                                                    className={
                                                        Number(
                                                            balance[
                                                                item.tokenId[0]
                                                            ]
                                                        ) > 0 && poolState
                                                            ? "col-row-2"
                                                            : "col-row-2 disabled"
                                                    }
                                                >
                                                    {dloading ? (
                                                        <LoadingButton
                                                            loading
                                                            variant="contained"
                                                            // className="deposit-btn"
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "100px",
                                                                height: "32px",
                                                                left: "6px",
                                                            }}
                                                        ></LoadingButton>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            onClick={deposit}
                                                            disabled={
                                                                Number(
                                                                    balance[
                                                                        item
                                                                            .tokenId[0]
                                                                    ]
                                                                ) > 0
                                                                    ? false
                                                                    : true
                                                            }
                                                            className={
                                                                Number(
                                                                    balance[
                                                                        item
                                                                            .tokenId[0]
                                                                    ]
                                                                ) > 0
                                                                    ? "deposit-btn"
                                                                    : "disabled deposit-btn"
                                                            }
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "100px",
                                                                height: "32px",
                                                                fontFamily:
                                                                    "EternalUI",
                                                                color: "white",
                                                                fontSize:
                                                                    "12px",
                                                                position:
                                                                    "relative",
                                                                left: "6px",
                                                            }}
                                                        >
                                                            {
                                                                lang_texts[
                                                                    language
                                                                ][18]
                                                            }{" "}
                                                            {/* {item.tokenId[0]} */}
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                            <Stack className="sub-title grid-columns">
                                                <Stack
                                                    className="help"
                                                    direction="row"
                                                    spacing={0}
                                                >
                                                    <Typography
                                                        variant="span"
                                                        className="title"
                                                        alignSelf="flex-start"
                                                        style={{
                                                            fontFamily:
                                                                "EternalUI",
                                                            textShadow:
                                                                "2px 3px 2px black",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {
                                                            lang_texts[
                                                                language
                                                            ][17]
                                                        }
                                                    </Typography>
                                                </Stack>

                                                <Typography
                                                    variant="span"
                                                    className="sub-description"
                                                    alignSelf="flex-start"
                                                    style={{
                                                        fontFamily: "EternalUI",
                                                        textShadow:
                                                            "2px 3px 2px black",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {numberWithCommas(
                                                        customToFixed(
                                                            new BigNumber(
                                                                sb
                                                            ).div(
                                                                new BigNumber(
                                                                    10
                                                                ).pow(
                                                                    tokenDecimals.BaseDecimal
                                                                )
                                                            ),
                                                            3
                                                        )
                                                    )}{" "}
                                                    {item.stake_token}
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                spacing={1.25}
                                            >
                                                <Stack className="col-row-1">
                                                    <OutlinedInput
                                                        disabled={
                                                            Number(sb) > 0
                                                                ? false
                                                                : true
                                                        }
                                                        className={
                                                            Number(sb) > 0
                                                                ? "cal-in mobile-input"
                                                                : "cal-in disabled mobile-input"
                                                        }
                                                        placeholder="0"
                                                        value={wv}
                                                        type="number"
                                                        onChange={(e) =>
                                                            setWV(
                                                                e.target.value
                                                            )
                                                        }
                                                        endAdornment={
                                                            <Typography
                                                                onClick={
                                                                    setWmax
                                                                }
                                                                variant="span"
                                                                className={
                                                                    Number(sb) >
                                                                    0
                                                                        ? "sub-description c-max"
                                                                        : "sub-description"
                                                                }
                                                            >
                                                                Max
                                                            </Typography>
                                                        }
                                                    />
                                                </Stack>
                                                <Stack className="col-row-2">
                                                    {wloading ? (
                                                        <LoadingButton
                                                            loading
                                                            variant="contained"
                                                            // className="return-btn"
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "100px",
                                                                height: "32px",
                                                                position:
                                                                    "relative",
                                                                left: "-3px",
                                                                // left: "26px",
                                                            }}
                                                        ></LoadingButton>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            className={
                                                                Number(sb) > 0
                                                                    ? "deposit-btn"
                                                                    : "disabled deposit-btn"
                                                            }
                                                            style={{
                                                                background: `url(${depositWithdraw})`,
                                                                width: "100px",
                                                                height: "32px",
                                                                position:
                                                                    "relative",
                                                                left: "-3px",
                                                                fontFamily:
                                                                    "EternalUI",
                                                                color: "white",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                            onClick={withdraw}
                                                        >
                                                            {
                                                                lang_texts[
                                                                    language
                                                                ][19]
                                                            }{" "}
                                                            {/* {item.tokenId[0]} */}
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        {/* <Stack className="item-2" spacing={0.75}>
                                            <Stack
                                                    className="help"
                                                    direction="row"
                                                    spacing={1}
                                                    style={{
                                                        fontFamily: "StackFont",
                                                        textShadow:
                                                            "4px 1px 1px black, 4px 2px 1px black",
                                                        fontSize: "20px",
                                                        color: "red",
                                                        // letterSpacing: "3px",
                                                        fontWeight: "bolder",
                                                        marginTop: "-17px",
                                                        // marginLeft: "10px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="span"
                                                        className="title"
                                                        style={{
                                                            fontFamily: "PublicFont",
                                                            textShadow: "black -1px 2px 2px",
                                                            fontSize: "14px",
                                                            color: "red",
                                                            letterSpacing: "1px",
                                                            marginTop: "10px",
                                                            marginLeft: "-9px",
                                                        }}
                                                    >
                                                        {lang_texts[language][10]}
                                                    </Typography>
                                                </Stack>
                                                <Stack>
                                                    <LeftTime
                                                        timeLeft={timeblog}
                                                        device="laptop"
                                                        poolState={poolState}
                                                        loading={loading}
                                                    />
                                                </Stack>
                                                <Stack>
                                                    <Typography
                                                        variant="span"
                                                        className="title"
                                                        style={{
                                                            fontFamily: "PublicFont",
                                                            fontSize: "12px",
                                                            letterSpacing: "3px",
                                                            color: "red",
                                                            textShadow:
                                                                "4px 2px 1px black, 6px 5px 6px black",
                                                            fontWeight: "bold",
                                                            marginTop: "-3px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {lang_texts[language][11]}
                                                    </Typography>
                                                </Stack>
                                                <Stack>
                                                    <Typography
                                                        variant="span"
                                                        className="sub-description"
                                                        style={{
                                                            textShadow: "1px 1px 1px black",
                                                            fontFamily: "PublicFont",
                                                            fontSize: "14px",
                                                            marginLeft: "-10px",
                                                            letterSpacing: "2px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {totalSupply
                                                            ? numberWithCommas(totalSupply)
                                                            : 0}{" "}
                                                    </Typography>
                                                </Stack>
                                        </Stack>                                      */}
                                    </Stack>
                                    <Stack
                                        className="item-1"
                                        style={{
                                            width: "323px",
                                            position: "relative",
                                            margin: "auto",
                                            height: "106px",
                                            marginBottom: "5px",
                                            backgroundImage: `url(${StatusBarMobile})`,
                                            display: displayInfo
                                                ? "block"
                                                : "none",
                                            paddingTop: "30px",
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.25}>
                                            <Stack
                                                spacing={1.25}
                                                className="col-row-1"
                                            >
                                                <Typography
                                                    variant="span"
                                                    className="sub-description"
                                                    alignSelf="flex-start"
                                                    style={{
                                                        marginLeft: "21px",
                                                        position: "relative",

                                                        fontFamily: "EternalUI",
                                                        fontSize: "14px",
                                                        textShadow:
                                                            "2px 3px 2px black",

                                                        color: "red",
                                                        fontWeight: "bolder",
                                                    }}
                                                >
                                                    Your Rewards
                                                </Typography>
                                            </Stack>
                                            <Stack className="col-row-2">
                                                <Typography
                                                    variant="span"
                                                    className="sub-description"
                                                    alignSelf="flex-start"
                                                    style={{
                                                        marginLeft: "21px",
                                                        color: "white",
                                                        position: "relative",

                                                        fontFamily: "EternalUI",
                                                        fontSize: "14px",
                                                        textShadow:
                                                            "2px 3px 2px black",
                                                        left: "-50px",
                                                        fontWeight: "bolder",
                                                    }}
                                                >
                                                    {cb} {item.tokenId[0]}
                                                    {/* 30000 DOOM */}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack
                                            style={{
                                                alignItems: "center",
                                                color: "red !important",
                                            }}
                                        >
                                            <Stack>
                                                <Button
                                                    onClick={claim}
                                                    // className="depositWithdraw"
                                                    variant="contained"
                                                    className={
                                                        Number(cb) > 0
                                                            ? " "
                                                            : "disabled"
                                                    }
                                                    style={{
                                                        position: "relative",
                                                        background: `url(${depositWithdraw})`,
                                                        width: "132px",
                                                        height: "32px",
                                                        fontFamily: "EternalUI",
                                                        fontSize: "12px",
                                                        letterSpacing: "2px",
                                                        top: "65%",
                                                        // right: "21px",
                                                        backgroundRadius:
                                                            "unset !important",
                                                        // left: "35%",
                                                        color: "white",
                                                    }}
                                                >
                                                    Claim
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </>
                        );
                    }
                })()}
            </Box>
        </>
    );
};

export default Pool;
