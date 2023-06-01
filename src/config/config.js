export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const customToFixed = (x, len) => {
    if (x.toString().indexOf(".") > 0) {
        return x.toString().slice(0, x.toString().indexOf(".") + (len + 1));
    } else {
        return x;
    }
};

export const toDec = (val, decimal, fix) => {
    if (fix !== null && fix !== undefined) {
        return (val / 10 ** decimal).toFixed(fix);
    } else {
        return val / 10 ** decimal;
    }
};

export const secsForYear = 60 * 60 * 24 * 365;
export const secsPerDay = 60 * 60 * 24;

export const setInit = (d) => {
    let arr = [];
    for (let i = 0; i < d.length; i++) {
        arr[i] = 0;
    }
    return arr;
};

const modifyTime = (t, s) => {
    if ((t === 60 || t === "60") && !s) {
        return "00";
    }
    return t < 10 ? `0${t}` : t;
};

export const toTimes = (dt1, dt2) => {
    let delta = Math.abs(dt1 - dt2);
    let leftSecs = delta.toFixed(0);
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;
    seconds = toDec(seconds, 0, 0);
    return {
        days: modifyTime(days, true),
        hours: modifyTime(hours),
        minutes: modifyTime(minutes),
        seconds: modifyTime(seconds),
        leftSecs,
    };
};

export const claimTime = (dt, cycle) => {
    let delta = Math.abs(new Date() / 1000 - dt);
    delta = Math.abs((delta % cycle).toFixed(0));
    if (delta === 0) {
        return false;
    }
    delta = Math.abs(delta - cycle);
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;
    seconds = toDec(seconds, 0, 0);
    return {
        hours: modifyTime(hours),
        minutes: modifyTime(minutes),
        seconds: modifyTime(seconds),
    };
};

export const CurrencySymbol = {
    USD: "$",
    CAD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    BRL: "R$",
    IDR: "Rp",
    ETB: "ብር",
    NGN: "₦",
    INR: "₹",
    VND: "₫",
};

export const baseCurrency = {
    CFLT: {
        USD: 0.00001735,
        CAD: 0.00002088,
        EUR: 0.00001445,
        GBP: 0.00001231,
        JPY: 0.001846,
        CNY: 0.0001039,
        BRL: 0.00009212,
        IDR: 0.2353,
        ETB: 0.00079,
        NGN: 0.006701,
        INR: 0.001227,
        VND: 0.3759,
    },
    AER: {
        USD: 0.001154,
        CAD: 0.001471,
        EUR: 0.001019,
        GBP: 0.000868,
        JPY: 0.1304,
        CNY: 0.007343,
        BRL: 0.006509,
        IDR: 16.64,
        ETB: 0.056,
        NGN: 0.4721,
        INR: 0.0865,
        VND: 26.41,
    },
    FCF: {
        USD: 0.000188,
        CAD: 0.0002404,
        EUR: 0.0001664,
        GBP: 0.0001417,
        JPY: 0.02129,
        CNY: 0.001199,
        BRL: 0.001063,
        IDR: 2.71,
        ETB: 0.009,
        NGN: 0.07725,
        INR: 0.01415,
        VND: 4.32,
    },
    PFT: {
        USD: 0.00000139,
        CAD: 0.0000018,
        EUR: 0.0000012,
        GBP: 0.000001,
        JPY: 0.00016,
        CNY: 0.0000089,
        BRL: 0.0000079,
        IDR: 0.02,
        ETB: 0.000066,
        NGN: 0.00057,
        INR: 0.0001,
        VND: 0.032,
    },
    LLN: {
        USD: 0.00702,
        CAD: 0.0089,
        EUR: 0.0062,
        GBP: 0.0053,
        JPY: 0.81,
        CNY: 0.045,
        BRL: 0.04,
        IDR: 100.29,
        ETB: 0.33,
        NGN: 2.88,
        INR: 0.52,
        VND: 159.21,
    },
    FFT: {
        USD: 0.00000215,
        CAD: 0.0000027,
        EUR: 0.0000019,
        GBP: 0.0000016,
        JPY: 0.00025,
        CNY: 0.000014,
        BRL: 0.000012,
        IDR: 0.031,
        ETB: 0.0001,
        NGN: 0.00088,
        INR: 0.00016,
        VND: 0.049,
    },
    WNOW: {
        USD: 0.08098,
        CAD: 0.1035,
        EUR: 0.07164,
        GBP: 0.06101,
        JPY: 9.17,
        CNY: 0.5164,
        BRL: 0.4578,
        IDR: 1173.3,
        ETB: 3.9,
        NGN: 33.41,
        INR: 6.12,
        VND: 1869.19,
    },
    WRAITH: {
        USD: 0.0000000203,
        CAD: 0.000000026,
        EUR: 0.000000018,
        GBP: 0.000000015,
        JPY: 0.0000023,
        CNY: 0.00000013,
        BRL: 0.00000011,
        IDR: 0.00029,
        ETB: 0.00000096,
        NGN: 0.0000083,
        INR: 0.0000015,
        VND: 0.00046,
    },
    DAPES: {
        USD: 0.00000018,
        CAD: 0.0000002249,
        EUR: 0.0000001556,
        GBP: 0.0000001325,
        JPY: 0.00001991,
        CNY: 0.000001122,
        BRL: 0.0000009944,
        IDR: 0.00255,
        ETB: 0.0000087,
        NGN: 0.00007261,
        INR: 0.0000133,
        VND: 0.004063,
    },
    ADREAM: {
        USD: 0.00000002688,
        CAD: 0.00000003439,
        EUR: 0.0000000238,
        GBP: 0.00000002026,
        JPY: 0.000003044,
        CNY: 0.0000001716,
        BRL: 0.0000001522,
        IDR: 0.0003888,
        ETB: 0.0000013,
        NGN: 0.00001108,
        INR: 0.000002022,
        VND: 0.0006194,
    },
};

