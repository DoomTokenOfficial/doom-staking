import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import useTheme from "@mui/material/styles/useTheme";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cwallet from "./Cwallet";
import DayLogo from "../assets/img/logo.png";
import DarkLogo from "../assets/img/dark-logo.png";
import LogoTitle from "../assets/img/logo-title.png";
import { useWeb3React } from "@web3-react/core";
import useStyles from "../assets/constants/styles";
import { ConnectedWallet } from "../assets/constants/wallets";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ThemeModeContext } from "../context/themmode";
import { Currencys, netId } from "../config/app";
import Link from "@mui/material/Link";
import { Languages, lang_texts } from "../assets/constants/language";
// import { Languages, lang_texts } from "../assets/constants/language";

import { injected } from "../assets/constants/connectors";

const Header = () => {
    const styles = useStyles();
    const theme = useTheme();
    const mode = theme.palette.mode;
    const matches = useMediaQuery("(min-width:800px)");
    const cWallet = ConnectedWallet();

    const [top, setTop] = useState(false);
    const [cy, setCC] = React.useState(null);
    const [lg, setLG] = React.useState(null);
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const currencymenu = Boolean(cy);
    const languagemenu = Boolean(lg);

    const { active, account, chainId, activate } = useWeb3React();
    const { setMode, setCurrency, currency, setLanguage, language } =
        React.useContext(ThemeModeContext);

    const _handleCurrency = (event) => {
        setCC(event.currentTarget);
    };

    const _handleCloseCurrency = (e, s) => {
        if (s === true) {
            setCurrency(e);
        }
        setCC(null);
    };

    const switchNetwork = () => {
        if (window.ethereum) {
            window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: `0x${netId.toString(16)}`,
                        chainName: "Binance Smart Chain",
                        rpcUrls: ["https://bsc-dataseed.binance.org/"],
                        nativeCurrency: {
                            name: "BNB",
                            symbol: "BNB",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://bscscan.com"],
                    },
                ],
            });
        }
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

    const changeNavbarColor = () => {
        if (window.scrollY >= 1) {
            setTop(true);
        } else {
            setTop(false);
        }
    };
    window.addEventListener("scroll", changeNavbarColor);

    useEffect(() => {
        setCC(null);
        setLG(null);
    }, [matches]);

    useEffect(() => {
        if (chainId !== netId) {
            switchNetwork();
            if (!active) {
                activate(injected);
            }
        } else {
            if (!active) {
                activate(injected);
            }
        }
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }} className={styles.appbar}>
            <AppBar position="fixed" className={top ? "top header" : "header"}>
                {matches ? (
                    <Toolbar>
                        {active ? (
                            <Button
                                variant="contained"
                                className="wallet-btn"
                                onClick={() => setIsOpenDialog(true)}
                            >
                                {account.substring(0, 8)} ...{" "}
                                {account.substring(account.length - 4)}
                                <img
                                    className="active-wallet-icon"
                                    src={cWallet.logo}
                                    alt={cWallet.name}
                                />
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                className="wallet-btn"
                                onClick={() => setIsOpenDialog(true)}
                            >
                                {lang_texts[language][0]}
                            </Button>
                        )}
                    </Toolbar>
                ) : (
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Link
                                underline="none"
                                href="https://coinflect.com"
                                target="_blank"
                            >
                                <img
                                    src={
                                        mode === "light" ? LogoTitle : LogoTitle
                                    }
                                    width="100px"
                                    // className="logo"
                                />
                            </Link>
                        </Box>
                        <IconButton onClick={setMode} className="mode-btn">
                            {mode === "light" ? (
                                <svg
                                    width="16"
                                    height="18"
                                    viewBox="0 0 16 18"
                                    fill="none"
                                >
                                    <path
                                        d="M8.63907 16.615C4.3145 16.615 0.800781 13.0771 0.800781 8.73191C0.800781 4.65446 3.83945 1.2813 7.86916 0.885911C7.95516 0.877673 8.03297 0.922978 8.07393 0.997114C8.11078 1.07537 8.0985 1.16598 8.04116 1.22776C6.78802 2.6075 6.10002 4.39499 6.10002 6.26485C6.10002 10.3835 9.43355 13.7361 13.5288 13.7361C13.7704 13.7361 14.0161 13.7237 14.2618 13.699C14.3437 13.6949 14.4256 13.7361 14.4666 13.8102C14.5035 13.8843 14.4912 13.9791 14.4338 14.0408C12.9473 15.6801 10.8341 16.615 8.63907 16.615ZM7.38183 1.36367C3.82716 1.96499 1.20621 5.04573 1.20621 8.73191C1.20621 12.8506 4.53974 16.2031 8.63497 16.2031C10.5393 16.2031 12.378 15.4577 13.754 14.1479C9.33117 14.2838 5.68231 10.6924 5.68231 6.26485C5.6864 4.47324 6.28431 2.75165 7.38183 1.36367Z"
                                        fill={
                                            mode === "light"
                                                ? "#027AFF"
                                                : "#66DC95"
                                        }
                                        stroke={
                                            mode === "light"
                                                ? "#027AFF"
                                                : "#66DC95"
                                        }
                                    />
                                </svg>
                            ) : (
                                <WbSunnyOutlinedIcon fontSize="small" />
                            )}
                        </IconButton>
                        {active ? (
                            <Button
                                variant="contained"
                                className="wallet-btn"
                                onClick={() => setIsOpenDialog(true)}
                            >
                                {account.substring(0, 8)} ...{" "}
                                {account.substring(account.length - 4)}
                                <img
                                    className="active-wallet-icon"
                                    src={cWallet.logo}
                                    alt={cWallet.name}
                                />
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                className="wallet-btn"
                                onClick={() => setIsOpenDialog(true)}
                                endIcon={
                                    <svg
                                        width="12"
                                        height="13"
                                        viewBox="0 0 13 14"
                                        fill="none"
                                    >
                                        <path
                                            d="M6.57113 10.662C6.63458 10.7257 6.68492 10.8014 6.71926 10.8847C6.7536 10.968 6.77127 11.0573 6.77127 11.1475C6.77127 11.2376 6.7536 11.3269 6.71926 11.4102C6.68492 11.4935 6.63458 11.5692 6.57113 11.6329L6.32936 11.8759C5.6583 12.5505 4.74813 12.9294 3.79909 12.9294C2.85004 12.9294 1.93987 12.5505 1.2688 11.876C0.597718 11.2015 0.220708 10.2866 0.220703 9.3327C0.220698 8.37879 0.597698 7.46395 1.26877 6.78943L3.02573 5.02347C3.41734 4.62982 3.89448 4.33287 4.41962 4.15598C4.94475 3.97908 5.50356 3.92707 6.05209 4.00404C6.60061 4.081 7.12389 4.28484 7.58076 4.59952C8.03762 4.9142 8.41562 5.33114 8.68501 5.81754C8.77294 5.9767 8.79439 6.16444 8.74465 6.3395C8.6949 6.51455 8.57802 6.66258 8.41972 6.75105C8.26142 6.83951 8.07464 6.86117 7.90045 6.81125C7.72627 6.76134 7.57893 6.64394 7.49084 6.48487C7.32418 6.18422 7.09041 5.92654 6.80791 5.73206C6.52541 5.53759 6.20188 5.41164 5.86275 5.36411C5.52363 5.31658 5.17816 5.34876 4.85351 5.45813C4.52885 5.5675 4.23386 5.75108 3.99173 5.99443L2.23477 7.76038C2.02913 7.96681 1.86598 8.21195 1.75463 8.48179C1.64328 8.75162 1.58592 9.04087 1.58582 9.33299C1.58573 9.62512 1.64291 9.9144 1.75409 10.1843C1.86527 10.4542 2.02827 10.6995 2.23378 10.906C2.43929 11.1126 2.68328 11.2764 2.95181 11.3882C3.22034 11.4999 3.50814 11.5574 3.79878 11.5573C4.08941 11.5572 4.37718 11.4995 4.64564 11.3876C4.91409 11.2757 5.15798 11.1117 5.36335 10.905L5.60512 10.662C5.66854 10.5982 5.74384 10.5476 5.82671 10.5131C5.90959 10.4786 5.99842 10.4608 6.08813 10.4608C6.17784 10.4608 6.26667 10.4786 6.34954 10.5131C6.43242 10.5476 6.50771 10.5982 6.57113 10.662ZM6.40782 1.62406L6.16605 1.86707C6.03795 1.99583 5.96599 2.17046 5.96599 2.35255C5.96599 2.53464 6.03795 2.70927 6.16606 2.83803C6.29416 2.96678 6.4679 3.03912 6.64906 3.03912C6.83022 3.03912 7.00396 2.96678 7.13206 2.83802L7.37383 2.59502C7.5792 2.38832 7.82309 2.22432 8.09154 2.1124C8.36 2.00047 8.64777 1.94281 8.9384 1.94272C9.22904 1.94262 9.51684 2.00009 9.78537 2.11184C10.0539 2.22358 10.2979 2.38742 10.5034 2.59398C10.7089 2.80055 10.8719 3.04579 10.9831 3.3157C11.0943 3.5856 11.1514 3.87488 11.1514 4.16701C11.1513 4.45914 11.0939 4.74838 10.9826 5.01822C10.8712 5.28805 10.708 5.53319 10.5024 5.73962L8.74545 7.50557C8.50332 7.74893 8.20834 7.93252 7.88368 8.04189C7.55902 8.15127 7.21355 8.18346 6.87442 8.13593C6.5353 8.08839 6.21176 7.96244 5.92926 7.76796C5.64676 7.57348 5.41299 7.31579 5.24634 7.01513C5.15825 6.85606 5.01091 6.73866 4.83673 6.68875C4.66254 6.63883 4.47577 6.66049 4.31746 6.74895C4.15916 6.83742 4.04228 6.98545 3.99254 7.1605C3.94279 7.33556 3.96424 7.5233 4.05218 7.68246C4.32157 8.16886 4.69957 8.58579 5.15643 8.90047C5.6133 9.21514 6.13657 9.41898 6.6851 9.49594C7.23362 9.57291 7.79243 9.5209 8.31756 9.34401C8.8427 9.16712 9.31984 8.87017 9.71146 8.47653L11.4684 6.71057C12.1395 6.03605 12.5165 5.12121 12.5165 4.1673C12.5165 3.21338 12.1395 2.29854 11.4684 1.62403C10.7973 0.949517 9.88714 0.570582 8.9381 0.570587C7.98906 0.570592 7.07889 0.949537 6.40782 1.62406Z"
                                            fill={
                                                mode === "light"
                                                    ? "white"
                                                    : "black"
                                            }
                                            strokeWidth="0.3"
                                        />
                                    </svg>
                                }
                            >
                                {lang_texts[language][1]}
                            </Button>
                        )}
                    </Toolbar>
                )}
                <Box
                    sx={{ flexGrow: 1 }}
                    style={{ position: "absolute", zIndex: "-1000000" }}
                >
                    <Link underline="none" href="/" target="_blank">
                        <img
                            src={DayLogo}
                            style={{
                                marginTop: "20px",
                                width: "7%",
                                position: "relative",
                                // top: "-6px",
                            }}
                        />
                    </Link>
                    <img
                        style={{
                            width: "27.2%",
                            position: "relative",
                            top: "-54px",
                        }}
                        src={mode === "light" ? LogoTitle : LogoTitle}
                    />
                </Box>
            </AppBar>
            <Cwallet isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
        </Box>
    );
};

export default Header;
