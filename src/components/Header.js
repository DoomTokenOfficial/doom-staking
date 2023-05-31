import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import useTheme from '@mui/material/styles/useTheme';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';

import Cwallet from './Cwallet';
import DayLogo from "../assets/img/logo.png";
import DarkLogo from "../assets/img/dark-logo.png";
import { useWeb3React } from '@web3-react/core';
import useStyles from "../assets/constants/styles";
import { ConnectedWallet } from "../assets/constants/wallets";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ThemeModeContext } from "../context/themmode"
import { Currencys, netId } from '../config/app';
import Link from '@mui/material/Link';
import { Languages, lang_texts } from '../assets/constants/language';
import { injected } from '../assets/constants/connectors';

const Header = () => {
    const styles = useStyles();
    const theme = useTheme();
    const mode = theme.palette.mode;
    const matches = useMediaQuery('(min-width:800px)');
    const cWallet = ConnectedWallet();

    const [top, setTop] = useState(false)
    const [cy, setCC] = React.useState(null);
    const [lg, setLG] = React.useState(null);
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const currencymenu = Boolean(cy);
    const languagemenu = Boolean(lg);

    const { active, account, chainId, activate } = useWeb3React();
    const { setMode, setCurrency, currency, setLanguage, language } = React.useContext(ThemeModeContext)

    const _handleCurrency = (event) => {
        setCC(event.currentTarget);
    };

    const _handleCloseCurrency = (e, s) => {
        if (s === true) {
            setCurrency(e);
        };
        setCC(null);
    };

    const switchNetwork = () => {
        if (window.ethereum) {
            window.ethereum
                .request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: `0x${netId.toString(16)}`,
                            chainName: "Binance Smart Chain",
                            rpcUrls: [
                                "https://bsc-dataseed.binance.org/",
                            ],
                            nativeCurrency: {
                                name: "BNB",
                                symbol: "BNB",
                                decimals: 18,
                            },
                            blockExplorerUrls: [
                                "https://bscscan.com",
                            ],
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
        };
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
        setCC(null)
        setLG(null)
    }, [matches])

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
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }} className={styles.appbar}>
            <AppBar position="fixed" className={top ? "top header" : "header"}>
                {
                    matches ?
                        <Toolbar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Link underline="none" href="https://coinflect.com" target="_blank">
                                    <img src={mode === "light" ? DayLogo : DarkLogo} className="logo" />
                                </Link>
                            </Box>
                            <Button
                                id="demo-customized-button"
                                aria-controls="demo-customized-menu"
                                aria-haspopup="true"
                                aria-expanded={currencymenu ? 'true' : undefined}
                                variant="text"
                                onClick={_handleCurrency}
                                startIcon={
                                    <svg width="16" height="14" viewBox="0 0 17 14" fill="none">
                                        <path d="M6.12772 0.479248C4.78797 0.479248 3.57115 0.734134 2.67806 1.16062C1.81061 1.57455 1.22178 2.16693 1.18927 2.86747C1.18927 2.87386 1.18286 2.87386 1.18286 2.88025V2.88664C1.17645 2.89941 1.17645 2.91858 1.17645 2.93752V4.90565C1.17645 4.91842 1.17645 4.92481 1.17645 4.93759V7.03305C1.17645 7.03944 1.17645 7.05221 1.17645 7.05838V8.98816C1.17645 9.71449 1.77833 10.3256 2.67165 10.7589C3.57138 11.1856 4.78819 11.4403 6.12794 11.4403C6.63298 11.4403 7.11833 11.4019 7.57782 11.3319C8.4194 12.3891 9.72023 13.0643 11.1767 13.0643C13.7205 13.0643 15.7853 11.0008 15.7853 8.46607C15.7853 5.92474 13.7205 3.86123 11.1767 3.86123H11.0668V2.93752C11.0733 2.91858 11.0668 2.89941 11.0668 2.88664C11.0668 2.88025 11.0668 2.88025 11.0668 2.87386C11.0604 2.87386 11.0604 2.86747 11.0604 2.86108C11.0217 2.1667 10.4327 1.57432 9.57187 1.16039C8.67146 0.734135 7.46747 0.479248 6.12772 0.479248ZM6.12772 0.842296C7.41596 0.842296 8.58103 1.09718 9.40956 1.49218C10.2186 1.88055 10.6845 2.39033 10.704 2.90603C10.704 2.91219 10.704 2.91881 10.704 2.92497C10.704 2.93136 10.704 2.93136 10.704 2.93775C10.704 3.30719 10.4709 3.68301 10.0373 4.00773C10.0373 4.01411 10.0309 4.00773 10.0309 4.00773C9.47412 4.15422 8.9629 4.3961 8.50983 4.71465C7.81065 4.91204 7.00158 5.0332 6.12772 5.0332C4.83329 5.0332 3.66181 4.78471 2.83306 4.38332C2.05627 4.01411 1.59701 3.5299 1.54504 3.03952V2.93752C1.54504 2.91858 1.53863 2.9058 1.53863 2.89302C1.5645 2.38371 2.02421 1.88032 2.83306 1.49195C3.66159 1.09718 4.83307 0.842296 6.12772 0.842296ZM10.704 3.86739V3.88656H10.6845C10.6909 3.88017 10.6976 3.87401 10.704 3.86739ZM1.54504 3.87401C1.80397 4.19872 2.19866 4.48555 2.67783 4.71465C3.57093 5.14136 4.78797 5.39625 6.12749 5.39625C6.74906 5.39625 7.3443 5.34514 7.89467 5.23698C7.40932 5.73374 7.03386 6.33251 6.81362 7.0011C6.5872 7.02027 6.35414 7.03305 6.12131 7.03305C4.82666 7.03305 3.66159 6.78455 2.83306 6.38339C2.00475 5.98863 1.54504 5.46608 1.54504 4.93759C1.54504 4.9312 1.54504 4.92481 1.54504 4.91842V3.87401ZM11.1763 4.22428C13.5261 4.22428 15.4224 6.12212 15.4224 8.46607C15.4224 10.8098 13.5261 12.7076 11.1763 12.7076C8.83332 12.7076 6.93656 10.8098 6.93656 8.46607C6.93679 6.12212 8.83332 4.22428 11.1763 4.22428ZM1.54504 5.88024C1.80397 6.20495 2.19866 6.48517 2.67142 6.7145C3.56452 7.14121 4.78155 7.38971 6.12131 7.38971C6.32186 7.38971 6.50959 7.38332 6.70373 7.37054C6.61971 7.72081 6.57438 8.09001 6.57438 8.46607C6.57438 8.6954 6.58743 8.92473 6.61971 9.14105C6.45785 9.15383 6.28958 9.16022 6.12131 9.16022C4.82666 9.16022 3.66159 8.90556 2.83306 8.51057C2.00475 8.1158 1.54504 7.58709 1.54504 7.05838C1.54504 7.05221 1.54504 7.0456 1.54504 7.0456V5.88024ZM1.54504 8.00102C1.80397 8.32596 2.19866 8.60618 2.67142 8.83528C3.56452 9.26199 4.78155 9.51688 6.12131 9.51688C6.31545 9.51688 6.49677 9.51688 6.68427 9.50387C6.81362 10.0454 7.03386 10.5547 7.33789 11.0008C6.94961 11.0517 6.54828 11.0834 6.12749 11.0834C4.83307 11.0834 3.66159 10.8351 2.83283 10.4337C2.00452 10.039 1.54482 9.51665 1.54482 8.98794L1.54504 8.00102Z" fill={mode === "light" ? "#027AFF" : "#66DC95"} stroke={mode === "light" ? "#027AFF" : "#66DC95"} strokeWidth="0.8" />
                                    </svg>
                                }
                                endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                                className="headerbar-drop-button"
                            >
                                {currency}
                            </Button>
                            <Menu
                                elevation={0}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                id="demo-customized-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                className={styles.currencymenu}
                                anchorEl={cy}
                                open={currencymenu}
                                onClose={_handleCloseCurrency}
                            >
                                {
                                    Currencys.map((item, key) => (
                                        <MenuItem key={key} onClick={() => _handleCloseCurrency(item, true)} disableRipple>
                                            {item}
                                        </MenuItem>
                                    ))
                                }
                            </Menu>
                            <Button
                                id="demo-customized-button"
                                aria-controls="demo-customized-menu"
                                aria-haspopup="true"
                                aria-expanded={languagemenu ? 'true' : undefined}
                                variant="text"
                                onClick={_handleLanguage}
                                startIcon={
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.6973 10.1961C13.3064 9.20741 13.6281 8.06972 13.6265 6.90971L13.6265 6.9096L13.6265 6.90949C13.6281 5.74946 13.3064 4.61176 12.6973 3.62311L12.6938 3.61772C12.1287 2.70012 11.3368 1.94222 10.3938 1.41645C9.45083 0.890676 8.38826 0.614598 7.30764 0.614594C6.22701 0.614589 5.16444 0.890658 4.22146 1.41642C3.27847 1.94219 2.48658 2.70008 1.92145 3.61767L1.91794 3.62314C1.31032 4.61247 0.988774 5.74976 0.98877 6.90958C0.988765 8.0694 1.3103 9.2067 1.91792 10.196L1.92149 10.2016C2.48662 11.1192 3.27851 11.877 4.22149 12.4028C5.16447 12.9285 6.22703 13.2046 7.30764 13.2046C8.38825 13.2046 9.45081 12.9285 10.3938 12.4028C11.3368 11.877 12.1286 11.1191 12.6938 10.2015L12.6973 10.1961ZM8.11531 12.1257C7.9949 12.2415 7.85631 12.3368 7.70502 12.408C7.58085 12.4668 7.44509 12.4973 7.30761 12.4973C7.17013 12.4973 7.03438 12.4668 6.9102 12.408C6.6223 12.2615 6.37586 12.0455 6.19339 11.7796C5.82074 11.2432 5.54458 10.6462 5.37725 10.0155C6.02005 9.97609 6.66351 9.95602 7.30762 9.95528C7.95146 9.95528 8.59495 9.97536 9.23809 10.0155C9.14547 10.3398 9.02978 10.6571 8.8919 10.965C8.71034 11.3981 8.44666 11.7922 8.11531 12.1257V12.1257ZM1.71111 7.26325H4.2598C4.2764 7.97175 4.35348 8.67755 4.49023 9.37302C3.79351 9.4341 3.09858 9.51799 2.40542 9.62468C1.99952 8.89922 1.76225 8.09224 1.71111 7.26325V7.26325ZM2.40542 4.19451C3.0983 4.30148 3.79348 4.38538 4.49096 4.44623C4.35394 5.14165 4.27669 5.84745 4.26003 6.55595H1.71111C1.76225 5.72696 1.99952 4.91998 2.40542 4.19451H2.40542ZM6.49992 1.69347C6.62032 1.57772 6.75891 1.48236 6.9102 1.41116C7.03438 1.35239 7.17013 1.32189 7.30761 1.32189C7.44509 1.32189 7.58085 1.35239 7.70502 1.41116C7.99292 1.55767 8.23937 1.77372 8.42184 2.03958C8.79448 2.57603 9.07064 3.17296 9.23797 3.80369C8.59516 3.84309 7.95171 3.86317 7.30762 3.86391C6.66378 3.8639 6.02028 3.84382 5.37713 3.80368C5.46976 3.47939 5.58545 3.16208 5.72333 2.85417C5.90488 2.42113 6.16856 2.02703 6.49992 1.69347V1.69347ZM12.9041 6.55595H10.3554C10.3388 5.84745 10.2617 5.14164 10.125 4.44617C10.8217 4.38509 11.5167 4.3012 12.2098 4.19451C12.6157 4.91998 12.853 5.72696 12.9041 6.55595ZM5.2043 9.31803C5.06546 8.64134 4.98704 7.95373 4.96997 7.26325H9.64534C9.62842 7.95372 9.55015 8.64135 9.41143 9.31806C8.71092 9.27226 8.00965 9.2489 7.30762 9.24799C6.60609 9.24798 5.90498 9.27133 5.2043 9.31803ZM9.41092 4.50115C9.54976 5.17785 9.62818 5.86547 9.64525 6.55595H4.96989C4.9868 5.86547 5.06508 5.17784 5.2038 4.50112C5.9043 4.54691 6.60557 4.57027 7.30762 4.57121C8.00915 4.57121 8.71025 4.54786 9.41092 4.50116V4.50115ZM10.3552 7.26325H12.9041C12.853 8.09224 12.6157 8.89922 12.2098 9.62468C11.5169 9.5177 10.8217 9.4338 10.1243 9.37296C10.2613 8.67754 10.3385 7.97175 10.3552 7.26325ZM11.7841 3.54351C11.1783 3.63058 10.5707 3.69952 9.96126 3.75032C9.85173 3.34406 9.71046 2.94696 9.53876 2.56264C9.38199 2.20899 9.18474 1.87456 8.95092 1.56601C10.0809 1.91125 11.0725 2.60336 11.7841 3.54351ZM3.34153 2.95848C3.98974 2.31211 4.7872 1.83401 5.66401 1.5661C5.65071 1.58326 5.63703 1.59966 5.62391 1.61718C5.17323 2.26351 4.84495 2.98648 4.65526 3.75043C4.0458 3.69901 3.43775 3.63003 2.83111 3.54351C2.98757 3.33705 3.15811 3.14158 3.34153 2.95848V2.95848ZM2.83111 10.2757C3.43691 10.1886 4.04453 10.1197 4.65396 10.0689C4.76349 10.4751 4.90476 10.8722 5.07647 11.2565C5.23323 11.6102 5.43049 11.9446 5.66431 12.2532C4.53432 11.9079 3.54272 11.2158 2.83111 10.2757V10.2757ZM11.2737 10.8607C10.6255 11.5071 9.82803 11.9852 8.95121 12.2531C8.96452 12.2359 8.97819 12.2195 8.99131 12.202C9.442 11.5557 9.77028 10.8327 9.95997 10.0688C10.5694 10.1202 11.1775 10.1892 11.7841 10.2757C11.6277 10.4821 11.4571 10.6776 11.2737 10.8607V10.8607Z" fill={mode === "light" ? "#027AFF" : "#66DC95"} stroke={mode === "light" ? "#027AFF" : "#66DC95"} strokeWidth="0.35" />
                                    </svg>
                                }
                                endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                                className="headerbar-drop-button"
                            >
                                {Languages[language]}
                            </Button>
                            <Menu
                                elevation={0}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                className={styles.languagemenu}
                                id="demo-customized-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={lg}
                                open={languagemenu}
                                onClose={_handleCloseLanguage}
                            >
                                {
                                    Object.keys(Languages).map((key, i) => (
                                        <MenuItem key={i} onClick={() => _handleCloseLanguage(key, true)} disableRipple>
                                            {Languages[key]}
                                        </MenuItem>
                                    ))
                                }
                            </Menu>
                            <IconButton
                                onClick={setMode}
                                className="mode-btn"
                            >
                                {
                                    mode === "light" ?
                                        <svg width="15" height="17" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.63907 16.615C4.3145 16.615 0.800781 13.0771 0.800781 8.73191C0.800781 4.65446 3.83945 1.2813 7.86916 0.885911C7.95516 0.877673 8.03297 0.922978 8.07393 0.997114C8.11078 1.07537 8.0985 1.16598 8.04116 1.22776C6.78802 2.6075 6.10002 4.39499 6.10002 6.26485C6.10002 10.3835 9.43355 13.7361 13.5288 13.7361C13.7704 13.7361 14.0161 13.7237 14.2618 13.699C14.3437 13.6949 14.4256 13.7361 14.4666 13.8102C14.5035 13.8843 14.4912 13.9791 14.4338 14.0408C12.9473 15.6801 10.8341 16.615 8.63907 16.615ZM7.38183 1.36367C3.82716 1.96499 1.20621 5.04573 1.20621 8.73191C1.20621 12.8506 4.53974 16.2031 8.63497 16.2031C10.5393 16.2031 12.378 15.4577 13.754 14.1479C9.33117 14.2838 5.68231 10.6924 5.68231 6.26485C5.6864 4.47324 6.28431 2.75165 7.38183 1.36367Z" fill={mode === "light" ? "#027AFF" : "#66DC95"} stroke={mode === "light" ? "#027AFF" : "#66DC95"} />
                                        </svg>
                                        :
                                        <WbSunnyOutlinedIcon fontSize="small" />
                                }
                            </IconButton>
                            {
                                active ?
                                    <Button
                                        variant="contained"
                                        className="wallet-btn"
                                        onClick={() => setIsOpenDialog(true)}
                                    >
                                        {account.substring(0, 8)} ... {account.substring(account.length - 4)}
                                        <img className="active-wallet-icon" src={cWallet.logo} alt={cWallet.name} />
                                    </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        className="wallet-btn"
                                        onClick={() => setIsOpenDialog(true)}
                                        endIcon={
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                <path d="M6.57113 10.2721C6.63458 10.3359 6.68492 10.4115 6.71926 10.4948C6.7536 10.5781 6.77127 10.6674 6.77127 10.7576C6.77127 10.8478 6.7536 10.937 6.71926 11.0203C6.68492 11.1036 6.63458 11.1793 6.57113 11.2431L6.32936 11.4861C5.6583 12.1606 4.74813 12.5395 3.79909 12.5396C2.85004 12.5396 1.93987 12.1606 1.2688 11.4861C0.597718 10.8116 0.220708 9.89675 0.220703 8.94284C0.220698 7.98893 0.597698 7.07409 1.26877 6.39957L3.02573 4.63361C3.41734 4.23996 3.89448 3.94301 4.41962 3.76611C4.94475 3.58922 5.50356 3.53721 6.05209 3.61417C6.60061 3.69114 7.12389 3.89498 7.58076 4.20966C8.03762 4.52434 8.41562 4.94128 8.68501 5.42767C8.77294 5.58683 8.79439 5.77458 8.74465 5.94964C8.6949 6.12469 8.57802 6.27272 8.41972 6.36119C8.26142 6.44965 8.07464 6.47131 7.90045 6.42139C7.72627 6.37148 7.57893 6.25408 7.49084 6.095C7.32418 5.79436 7.09041 5.53667 6.80791 5.3422C6.52541 5.14773 6.20188 5.02178 5.86275 4.97425C5.52363 4.92672 5.17816 4.9589 4.85351 5.06827C4.52885 5.17764 4.23386 5.36122 3.99173 5.60456L2.23477 7.37052C2.02913 7.57695 1.86598 7.82209 1.75463 8.09193C1.64328 8.36176 1.58592 8.65101 1.58582 8.94313C1.58573 9.23526 1.64291 9.52454 1.75409 9.79445C1.86527 10.0644 2.02827 10.3096 2.23378 10.5162C2.43929 10.7227 2.68328 10.8866 2.95181 10.9983C3.22034 11.1101 3.50814 11.1675 3.79878 11.1674C4.08941 11.1673 4.37718 11.1097 4.64564 10.9977C4.91409 10.8858 5.15798 10.7218 5.36335 10.5151L5.60512 10.2721C5.66854 10.2083 5.74384 10.1578 5.82671 10.1232C5.90959 10.0887 5.99842 10.071 6.08813 10.071C6.17784 10.071 6.26667 10.0887 6.34954 10.1232C6.43242 10.1578 6.50771 10.2083 6.57113 10.2721ZM6.40782 1.2342L6.16605 1.47721C6.03795 1.60596 5.96599 1.7806 5.96599 1.96269C5.96599 2.14478 6.03795 2.31941 6.16606 2.44817C6.29416 2.57692 6.4679 2.64926 6.64906 2.64926C6.83022 2.64926 7.00396 2.57692 7.13206 2.44816L7.37383 2.20515C7.5792 1.99846 7.82309 1.83446 8.09154 1.72253C8.36 1.61061 8.64777 1.55295 8.9384 1.55286C9.22904 1.55276 9.51684 1.61023 9.78537 1.72197C10.0539 1.83372 10.2979 1.99756 10.5034 2.20412C10.7089 2.41068 10.8719 2.65593 10.9831 2.92583C11.0943 3.19574 11.1514 3.48502 11.1514 3.77715C11.1513 4.06927 11.0939 4.35852 10.9826 4.62835C10.8712 4.89819 10.708 5.14333 10.5024 5.34976L8.74545 7.11571C8.50332 7.35907 8.20834 7.54265 7.88368 7.65203C7.55902 7.76141 7.21355 7.7936 6.87442 7.74606C6.5353 7.69853 6.21176 7.57258 5.92926 7.3781C5.64676 7.18362 5.41299 6.92592 5.24634 6.62527C5.15825 6.4662 5.01091 6.3488 4.83673 6.29888C4.66254 6.24897 4.47577 6.27062 4.31746 6.35909C4.15916 6.44755 4.04228 6.59559 3.99254 6.77064C3.94279 6.94569 3.96424 7.13344 4.05218 7.2926C4.32157 7.77899 4.69957 8.19593 5.15643 8.5106C5.6133 8.82528 6.13657 9.02912 6.6851 9.10608C7.23362 9.18304 7.79243 9.13104 8.31756 8.95415C8.8427 8.77726 9.31984 8.48031 9.71146 8.08667L11.4684 6.32071C12.1395 5.64619 12.5165 4.73134 12.5165 3.77743C12.5165 2.82352 12.1395 1.90868 11.4684 1.23417C10.7973 0.559655 9.88714 0.18072 8.9381 0.180725C7.98906 0.18073 7.07889 0.559675 6.40782 1.2342Z" fill={mode === "light" ? "white" : "black"} />
                                            </svg>
                                        }
                                    >
                                        {lang_texts[language][0]}
                                    </Button>
                            }

                        </Toolbar>
                        :
                        <Toolbar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Link underline="none" href="https://coinflect.com" target="_blank">
                                    <img src={mode === "light" ? DayLogo : DarkLogo} className="logo" />
                                </Link>
                            </Box>
                            <IconButton
                                onClick={setMode}
                                className="mode-btn"
                            >
                                {
                                    mode === "light" ?
                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                                            <path d="M8.63907 16.615C4.3145 16.615 0.800781 13.0771 0.800781 8.73191C0.800781 4.65446 3.83945 1.2813 7.86916 0.885911C7.95516 0.877673 8.03297 0.922978 8.07393 0.997114C8.11078 1.07537 8.0985 1.16598 8.04116 1.22776C6.78802 2.6075 6.10002 4.39499 6.10002 6.26485C6.10002 10.3835 9.43355 13.7361 13.5288 13.7361C13.7704 13.7361 14.0161 13.7237 14.2618 13.699C14.3437 13.6949 14.4256 13.7361 14.4666 13.8102C14.5035 13.8843 14.4912 13.9791 14.4338 14.0408C12.9473 15.6801 10.8341 16.615 8.63907 16.615ZM7.38183 1.36367C3.82716 1.96499 1.20621 5.04573 1.20621 8.73191C1.20621 12.8506 4.53974 16.2031 8.63497 16.2031C10.5393 16.2031 12.378 15.4577 13.754 14.1479C9.33117 14.2838 5.68231 10.6924 5.68231 6.26485C5.6864 4.47324 6.28431 2.75165 7.38183 1.36367Z" fill={mode === "light" ? "#027AFF" : "#66DC95"} stroke={mode === "light" ? "#027AFF" : "#66DC95"} />
                                        </svg>
                                        :
                                        <WbSunnyOutlinedIcon fontSize="small" />
                                }
                            </IconButton>
                            {
                                active ?
                                    <Button
                                        variant="contained"
                                        className="wallet-btn"
                                        onClick={() => setIsOpenDialog(true)}
                                    >
                                        {account.substring(0, 8)} ... {account.substring(account.length - 4)}
                                        <img className="active-wallet-icon" src={cWallet.logo} alt={cWallet.name} />
                                    </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        className="wallet-btn"
                                        onClick={() => setIsOpenDialog(true)}
                                        endIcon={
                                            <svg width="12" height="13" viewBox="0 0 13 14" fill="none">
                                                <path d="M6.57113 10.662C6.63458 10.7257 6.68492 10.8014 6.71926 10.8847C6.7536 10.968 6.77127 11.0573 6.77127 11.1475C6.77127 11.2376 6.7536 11.3269 6.71926 11.4102C6.68492 11.4935 6.63458 11.5692 6.57113 11.6329L6.32936 11.8759C5.6583 12.5505 4.74813 12.9294 3.79909 12.9294C2.85004 12.9294 1.93987 12.5505 1.2688 11.876C0.597718 11.2015 0.220708 10.2866 0.220703 9.3327C0.220698 8.37879 0.597698 7.46395 1.26877 6.78943L3.02573 5.02347C3.41734 4.62982 3.89448 4.33287 4.41962 4.15598C4.94475 3.97908 5.50356 3.92707 6.05209 4.00404C6.60061 4.081 7.12389 4.28484 7.58076 4.59952C8.03762 4.9142 8.41562 5.33114 8.68501 5.81754C8.77294 5.9767 8.79439 6.16444 8.74465 6.3395C8.6949 6.51455 8.57802 6.66258 8.41972 6.75105C8.26142 6.83951 8.07464 6.86117 7.90045 6.81125C7.72627 6.76134 7.57893 6.64394 7.49084 6.48487C7.32418 6.18422 7.09041 5.92654 6.80791 5.73206C6.52541 5.53759 6.20188 5.41164 5.86275 5.36411C5.52363 5.31658 5.17816 5.34876 4.85351 5.45813C4.52885 5.5675 4.23386 5.75108 3.99173 5.99443L2.23477 7.76038C2.02913 7.96681 1.86598 8.21195 1.75463 8.48179C1.64328 8.75162 1.58592 9.04087 1.58582 9.33299C1.58573 9.62512 1.64291 9.9144 1.75409 10.1843C1.86527 10.4542 2.02827 10.6995 2.23378 10.906C2.43929 11.1126 2.68328 11.2764 2.95181 11.3882C3.22034 11.4999 3.50814 11.5574 3.79878 11.5573C4.08941 11.5572 4.37718 11.4995 4.64564 11.3876C4.91409 11.2757 5.15798 11.1117 5.36335 10.905L5.60512 10.662C5.66854 10.5982 5.74384 10.5476 5.82671 10.5131C5.90959 10.4786 5.99842 10.4608 6.08813 10.4608C6.17784 10.4608 6.26667 10.4786 6.34954 10.5131C6.43242 10.5476 6.50771 10.5982 6.57113 10.662ZM6.40782 1.62406L6.16605 1.86707C6.03795 1.99583 5.96599 2.17046 5.96599 2.35255C5.96599 2.53464 6.03795 2.70927 6.16606 2.83803C6.29416 2.96678 6.4679 3.03912 6.64906 3.03912C6.83022 3.03912 7.00396 2.96678 7.13206 2.83802L7.37383 2.59502C7.5792 2.38832 7.82309 2.22432 8.09154 2.1124C8.36 2.00047 8.64777 1.94281 8.9384 1.94272C9.22904 1.94262 9.51684 2.00009 9.78537 2.11184C10.0539 2.22358 10.2979 2.38742 10.5034 2.59398C10.7089 2.80055 10.8719 3.04579 10.9831 3.3157C11.0943 3.5856 11.1514 3.87488 11.1514 4.16701C11.1513 4.45914 11.0939 4.74838 10.9826 5.01822C10.8712 5.28805 10.708 5.53319 10.5024 5.73962L8.74545 7.50557C8.50332 7.74893 8.20834 7.93252 7.88368 8.04189C7.55902 8.15127 7.21355 8.18346 6.87442 8.13593C6.5353 8.08839 6.21176 7.96244 5.92926 7.76796C5.64676 7.57348 5.41299 7.31579 5.24634 7.01513C5.15825 6.85606 5.01091 6.73866 4.83673 6.68875C4.66254 6.63883 4.47577 6.66049 4.31746 6.74895C4.15916 6.83742 4.04228 6.98545 3.99254 7.1605C3.94279 7.33556 3.96424 7.5233 4.05218 7.68246C4.32157 8.16886 4.69957 8.58579 5.15643 8.90047C5.6133 9.21514 6.13657 9.41898 6.6851 9.49594C7.23362 9.57291 7.79243 9.5209 8.31756 9.34401C8.8427 9.16712 9.31984 8.87017 9.71146 8.47653L11.4684 6.71057C12.1395 6.03605 12.5165 5.12121 12.5165 4.1673C12.5165 3.21338 12.1395 2.29854 11.4684 1.62403C10.7973 0.949517 9.88714 0.570582 8.9381 0.570587C7.98906 0.570592 7.07889 0.949537 6.40782 1.62406Z" fill={mode === "light" ? "white" : "black"} strokeWidth="0.3" />
                                            </svg>
                                        }
                                    >
                                        {lang_texts[language][1]}
                                    </Button>
                            }

                        </Toolbar>
                }
            </AppBar>
            <Cwallet isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
        </Box>
    );
}

export default Header;