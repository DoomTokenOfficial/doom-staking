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
                        chainId: `1`,
                        chainName: "Ethereum Mainnet",
                        rpcUrls: ["https://mainnet.infura.io/v3/"],
                        nativeCurrency: {
                            name: "ETH",
                            symbol: "ETH",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://etherscan.io/"],
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
                            {lang_texts[language][1]}
                        </Button>
                    )}
                </Toolbar>

                <Box
                    sx={{ flexGrow: 1 }}
                    style={{ position: "absolute", zIndex: "-1000000" }}
                >
                    <Link underline="none" href="/" target="_blank">
                        <img
                            src={DayLogo}
                            style={
                                matches
                                    ? {
                                          marginTop: "20px",
                                          width: "7%",
                                          position: "relative",
                                          // top: "-6px",
                                      }
                                    : {
                                          marginTop: "20px",
                                          width: "13%",
                                          position: "relative",
                                      }
                            }
                        />
                    </Link>
                    <img
                        style={
                            matches
                                ? {
                                      width: "27.2%",
                                      position: "relative",
                                      top: "-54px",
                                  }
                                : {
                                      width: "66%",
                                      position: "relative",
                                      top: "24px",
                                      left: "1%",
                                  }
                        }
                        src={LogoTitle}
                    />
                </Box>
            </AppBar>
            <Cwallet isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
        </Box>
    );
};

export default Header;