export const tempChart = [
    {
        currency: "AER2",
        timestamps: [
            "2021-12-01T06:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T11:00:00Z",
            "2021-12-01T14:00:00Z",
            "2021-12-01T16:00:00Z",
            "2021-12-01T17:00:00Z",
            "2021-12-01T18:00:00Z",
            "2021-12-01T19:00:00Z",
            "2021-12-01T20:00:00Z",
            "2021-12-01T21:00:00Z",
            "2021-12-01T23:00:00Z",
            "2021-12-02T01:00:00Z",
            "2021-12-02T02:00:00Z",
            "2021-12-02T03:00:00Z",
        ],
        prices: [
            "0.00154108",
            "0.00159076",
            "0.00000001",
            "0.00155392",
            "0.00157401",
            "0.00154749",
            "0.00154459",
            "0.00154773",
            "0.00155342",
            "0.00152126",
            "0.00152682",
            "0.00152214",
            "0.00002251",
            "0.00000001",
            "0.00000001",
        ],
    },
    {
        currency: "CFLT",
        timestamps: [
            "2021-12-01T08:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T11:00:00Z",
            "2021-12-01T12:00:00Z",
            "2021-12-01T13:00:00Z",
            "2021-12-01T14:00:00Z",
            "2021-12-01T15:00:00Z",
            "2021-12-01T16:00:00Z",
            "2021-12-01T17:00:00Z",
            "2021-12-01T18:00:00Z",
            "2021-12-01T19:00:00Z",
            "2021-12-01T20:00:00Z",
            "2021-12-01T21:00:00Z",
            "2021-12-01T22:00:00Z",
            "2021-12-01T23:00:00Z",
            "2021-12-02T00:00:00Z",
            "2021-12-02T01:00:00Z",
            "2021-12-02T02:00:00Z",
            "2021-12-02T03:00:00Z",
            "2021-12-02T04:00:00Z",
        ],
        prices: [
            "0.00002556",
            "0.00002607",
            "0.00002594",
            "0.00002583",
            "0.00002553",
            "0.00002581",
            "0.00002584",
            "0.00002577",
            "0.00002552",
            "0.00002548",
            "0.00002509",
            "0.00002517",
            "0.00002578",
            "0.00002537",
            "0.00002544",
            "0.00002558",
            "0.00002520",
            "0.00002544",
            "0.00002499",
            "0.00002451",
            "0.00002474",
        ],
    },
    {
        currency: "DAPES",
        timestamps: [
            "2021-12-01T06:00:00Z",
            "2021-12-01T07:00:00Z",
            "2021-12-01T08:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T13:00:00Z",
            "2021-12-01T15:00:00Z",
            "2021-12-01T16:00:00Z",
            "2021-12-01T17:00:00Z",
            "2021-12-01T18:00:00Z",
            "2021-12-01T19:00:00Z",
            "2021-12-01T20:00:00Z",
            "2021-12-01T21:00:00Z",
            "2021-12-01T23:00:00Z",
            "2021-12-02T00:00:00Z",
            "2021-12-02T01:00:00Z",
            "2021-12-02T02:00:00Z",
            "2021-12-02T03:00:00Z",
            "2021-12-02T04:00:00Z",
        ],
        prices: [
            "0.00000191",
            "0.00000192",
            "0.00000191",
            "0.00000194",
            "0.00000192",
            "0.00000193",
            "0.00000194",
            "0.00000194",
            "0.00000195",
            "0.00000195",
            "0.00000213",
            "0.00000204",
            "0.00000208",
            "0.00000213",
            "0.00000168",
            "0.00000175",
            "0.00000172",
            "0.00000131",
            "0.00000129",
        ],
    },
    {
        currency: "FCF",
        timestamps: [
            "2021-12-01T06:00:00Z",
            "2021-12-01T07:00:00Z",
            "2021-12-01T08:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T11:00:00Z",
            "2021-12-01T12:00:00Z",
            "2021-12-01T13:00:00Z",
            "2021-12-01T14:00:00Z",
            "2021-12-01T15:00:00Z",
            "2021-12-01T16:00:00Z",
            "2021-12-01T17:00:00Z",
            "2021-12-01T18:00:00Z",
            "2021-12-01T19:00:00Z",
            "2021-12-01T20:00:00Z",
            "2021-12-01T21:00:00Z",
            "2021-12-01T22:00:00Z",
            "2021-12-01T23:00:00Z",
            "2021-12-02T00:00:00Z",
            "2021-12-02T01:00:00Z",
            "2021-12-02T02:00:00Z",
            "2021-12-02T03:00:00Z",
            "2021-12-02T04:00:00Z",
            "2021-12-02T05:00:00Z",
        ],
        prices: [
            "0.00026344",
            "0.00026633",
            "0.00025568",
            "0.00026520",
            "0.00025841",
            "0.00024930",
            "0.00026150",
            "0.00025893",
            "0.00030504",
            "0.00027833",
            "0.00027127",
            "0.00026858",
            "0.00026859",
            "0.00027331",
            "0.00027041",
            "0.00025893",
            "0.00025748",
            "0.00026267",
            "0.00026373",
            "0.00026332",
            "0.00026602",
            "0.00025899",
            "0.00025997",
            "0.00027326",
        ],
    },
    {
        currency: "FFT2",
        timestamps: [
            "2021-12-01T06:00:00Z",
            "2021-12-01T07:00:00Z",
            "2021-12-01T08:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T11:00:00Z",
            "2021-12-01T12:00:00Z",
            "2021-12-01T13:00:00Z",
        ],
        prices: [
            "0.00000212",
            "0.00000212",
            "0.00000213",
            "0.00000212",
            "0.00000212",
            "0.00000213",
            "0.00000213",
            "0.00000212",
        ],
    },
    {
        currency: "LLN",
        timestamps: ["2021-12-01T08:00:00Z"],
        prices: ["0.00802086"],
    },
    {
        currency: "PFT2",
        timestamps: [
            "2021-12-01T07:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T13:00:00Z",
            "2021-12-01T14:00:00Z",
            "2021-12-01T15:00:00Z",
            "2021-12-01T16:00:00Z",
            "2021-12-01T18:00:00Z",
            "2021-12-01T19:00:00Z",
            "2021-12-01T22:00:00Z",
            "2021-12-01T23:00:00Z",
        ],
        prices: [
            "0.00000132",
            "0.00000134",
            "0.00000133",
            "0.00000132",
            "0.00000132",
            "0.00000131",
            "0.00000125",
            "0.00000121",
            "0.00000120",
            "0.00000118",
            "0.00000119",
        ],
    },
    {
        currency: "WNOW",
        timestamps: [
            "2021-12-01T07:00:00Z",
            "2021-12-01T08:00:00Z",
            "2021-12-01T09:00:00Z",
            "2021-12-01T10:00:00Z",
            "2021-12-01T13:00:00Z",
            "2021-12-01T14:00:00Z",
            "2021-12-01T16:00:00Z",
            "2021-12-01T17:00:00Z",
            "2021-12-01T21:00:00Z",
            "2021-12-02T00:00:00Z",
            "2021-12-02T02:00:00Z",
            "2021-12-02T03:00:00Z",
        ],
        prices: [
            "0.11916139",
            "0.11841697",
            "0.12047790",
            "0.11911439",
            "0.12020930",
            "0.11735278",
            "0.11737984",
            "0.11349011",
            "0.11209006",
            "0.11205776",
            "0.11127771",
            "0.10930754",
        ],
    },
    {
        currency: "WRAITH2",
        timestamps: ["2021-12-02T00:00:00Z", "2021-12-02T02:00:00Z"],
        prices: ["0.00000002", "0.00000002"],
    },
];
