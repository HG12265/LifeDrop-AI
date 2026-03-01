import { r as reactExports, j as jsxRuntimeExports, R as React } from "./react-Djfz7pm2.js";
import { a as ReactDOM } from "./react-dom-DRsyVYWB.js";
import { t as toast, T as Toaster } from "./sonner-DZ5L_EMP.js";
import { C as Capacitor, F as Filesystem, D as Directory, S as Share, A as App$1, a as StatusBar } from "./@capacitor-B1wJiuvq.js";
import { u as useNavigate, a as useLocation, L as Link, b as useParams, c as useSearchParams, B as BrowserRouter, R as Routes, d as Route, N as Navigate } from "./react-router-D4a3fAgc.js";
import { D as Droplet, a as Download, B as Bell, L as LayoutDashboard, C as CircleUser, b as LogOut, X, M as Menu, c as Megaphone, S as Smartphone, T as Twitter, I as Instagram, G as Github, d as CodeXml, H as Heart, e as MessageSquare, f as Bot, g as Send, h as CircleCheck, i as TriangleAlert, Z as Zap, A as ArrowRight$1, j as Droplets, k as Activity, l as ShieldCheck, m as MapPin, n as CircleCheckBig, o as LoaderCircle, R as RefreshCcw, p as CloudUpload, q as CircleX, U as UserPlus$1, r as School, s as User, P as Phone, t as Mail, u as Lock, v as Calendar, w as ShieldAlert, x as LogIn, y as ArrowLeft, z as Search, E as Maximize2, F as Settings, J as Award, K as Clock, N as Link2, O as Package, Q as Tent, V as Plus, W as History, Y as Truck, _ as CircleAlert, $ as Trash2, a0 as Users, a1 as Database, a2 as FileSpreadsheet, a3 as FileText, a4 as RefreshCw, a5 as Minus, a6 as TrendingUp, a7 as Hash, a8 as KeyRound, a9 as Save } from "./lucide-react-DHORAFXc.js";
import { L, m as markerShadow, a as markerIcon, b as markerIcon2x } from "./leaflet-QRedCW6X.js";
import { M as MapContainer, T as TileLayer, u as useMap, a as useMapEvents, b as Marker, P as Popup, C as Circle } from "./react-leaflet-D9ZhHFNZ.js";
import { Q as QRCodeCanvas } from "./qrcode.react-DMvS8S2a.js";
import { E } from "./jspdf-BsjRp7_i.js";
import { u as utils, w as writeFileSync, a as writeSync } from "./xlsx-CXNIDPrw.js";
import { a as autoTable } from "./jspdf-autotable-CVI6EX_h.js";
import { C as Chart, A as ArcElement, p as plugin_tooltip, a as plugin_legend, b as CategoryScale, L as LinearScale, c as BarElement, P as PointElement, d as LineElement, e as plugin_title } from "./chart.js-C3tolcP7.js";
import { B as Bar, D as Doughnut } from "./react-chartjs-2-D9nlpMcw.js";
import "./cookie-DWwsNxpa.js";
import "./scheduler-DDFIhFE4.js";
import "./@react-leaflet-BZwRCDI_.js";
import "./@babel-B8ot0hyM.js";
import "./fflate-Ciu_BGOl.js";
import "./fast-png-Bdjteh3E.js";
import "./iobuffer-BhNq81w-.js";
import "./pako-D7zkOqXM.js";
import "./@kurkle-B7HDCycN.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const API_URL = "https://lifedrop-ai.onrender.com";
const Navbar = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [showNotifs, setShowNotifs] = reactExports.useState(false);
  const [alerts, setAlerts] = reactExports.useState([]);
  const [deferredPrompt, setDeferredPrompt] = reactExports.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const fetchAlerts = () => {
    if (user) {
      fetch(`${API_URL}/api/broadcasts`).then((res) => res.json()).then((data) => setAlerts(data)).catch((err) => console.error("Alert fetch error:", err));
    }
  };
  reactExports.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    fetchAlerts();
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    const interval = setInterval(fetchAlerts, 3e4);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, [user]);
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };
  const onLogout = () => {
    handleLogout();
    setIsOpen(false);
    setShowNotifs(false);
    navigate("/");
  };
  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin-dashboard";
    if (user.role === "donor") return "/donor-dashboard";
    return "/requester-dashboard";
  };
  const isActive = (path) => location.pathname === path;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: `fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg h-20" : "bg-white h-24"} flex items-center border-b border-gray-100`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto w-full px-6 flex justify-between items-center relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200 group-hover:rotate-12 transition-transform duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "text-white fill-white", size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black text-slate-900 tracking-tighter leading-none italic", children: "LifeDrop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-red-600 uppercase tracking-[0.3em]", children: "Saving Lives" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-5", children: [
        deferredPrompt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleInstallClick,
            className: "flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 mr-2 animate-pulse",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
              " Get App"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 border-r pr-6 border-gray-100 h-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: `text-sm font-black uppercase tracking-widest transition-colors ${isActive("/") ? "text-red-600" : "text-slate-400 hover:text-slate-900"}`, children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: `text-sm font-black uppercase tracking-widest transition-colors ${isActive("/contact") ? "text-red-600" : "text-slate-400 hover:text-slate-900"}`, children: "Contact" })
        ] }),
        user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowNotifs(!showNotifs),
            className: `p-2.5 rounded-xl transition-all duration-300 ${showNotifs ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20 }),
              alerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full border-2 border-white flex items-center justify-center animate-bounce", children: alerts.length })
            ]
          }
        ) }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: getDashboardPath(),
              className: "flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] hover:bg-red-600 transition-all duration-300 shadow-lg uppercase tracking-widest",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 14 }),
                "Dashboard"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-2xl border border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black text-slate-800 leading-tight truncate max-w-[70px]", children: firstName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onLogout, className: "ml-1 text-gray-300 hover:text-red-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-2xl shadow-red-200 hover:bg-slate-900 transition-all duration-500 uppercase tracking-widest", children: "Join as Hero" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center gap-3", children: [
        user && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowNotifs(!showNotifs),
            className: `relative p-3 rounded-xl transition-all ${showNotifs ? "bg-red-600 text-white" : "bg-slate-50 text-slate-600"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 22 }),
              alerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full border-2 border-white flex items-center justify-center", children: alerts.length })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-slate-50 p-3 rounded-xl text-slate-900 border border-slate-100", onClick: () => setIsOpen(!isOpen), children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 24 }) })
      ] }),
      showNotifs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] md:w-96 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in duration-300 z-[1100]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-5 text-white flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-xs uppercase tracking-widest italic", children: "Emergency Alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNotifs(false), className: "p-1 hover:bg-white/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-y-auto p-4 space-y-3 bg-slate-50", children: alerts.length > 0 ? alerts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3 items-start group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 p-2 rounded-xl text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-600 leading-relaxed", children: a.message })
        ] }, a.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 30, className: "mx-auto text-gray-200 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "No new messages" })
        ] }) })
      ] })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 top-0 left-0 w-full h-screen bg-white z-[2000] flex flex-col p-8 animate-in slide-in-from-right duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black italic", children: "LifeDrop" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsOpen(false), className: "bg-slate-100 p-3 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", onClick: () => setIsOpen(false), className: "text-4xl font-black text-slate-900 border-b pb-6 border-slate-50", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", onClick: () => setIsOpen(false), className: "text-4xl font-black text-slate-900 border-b pb-6 border-slate-50", children: "Contact" }),
        deferredPrompt && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          handleInstallClick();
          setIsOpen(false);
        }, className: "text-4xl font-black text-blue-600 border-b pb-6 border-slate-50 flex items-center justify-between", children: [
          "Install App ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 30 })
        ] }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getDashboardPath(), onClick: () => setIsOpen(false), className: "text-4xl font-black text-red-600 border-b pb-6 border-slate-50 flex items-center justify-between", children: [
            "Dashboard ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 30 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto bg-slate-900 p-8 rounded-[40px] text-white flex flex-col gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold opacity-40 uppercase mb-1", children: "Logged in Hero" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-black", children: user.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onLogout, className: "bg-red-600 w-full py-4 rounded-2xl font-black text-sm uppercase", children: "Logout Account" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setIsOpen(false), className: "bg-red-600 text-white p-8 rounded-[40px] text-center text-2xl font-black mt-12 shadow-2xl shadow-red-200", children: "Login / Signup" })
      ] })
    ] })
  ] });
};
const ArrowRight = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) });
const Footer = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-white border-t border-gray-100 pt-10 pb-4 px-6 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-8 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center md:items-start gap-1 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "text-white fill-white", size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black text-slate-900 tracking-tighter italic leading-none", children: "LifeDrop" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]", children: "Technology for Humanity" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-widest text-slate-500 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-red-600 transition-colors", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hover:text-red-600 transition-colors", children: "Donate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hover:text-red-600 transition-colors", children: "Request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-red-600 transition-colors", children: "Support" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center md:justify-end gap-5 text-slate-300 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { size: 18, className: "hover:text-red-600 cursor-pointer transition-all hover:-translate-y-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 18, className: "hover:text-red-600 cursor-pointer transition-all hover:-translate-y-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { size: 18, className: "hover:text-red-600 cursor-pointer transition-all hover:-translate-y-1" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 border-t border-gray-50 flex flex-col items-center gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-15 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-all duration-300 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { size: 14, className: "text-slate-400 group-hover:text-red-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-black text-slate-700 uppercase tracking-wider", children: [
            "Developed by ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-900 group-hover:text-red-600", children: "Gowtham G" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1", children: [
          "Made with ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 10, className: "text-red-500 fill-red-500 animate-pulse" }),
          " in India"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-green-500 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-green-700 uppercase tracking-tighter", children: "Systems Live" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]", children: "© 2026 LifeDrop AI. All Rights Reserved." }) })
    ] })
  ] }) });
};
const ChatBot = () => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([{ role: "bot", text: "Hello! I am LifeDrop AI. How can I help you today?" }]);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", text: input };
    setMessages([...messages, newMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Server error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-6 right-6 z-[1000]", children: [
    !isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsOpen(true), className: "bg-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 28 }) }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white w-[350px] h-[500px] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-600 p-5 text-white flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 24 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black italic tracking-tighter", children: "LifeDrop AI" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide", children: [
        messages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[80%] p-3 rounded-2xl text-sm font-bold shadow-sm ${msg.role === "user" ? "bg-red-600 text-white rounded-tr-none" : "bg-white text-gray-700 rounded-tl-none border border-gray-100"}`, children: msg.text }) }, i)),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 animate-pulse uppercase", children: "AI is thinking..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white border-t flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "flex-1 bg-gray-100 p-3 rounded-xl text-sm outline-none font-bold",
            placeholder: "Ask about blood stock, health...",
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleSend()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSend, className: "bg-red-600 text-white p-3 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 }) })
      ] })
    ] })
  ] });
};
const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes, Proceed",
  cancelText = "Cancel",
  type = "danger"
  // 'danger' (Red) or 'success' (Green)
}) => {
  if (!isOpen) return null;
  const isSuccess = type === "success";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white w-full max-w-sm rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in duration-300 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onCancel,
        className: "absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-10 flex justify-center ${isSuccess ? "bg-green-50" : "bg-red-50"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-white p-5 rounded-full shadow-sm border ${isSuccess ? "border-green-100" : "border-red-100"}`, children: isSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 44, className: "text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 44, className: "text-red-600" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-gray-800 tracking-tight leading-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-400 mt-3 leading-relaxed px-2", children: message }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onConfirm,
            className: `w-full py-4 rounded-2xl font-black text-sm shadow-xl transition transform active:scale-95 ${isSuccess ? "bg-green-600 text-white shadow-green-100 hover:bg-green-700" : "bg-red-600 text-white shadow-red-100 hover:bg-red-700"}`,
            children: confirmText
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onCancel,
            className: "w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition active:scale-95",
            children: cancelText
          }
        )
      ] })
    ] })
  ] }) });
};
const BroadcastAlert = () => {
  const [alerts, setAlerts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    fetch(`${API_URL}/api/broadcasts`).then((res) => res.json()).then((data) => setAlerts(data));
  }, []);
  const dismissAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };
  if (alerts.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full px-4", children: alerts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-600 text-white p-5 rounded-[28px] shadow-2xl flex items-start gap-4 animate-in slide-in-from-right duration-500 relative overflow-hidden group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/20 p-2 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 20 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest opacity-60", children: "Emergency Alert" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold leading-tight mt-1", children: a.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => dismissAlert(a.id), className: "text-white/40 hover:text-white transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 h-1 bg-white/30 w-full animate-out fade-out duration-[10000ms]" })
  ] }, a.id)) });
};
const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = reactExports.useState({ donors: 0, saves: 0 });
  reactExports.useEffect(() => {
    fetch(`${API_URL}/api/admin/analytics`, {
      credentials: "include"
      // 🔥 MUST
    }).then((res) => res.json()).then((data) => setStats({ donors: data.total_donors, saves: data.total_saves })).catch(() => setStats({ donors: 25, saves: 12 }));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white overflow-x-hidden font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-20 pb-32 flex flex-col items-center px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 left-10 w-64 h-64 bg-red-100 rounded-full blur-[100px] opacity-60 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-5xl mx-auto text-center space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-full text-red-600 font-black text-[10px] tracking-[0.2em] uppercase animate-bounce", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, fill: "currentColor" }),
          " Real-time Matching Enabled"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight", children: [
          "Saving Lives ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400", children: "Through Technology" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed", children: "The world’s first blockchain-secured, AI-powered blood donation platform. Connecting heroes with those in need, instantly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-6 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/register-requester"),
              className: "w-full sm:w-auto bg-red-600 text-white px-10 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 24 }),
                " REQUEST BLOOD"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/register-donor"),
              className: "w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3",
              children: [
                "BECOME A DONOR ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight$1, { size: 24 })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-20 animate-bounce duration-[3000ms]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 relative group cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { size: 60, className: "text-red-600 transition-transform group-hover:scale-110" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-4 border-white animate-ping" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-black text-slate-900 tracking-tight", children: "Our Ecosystem" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs", children: "Why LifeDrop is Different" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "text-red-600", size: 32 }),
              title: "AI Matching",
              desc: "Smart compatibility algorithms finding universal and exact donors in milliseconds."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-green-600", size: 32 }),
              title: "Blockchain Secured",
              desc: "Every donation step is recorded on an immutable ledger for total transparency."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "text-blue-600", size: 32 }),
              title: "Live Tracking",
              desc: "Real-time map and blood bag tracking with unique bag serial IDs."
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gray-50 py-32 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black italic", children: "How It Works?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepRow,
          {
            num: "01",
            title: "Request or Register",
            desc: "Users can create a request with patient details or join as a verified donor with a health score.",
            imageIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "text-red-600", size: 40 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepRow,
          {
            num: "02",
            title: "AI Search & Match",
            desc: "Our AI filters donors by distance, compatibility, and availability (90-day cooldown check).",
            imageIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "text-blue-600", size: 40 }),
            reverse: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepRow,
          {
            num: "03",
            title: "Verified Donation",
            desc: "Blockchain verifies the donation, generates a Hero Certificate, and updates the stock.",
            imageIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-green-600", size: 40 })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-32 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto bg-red-600 rounded-[60px] p-12 md:p-20 shadow-2xl relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 group-hover:scale-110 transition duration-[5000ms]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-6xl font-black text-white relative z-10 leading-tight", children: [
        "Ready to save ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        " someone's life?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/register-donor"),
          className: "mt-10 bg-white text-red-600 px-12 py-5 rounded-[24px] font-black text-xl hover:bg-slate-900 hover:text-white transition-all relative z-10 active:scale-95 shadow-xl",
          children: "JOIN AS A HERO NOW"
        }
      )
    ] }) })
  ] });
};
const FeatureCard = ({ icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-10 rounded-[48px] border border-gray-50 shadow-xl hover:shadow-2xl transition duration-500 group hover:-translate-y-2", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition duration-500 shadow-inner", children: icon }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-slate-800 mb-4 tracking-tight", children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-bold text-sm leading-relaxed", children: desc })
] });
const StepRow = ({ num, title, desc, imageIcon, reverse }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col md:flex-row items-center gap-10 md:gap-20 ${reverse ? "md:flex-row-reverse" : ""}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-4 text-center md:text-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-black text-6xl opacity-10 leading-none", children: num }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-black text-slate-900 tracking-tight italic", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium leading-relaxed", children: desc })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-32 md:w-48 md:h-48 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-gray-50 hover:rotate-6 transition duration-500 shrink-0", children: imageIcon })
] });
const UserPlus = (props) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "7", r: "4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "19", x2: "19", y1: "8", y2: "14" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "22", x2: "16", y1: "11", y2: "11" })
] });
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
const MapRecenter = ({ position }) => {
  const map = useMap();
  reactExports.useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, {
        animate: true,
        duration: 1.5
        // 1.5 seconds travel time
      });
    }
  }, [position, map]);
  return null;
};
const LocationPicker = ({ position, setPosition }) => {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      }
    });
    return position === null ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Marker,
      {
        draggable: true,
        eventHandlers: {
          dragend: (e) => {
            const marker = e.target;
            if (marker != null) {
              setPosition(marker.getLatLng());
            }
          }
        },
        position
      }
    );
  }
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser.");
    }
    const options = {
      enableHighAccuracy: true,
      // GPS use panni accurate-ah edukka
      timeout: 1e4,
      // 10 seconds wait pannum
      maximumAge: 0
      // Cache panna location-ah edukkaama fresh-ah edukka
    };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setPosition(newPos);
      },
      (err) => {
        toast.error("Error: " + err.message + ". Please enable GPS/Location.");
      },
      options
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2", children: "📍 Pin Your Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleCurrentLocation,
          className: "text-[10px] bg-blue-600 text-white px-4 py-1.5 rounded-full font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95",
          children: "USE MY CURRENT LOCATION"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 w-full rounded-[32px] overflow-hidden border-4 border-white shadow-2xl z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      MapContainer,
      {
        center: [position.lat, position.lng],
        zoom: 13,
        style: { height: "100%", width: "100%" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapRecenter, { position }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LocationMarker, {})
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-tighter", children: [
      "Lat: ",
      position.lat.toFixed(4),
      " | Lng: ",
      position.lng.toFixed(4),
      " (Drag marker to adjust)"
    ] }) })
  ] });
};
const SuccessModal = ({ userId, type, onClose }) => {
  const profileUrl = `${window.location.origin}/profile/${userId}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "text-green-500 mx-auto mb-4", size: 60 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-gray-800", children: "Registration Success!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-2", children: "Welcome to LifeDrop community" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Your Unique ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-4xl font-black text-red-600 mt-1", children: [
        "#",
        userId
      ] }),
      type === "donor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-3 rounded-2xl shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeCanvas, { value: profileUrl, size: 150, level: "H" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 mt-3 font-medium", children: "SCAN TO VIEW MEDICAL CARD" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        className: "w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition",
        children: "Go to Login"
      }
    )
  ] }) });
};
const OTPModal = ({ email, onVerify, onClose, onResend }) => {
  const [otp, setOtp] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleCheck = async () => {
    if (otp.length !== 4) return toast.error("Please enter the 4-digit code sent to your email.");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/check-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp
        })
      });
      const data = await res.json();
      if (data.success) {
        await onVerify();
      } else {
        toast.error(data.message || "Invalid OTP! Please check your email.");
        setLoading(false);
      }
    } catch (err) {
      console.toast.error("Verification Error:", err);
      toast.error("Connection error. Please check if the server is running.");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300 border border-white/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 40, className: "text-red-600" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-gray-800 tracking-tight", children: "Verify Identity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-xs mt-2 px-4 leading-relaxed", children: [
      "We've sent a secure 4-digit code to ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-800 font-bold break-all", children: email })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        maxLength: "4",
        inputMode: "numeric",
        disabled: loading,
        className: `w-full mt-8 p-5 rounded-3xl bg-slate-50 border-2 outline-none text-center text-3xl font-black tracking-[15px] transition-all ${loading ? "opacity-50 border-transparent" : "focus:border-red-500 border-transparent"}`,
        placeholder: "0000",
        value: otp,
        onChange: (e) => setOtp(e.target.value.replace(/\D/g, ""))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleCheck,
        disabled: loading,
        className: `w-full py-5 rounded-[24px] font-black mt-6 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${loading ? "bg-slate-800 text-white opacity-100 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-red-100"}`,
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin" }),
          "VERIFYING..."
        ] }) : "CONFIRM & REGISTER"
      }
    ),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onResend,
        className: "mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto hover:text-red-600 transition-colors group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { size: 12, className: "group-hover:rotate-180 transition-transform duration-500" }),
          "Resend Verification Code"
        ]
      }
    ),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        className: "mt-4 text-[10px] font-bold text-slate-300 uppercase hover:text-slate-500 transition-colors",
        children: "Cancel the Registration"
      }
    )
  ] }) });
};
const IDCardUpload = ({ onImageSelect, mode = "admin", isVerified = false }) => {
  const [idPreview, setIdPreview] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
      };
    });
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const compressedBase64 = await compressImage(file);
      setIdPreview(compressedBase64);
      onImageSelect(compressedBase64);
      setLoading(false);
    }
  };
  const handleAiVerify = async () => {
    if (!idPreview) return toast.error("Please select an image first");
    setLoading(true);
    const base64Data = idPreview.split(",")[1];
    try {
      const res = await fetch(`${API_URL}/api/verify-id-gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      const data = await res.json();
      if (res.ok && data.is_valid) {
        toast.success("AI Verified Successfully! ✅");
        onImageSelect(idPreview, true, data.role);
      } else {
        toast.error(data.message || "AI could not verify this ID.");
      }
    } catch (err) {
      toast.error("AI Service Error. Try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };
  const removeImage = () => {
    setIdPreview(null);
    onImageSelect(null, false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 text-center shadow-inner relative", children: isVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-4 animate-in zoom-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-100 p-4 rounded-full text-green-600 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 40 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-green-700 uppercase text-xs tracking-widest", children: "Identity Verified" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: !idPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-4", children: [
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-indigo-600", size: 32 }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-indigo-50 p-4 rounded-3xl text-indigo-600 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { size: 32 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black text-slate-500 uppercase", children: "Upload University ID" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", id: "id-input", className: "hidden", onChange: handleFileChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "id-input", className: "mt-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase cursor-pointer active:scale-95 shadow-lg", children: loading ? "COMPRESSING..." : "Select Image" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group mx-auto w-full max-w-[200px] aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: idPreview, alt: "ID Preview", className: "w-full h-full object-contain p-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: removeImage, className: "absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 }) })
    ] }),
    mode === "ai" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleAiVerify, disabled: loading, className: "w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl flex items-center justify-center gap-2", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, fill: "white" }),
      " START AI VERIFICATION"
    ] }) })
  ] }) }) });
};
const DonorRegister = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = reactExports.useState(false);
  const [showOTP, setShowOTP] = reactExports.useState(false);
  const [registeredId, setRegisteredId] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [community, setCommunity] = reactExports.useState("Public");
  const [idFile, setIdFile] = reactExports.useState(null);
  const [position, setPosition] = reactExports.useState({ lat: 13.0827, lng: 80.2707 });
  const [healthScore, setHealthScore] = reactExports.useState(100);
  const [formData, setFormData] = reactExports.useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    bloodGroup: "",
    dob: "",
    department: "",
    roleType: "Student",
    year: "",
    weight: true,
    alcohol: false,
    surgery: false,
    tattoo: false,
    medication: false
  });
  reactExports.useEffect(() => {
    let score = 100;
    if (!formData.weight) score -= 30;
    if (formData.alcohol) score -= 20;
    if (formData.surgery) score -= 25;
    if (formData.tattoo) score -= 15;
    if (formData.medication) score -= 10;
    setHealthScore(score < 0 ? 0 : score);
  }, [formData]);
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (community === "Periyar University" && !idFile) {
      return toast.error("Please upload your University ID card for verification.");
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/verify/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setShowOTP(true);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("Connection error. Please check your server.");
    } finally {
      setLoading(false);
    }
  };
  const finalizeRegistration = async () => {
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        community,
        id_card_image: idFile,
        // ✅ idFile ippo direct-ah compressed base64 string-ah irukkum
        lat: position.lat,
        lng: position.lng,
        healthScore
      };
      console.log("📤 Sending Registration Data to Backend...");
      const res = await fetch(`${API_URL}/register/donor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      });
      const data = await res.json();
      if (res.ok && data.unique_id) {
        setRegisteredId(data.unique_id);
        setShowOTP(false);
        setShowModal(true);
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      toast.error("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 relative animate-in fade-in zoom-in duration-500", children: [
    showOTP && /* @__PURE__ */ jsxRuntimeExports.jsx(OTPModal, { email: formData.email, onVerify: finalizeRegistration, onClose: () => setShowOTP(false), onResend: handleInitialSubmit }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessModal, { userId: registeredId, type: "donor", onClose: () => navigate("/login") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 ${showModal || showOTP ? "blur-sm pointer-events-none" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-10 md:p-14 text-white text-center relative overflow-hidden border-b-8 border-red-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus$1, { size: 36, className: "text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black italic tracking-tighter uppercase", children: "Become a Hero" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic", children: "LifeDrop Hero Registration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20px] left-[-20px] w-32 h-32 bg-red-600/10 rounded-full blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleInitialSubmit, className: "p-6 md:p-12 space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 12 }),
            " Select Community"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "w-full p-5 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-black text-slate-700 transition-all shadow-inner",
              onChange: (e) => setCommunity(e.target.value),
              value: community,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Public", children: "Public (General)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Periyar University", children: "Periyar University, Salem" })
              ]
            }
          )
        ] }),
        community === "Periyar University" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50/50 p-8 rounded-[40px] border-2 border-dashed border-indigo-100 animate-in slide-in-from-top duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-indigo-900 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 20, className: "text-indigo-600" }),
            " University Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-indigo-400 uppercase ml-2", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. Computer Science", className: "w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm", onChange: (e) => setFormData({ ...formData, department: e.target.value }), required: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-indigo-400 uppercase ml-2", children: "Role" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm", onChange: (e) => setFormData({ ...formData, roleType: e.target.value }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Student", children: "Student" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Staff", children: "Staff" })
                  ] })
                ] }),
                formData.roleType === "Student" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 animate-in fade-in duration-300", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-indigo-400 uppercase ml-2", children: "Year" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      className: "w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm appearance-none cursor-pointer",
                      onChange: (e) => setFormData({ ...formData, year: e.target.value }),
                      required: true,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Year" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "I YEAR", children: "I YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "II YEAR", children: "II YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "III YEAR", children: "III YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "IV YEAR", children: "IV YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "V YEAR", children: "V YEAR" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              IDCardUpload,
              {
                mode: "admin",
                onImageSelect: (base64) => setIdFile(base64)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter border-b pb-2 border-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18, className: "text-red-600" }),
            " Identity Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 10 }),
                " Full Name"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Your Name", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 10 }),
                " Phone Number"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", placeholder: "+91", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, phone: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 10 }),
                " Email Address"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "mail@example.com", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
                " Security Password"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "••••••••", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, password: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { size: 10 }),
                " Blood Group"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "absolute left-4 top-4 text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 appearance-none cursor-pointer transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, bloodGroup: e.target.value }), required: true, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Choose Group" }),
                  ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: bg, children: bg }, bg))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10 }),
                " Date of Birth"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-400 transition-all shadow-inner cursor-pointer", onChange: (e) => setFormData({ ...formData, dob: e.target.value }), required: true })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 flex flex-col h-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6 border-b pb-2 border-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18, className: "text-blue-600" }),
                " Current Location"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LocationPicker, { position, setPosition })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100 mt-auto shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 28, className: "text-red-600 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-red-800 leading-relaxed uppercase tracking-tight", children: "By creating a hero account, you confirm that all information provided is true. LifeDrop is a connector platform; please verify medical details manually before donation." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 flex flex-col h-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl border-b-4 border-red-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "absolute right-[-10px] bottom-[-10px] opacity-10", size: 120 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2", children: "Medical Trust Rating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-6xl font-black italic tracking-tighter", children: [
                  healthScore,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold opacity-50 mb-2 uppercase tracking-widest leading-none border-l pl-2 border-white/20", children: "Safe Score" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 w-full bg-white/10 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 h-full transition-all duration-1000", style: { width: `${healthScore}%` } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6 border-b pb-2 border-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18, className: "text-green-600" }),
                " Eligibility Screening"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthCheck, { label: "Weight > 50kg", checked: formData.weight, onChange: () => setFormData({ ...formData, weight: !formData.weight }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthCheck, { label: "No alcohol (24h)", checked: !formData.alcohol, onChange: () => setFormData({ ...formData, alcohol: !formData.alcohol }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthCheck, { label: "No surgery (6m)", checked: !formData.surgery, onChange: () => setFormData({ ...formData, surgery: !formData.surgery }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthCheck, { label: "No Tattoos (6m)", checked: !formData.tattoo, onChange: () => setFormData({ ...formData, tattoo: !formData.tattoo }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-auto uppercase tracking-widest",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 20 }),
                  " PROCESSING..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 24 }),
                  " GET VERIFIED & JOIN"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
};
const HealthCheck = ({ label, checked, onChange }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex justify-between items-center p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${checked ? "bg-green-50 border-green-200 shadow-sm" : "bg-gray-50 border-transparent opacity-60"}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black uppercase tracking-tight ${checked ? "text-green-700" : "text-gray-400"}`, children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked ? "bg-green-600 border-green-600" : "border-gray-200 bg-white"}`, children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14, className: "text-white" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked, onChange, className: "hidden" })
] });
const RequesterRegister = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = reactExports.useState(false);
  const [showOTP, setShowOTP] = reactExports.useState(false);
  const [registeredId, setRegisteredId] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [community, setCommunity] = reactExports.useState("Public");
  const [idFile, setIdFile] = reactExports.useState(null);
  const [isIdVerified, setIsIdVerified] = reactExports.useState(false);
  const [verifyingId, setVerifyingId] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    department: "",
    roleType: "Student",
    year: ""
  });
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (community === "Periyar University" && !isIdVerified) {
      return toast.error("Please verify your University ID card with AI to proceed.");
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/verify/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setShowOTP(true);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("Connection error. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };
  const finalizeRegistration = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register/requester`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          community,
          is_verified: isIdVerified,
          id_card_image: idFile
        })
      });
      const data = await res.json();
      if (res.ok && data.unique_id) {
        setRegisteredId(data.unique_id);
        setShowOTP(false);
        setShowModal(true);
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Registration error. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-10 relative animate-in fade-in zoom-in duration-500", children: [
    showOTP && /* @__PURE__ */ jsxRuntimeExports.jsx(OTPModal, { email: formData.email, onVerify: finalizeRegistration, onClose: () => setShowOTP(false), onResend: handleInitialSubmit }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessModal, { userId: registeredId, type: "requester", onClose: () => navigate("/login") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 ${showModal || showOTP ? "blur-sm pointer-events-none" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-10 md:p-14 text-white text-center relative overflow-hidden border-b-8 border-red-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus$1, { size: 36, className: "text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black italic tracking-tighter uppercase", children: "Requester Sign Up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic", children: "LifeDrop Emergency Portal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20px] right-[-20px] w-32 h-32 bg-red-600/10 rounded-full blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleInitialSubmit, className: "p-6 md:p-12 space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 12 }),
            " Select Community"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "w-full p-5 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-black text-slate-700 transition-all shadow-inner",
              onChange: (e) => {
                setCommunity(e.target.value);
                setIsIdVerified(false);
              },
              value: community,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Public", children: "Public (General)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Periyar University", children: "Periyar University, Salem" })
              ]
            }
          )
        ] }),
        community === "Periyar University" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50/50 p-8 rounded-[40px] border-2 border-dashed border-indigo-100 animate-in slide-in-from-top duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-indigo-900 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 20, className: "text-indigo-600" }),
            " University Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-indigo-400 uppercase ml-2", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. Computer Science", className: "w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm", onChange: (e) => setFormData({ ...formData, department: e.target.value }), required: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-indigo-400 uppercase ml-2", children: "Role" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm", onChange: (e) => setFormData({ ...formData, roleType: e.target.value }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Student", children: "Student" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Staff", children: "Staff" })
                  ] })
                ] }),
                formData.roleType === "Student" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 animate-in fade-in duration-300", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-indigo-400 uppercase ml-2", children: "Year" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      className: "w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm appearance-none cursor-pointer",
                      onChange: (e) => setFormData({ ...formData, year: e.target.value }),
                      required: true,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Year" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "I YEAR", children: "I YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "II YEAR", children: "II YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "III YEAR", children: "III YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "IV YEAR", children: "IV YEAR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "V YEAR", children: "V YEAR" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              IDCardUpload,
              {
                mode: "ai",
                isVerified: isIdVerified,
                onImageSelect: (base64, verified, role) => {
                  setIdFile(base64);
                  if (verified) {
                    setIsIdVerified(true);
                    setFormData((prev) => ({ ...prev, roleType: role }));
                  }
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter border-b pb-2 border-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18, className: "text-red-600" }),
            " Account Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 10 }),
                " Full Name"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Your Name", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 10 }),
                " Phone Number"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", placeholder: "+91", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, phone: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 10 }),
                " Email Address"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "mail@example.com", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
                " Password"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "••••••••", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner", onChange: (e) => setFormData({ ...formData, password: e.target.value }), required: true })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 28, className: "text-red-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-red-800 leading-relaxed uppercase tracking-tight", children: "By creating an account, you agree that LifeDrop is a connector platform. Please verify medical details and donor identity manually before the extraction process." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest",
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 20 }),
                " PROCESSING..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight$1, { size: 24 }),
                " VERIFY & SIGN UP"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-gray-400 font-bold uppercase tracking-widest", children: [
            "Already part of the mission?",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-black cursor-pointer hover:underline ml-2", onClick: () => navigate("/login"), children: "Sign In" })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = reactExports.useState({ email: "", password: "", role: "donor" });
  const [loading, setLoading] = reactExports.useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.status === 429) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setUser({
          ...data.user,
          community: data.user.community
          // Intha line thaan dashboard logic-ku mukkiyam nanba
        });
        toast.success(`Welcome back, ${data.user.name}!`, {
          description: "Accessing your secure dashboard..."
        });
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "donor") {
          navigate("/donor-dashboard");
        } else {
          navigate("/requester-dashboard");
        }
      } else {
        toast.error(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Connection error! Please check if the server is live.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md mx-auto p-6 md:p-10 animate-in fade-in duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-600 p-8 text-white text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 32 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black tracking-tight italic", children: "Welcome Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-70 text-[10px] font-black mt-1 uppercase tracking-[0.2em]", children: "LifeDrop Secure Access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200 shadow-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFormData({ ...formData, role: "donor" }),
            className: `flex-1 py-3 rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.role === "donor" ? "bg-white shadow-md text-red-600 scale-105" : "text-gray-400"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, fill: formData.role === "donor" ? "currentColor" : "none" }),
              " Donor"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFormData({ ...formData, role: "requester" }),
            className: `flex-1 py-3 rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.role === "requester" ? "bg-white shadow-md text-red-600 scale-105" : "text-gray-400"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 16 }),
              " Requester"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest italic", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              placeholder: "name@mail.com",
              className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold text-gray-700 focus:bg-white focus:ring-2 ring-red-50 transition-all shadow-inner",
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest italic", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "••••••••",
              className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold text-gray-700 focus:bg-white focus:ring-2 ring-red-50 transition-all shadow-inner",
              onChange: (e) => setFormData({ ...formData, password: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            onClick: () => navigate("/forgot-password"),
            className: "text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-red-600 transition",
            children: "Forgot Password?"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: `w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition mt-6 active:scale-95 flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`,
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "AUTHENTICATING..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "LOGIN TO DASHBOARD",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight$1, { size: 20 })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center mt-8 text-xs text-gray-400 font-medium tracking-tight", children: [
        formData.role === "admin" ? "System Administrator Identity Verified" : "New to LifeDrop?",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-black cursor-pointer ml-1 hover:underline uppercase tracking-tighter", onClick: () => navigate("/"), children: formData.role === "admin" ? "" : "Register here" })
      ] })
    ] })
  ] }) });
};
const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = reactExports.useState(null);
  reactExports.useEffect(() => {
    fetch(`${API_URL}/api/donor/${id}`, {
      credentials: "include"
      // 🔥 MUST
    }).then((res) => res.json()).then((data) => setDonor(data)).catch((err) => console.error("Error:", err));
  }, [id]);
  if (!donor) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-500", children: "Fetching Hero Details..." })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 h-48 relative rounded-b-[50px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => navigate(-1),
        className: "absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24 })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-6 -translate-y-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[40px] shadow-2xl p-8 border border-gray-100 text-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-6 right-6 flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-gray-400 uppercase", children: "Health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-black text-green-600", children: [
            donor.healthScore,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-32 h-32 bg-white rounded-full mx-auto p-2 shadow-xl border-4 border-red-50 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 60, className: "text-red-300" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-4 border-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16, className: "text-white" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-gray-800 mt-6 tracking-tight", children: donor.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-600 font-bold text-sm flex items-center justify-center gap-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-red-600 rounded-full animate-pulse" }),
          "LifeDrop ID: #",
          donor.id
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 p-4 rounded-3xl border border-red-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "text-red-600 mx-auto mb-1", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Blood Group" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-black text-red-600", children: donor.bloodGroup })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 p-4 rounded-3xl border border-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "text-slate-600 mx-auto mb-1", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Age / DOB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-black text-slate-800", children: donor.dob })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-left space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2", children: "Contact & Verification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-gray-50 p-4 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-xl shadow-sm text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700", children: donor.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-gray-50 p-4 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-xl shadow-sm text-green-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Live Location Pinned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-gray-700", children: [
                donor.location.lat.toFixed(4),
                ", ",
                donor.location.lng.toFixed(4)
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-slate-900 rounded-3xl p-6 text-white text-left overflow-hidden relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "absolute right-[-10px] bottom-[-10px] opacity-10", size: 80 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold opacity-60 uppercase", children: "Medical Eligibility Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-4xl font-black", children: [
              donor.healthScore,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-green-500 text-[10px] px-2 py-0.5 rounded-full mb-2", children: "SAFE TO DONATE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-400 h-full rounded-full", style: { width: `${donor.healthScore}%` } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `tel:${donor.phone}`,
            className: "mt-8 flex items-center justify-center gap-3 bg-red-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-95 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 24, fill: "white" }),
              " CONTACT DONOR NOW"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 text-center text-xs text-gray-400 px-4 leading-relaxed", children: [
        "This donor profile is verified by ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "LifeDrop" }),
        ". Please ensure to check the medical fitness again before the extraction process."
      ] })
    ] })
  ] });
};
const AdminVerification = () => {
  const navigate = useNavigate();
  const [pendingList, setPendingList] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedImg, setSelectedImg] = reactExports.useState(null);
  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/pending-verifications`);
      const data = await res.json();
      setPendingList(data);
    } catch (err) {
      toast.error("Failed to fetch pending verifications");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchPending();
  }, []);
  const handleApprove = async (u_id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/approve-donor/${u_id}`, {
        method: "POST"
      });
      if (res.ok) {
        toast.success(`${name} verified & ID purged from DB!`);
        fetchPending();
      }
    } catch (err) {
      toast.error("Approval failed");
    }
  };
  const filteredList = pendingList.filter(
    (donor) => donor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || donor.unique_id.includes(searchTerm)
  );
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-red-600 mb-4", size: 40 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-slate-400 uppercase tracking-widest text-xs", children: "Auditing University Records..." })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 pb-20", children: [
    selectedImg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[5000] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in zoom-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedImg(null),
          className: "absolute top-6 right-6 bg-white/10 text-white p-3 rounded-full hover:bg-red-600 transition-all",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: selectedImg,
          alt: "Full ID Card",
          className: "max-w-full max-h-full rounded-2xl shadow-2xl object-contain border-4 border-white/10"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "absolute bottom-6 text-white/40 font-black text-[10px] uppercase tracking-[0.5em]", children: "LifeDrop Secure Viewer" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-white/10 p-2 rounded-xl hover:bg-white/20 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black italic tracking-tighter uppercase leading-none", children: "Verification Center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2", children: "Pending University Audits" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full md:w-80 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-4 text-slate-500", size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search by name or ID...",
            className: "w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-red-500 focus:bg-white/10 transition-all font-bold text-sm",
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 180, className: "absolute right-[-40px] top-[-40px] opacity-5 -rotate-12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredList.map((donor) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[48px] shadow-xl border border-gray-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 p-3 rounded-2xl text-red-600 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100", children: "Pending Review" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-gray-800 tracking-tight uppercase", children: donor.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1", children: [
          donor.department,
          " • ",
          donor.role_type
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-8 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => setSelectedImg(donor.id_card_image),
          className: "relative aspect-[4/3] bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden cursor-zoom-in group-hover:border-red-200 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: donor.id_card_image, alt: "ID Card", className: "w-full h-full object-contain p-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-3 rounded-full shadow-xl text-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { size: 20 }) }) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 pt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `tel:${donor.phone}`,
              className: "flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition active:scale-95",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, fill: "currentColor" }),
                " Call Donor"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handleApprove(donor.unique_id, donor.full_name),
              className: "flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 transition active:scale-95 flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
                " Verify Hero"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[9px] font-black text-slate-300 uppercase tracking-widest", children: [
          "LifeDrop ID: #",
          donor.unique_id
        ] })
      ] })
    ] }, donor.unique_id)) }),
    filteredList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-32 bg-white rounded-[60px] border-2 border-dashed border-gray-100 text-center flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 60, className: "text-slate-100 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-slate-300 uppercase tracking-widest", children: "No Pending Verifications" })
    ] })
  ] });
};
const generateCertificate = async (donorName, bloodGroup, date, requestId) => {
  const doc = new E({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, width, height, "F");
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, width - 20, height - 20);
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.3);
  doc.rect(13, 13, width - 26, height - 26);
  doc.setTextColor(220, 38, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("LIFEDROP • BLOOD DONATION NETWORK", width / 2, 25, { align: "center" });
  doc.setTextColor(30, 41, 59);
  doc.setFont("times", "bold");
  doc.setFontSize(38);
  doc.text("Certificate of Appreciation", width / 2, 50, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("THIS ACKNOWLEDGES THAT", width / 2, 65, { align: "center" });
  doc.setTextColor(15, 23, 42);
  doc.setFont("times", "italic");
  doc.setFontSize(50);
  doc.text(donorName, width / 2, 90, { align: "center" });
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - 50, 95, width / 2 + 50, 95);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  const msg = `Has demonstrated exceptional humanitarian spirit by voluntarily donating Blood Group '${bloodGroup}'. This selfless act reflects a profound commitment to saving lives and serving the community.`;
  const splitMsg = doc.splitTextToSize(msg, 180);
  doc.text(splitMsg, width / 2, 110, { align: "center", lineHeightFactor: 1.5 });
  const sealX = width / 2;
  const sealY = 160;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.8);
  doc.circle(sealX, sealY, 15, "D");
  doc.setLineWidth(0.2);
  doc.circle(sealX, sealY, 13, "D");
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL SEAL", sealX, sealY - 3, { align: "center" });
  doc.setFontSize(9);
  doc.text("VERIFIED", sealX, sealY + 2, { align: "center" });
  doc.setFontSize(7);
  doc.text("HERO", sealX, sealY + 6, { align: "center" });
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DATE OF DONATION", 65, 160, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(date || (/* @__PURE__ */ new Date()).toLocaleDateString(), 65, 168, { align: "center" });
  doc.line(45, 162, 85, 162);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(14);
  doc.text("Admin, LifeDrop AI", 232, 160, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("AUTHORIZED SIGNATORY", 232, 168, { align: "center" });
  doc.line(210, 162, 255, 162);
  doc.setFillColor(30, 41, 59);
  doc.rect(0, height - 12, width, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`Blockchain Verified Record ID: LD-TRANS-${requestId}`, 15, height - 5);
  doc.text(`"Every drop matters"`, width / 2, height - 5, { align: "center" });
  doc.text(`Verification Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, width - 15, height - 5, { align: "right" });
  const fileName = `LifeDrop_Hero_${donorName.replace(/\s/g, "_")}.pdf`;
  if (Capacitor.getPlatform() === "web") {
    doc.save(fileName);
  } else {
    try {
      const pdfBase64 = doc.output("datauristring").split(",")[1];
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64,
        directory: Directory.Documents,
        recursive: true
      });
      await Share.share({
        title: "LifeDrop Certificate",
        text: "Your Blood Donation Certificate",
        url: savedFile.uri,
        dialogTitle: "Open Certificate"
      });
    } catch (e) {
      console.error("Download error", e);
      doc.save(fileName);
    }
  }
};
const DonorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = reactExports.useState([]);
  const [bagId, setBagId] = reactExports.useState("");
  const [stats, setStats] = reactExports.useState({
    donation_count: 0,
    is_available: true,
    days_remaining: 0,
    is_verified: false,
    community: "Public"
  });
  const [camps, setCamps] = reactExports.useState([]);
  const [isToggling, setIsToggling] = reactExports.useState(false);
  const [showDonateModal, setShowDonateModal] = reactExports.useState(false);
  const [selectedNotifId, setSelectedNotifId] = reactExports.useState(null);
  const profileUrl = `${window.location.origin}/profile/${user.unique_id}`;
  const fetchAlerts = () => {
    fetch(`${API_URL}/api/donor/targeted-alerts/${user.unique_id}`).then((res) => res.json()).then((data) => setNotifications(data)).catch((err) => console.error("Error alerts:", err));
  };
  const fetchStats = () => {
    fetch(`${API_URL}/api/donor/profile-stats/${user.unique_id}`).then((res) => res.json()).then((data) => setStats(data)).catch((err) => console.error("Error stats:", err));
  };
  const fetchCamps = () => {
    fetch(`${API_URL}/api/camps/all`).then((res) => res.json()).then((data) => setCamps(data)).catch((err) => console.error("Error camps:", err));
  };
  reactExports.useEffect(() => {
    fetchAlerts();
    fetchStats();
    fetchCamps();
    const interval = setInterval(() => {
      fetchAlerts();
      fetchStats();
    }, 15e3);
    return () => clearInterval(interval);
  }, [user.unique_id]);
  const handleToggleStatus = async () => {
    if (stats.days_remaining > 0) {
      toast.info(`Medical Safety: You are in a mandatory rest period for ${stats.days_remaining} more days.`);
      return;
    }
    setIsToggling(true);
    try {
      const res = await fetch(`${API_URL}/api/donor/toggle-status/${user.unique_id}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStats((prev) => ({ ...prev, is_available: data.is_available }));
        toast.success(data.is_available ? "Visibility: ONLINE" : "Visibility: OFFLINE");
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsToggling(false);
    }
  };
  const handleRespond = async (notifId, status) => {
    const res = await fetch(`${API_URL}/api/notif/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notif_id: notifId, status })
    });
    if (res.ok) {
      toast.success(`Request ${status}`);
      fetchAlerts();
    }
  };
  const triggerDonateModal = (notifId) => {
    if (!bagId.trim()) return toast.error("Please enter Blood Bag Serial Number!");
    setSelectedNotifId(notifId);
    setShowDonateModal(true);
  };
  const finalizeDonation = async () => {
    setShowDonateModal(false);
    try {
      const res = await fetch(`${API_URL}/api/notif/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notif_id: selectedNotifId, bag_id: bagId })
      });
      if (res.ok) {
        toast.success("Hero! Donation Confirmed. Cooldown Started.");
        setBagId("");
        fetchAlerts();
        fetchStats();
      }
    } catch (err) {
      toast.error("Error recording donation.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 space-y-10 pb-20 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDonateModal,
        title: "Confirm Donation",
        message: `Verify Bag ID: ${bagId}. This action will start your mandatory 90-day medical recovery period.`,
        confirmText: "CONFIRM & DISPATCH",
        onConfirm: finalizeDonation,
        onCancel: () => setShowDonateModal(false)
      }
    ),
    stats.community === "Periyar University" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 text-white p-8 rounded-[40px] mb-10 relative overflow-hidden border-b-8 border-red-600 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row justify-between items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-4 rounded-[24px] shadow-xl shadow-red-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 32, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black italic tracking-tighter uppercase", children: "Periyar University Circle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1 italic", children: "Verified Institutional Member" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black text-red-500 uppercase tracking-widest", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black uppercase", children: stats.department || user.department || "General" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 180, className: "absolute right-[-40px] top-[-40px] opacity-5 -rotate-12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 lg:sticky lg:top-28 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl text-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-2 bg-red-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/edit-profile"),
            className: "absolute top-6 right-6 p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group border border-slate-100",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20, className: "group-hover:rotate-90 transition-transform duration-500" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 w-24 h-24 rounded-full mx-auto flex items-center justify-center text-red-600 mb-4 shadow-inner border-4 border-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 48 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-gray-800 tracking-tighter leading-none", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-600 font-black text-xs uppercase tracking-widest italic mt-2", children: [
          "#",
          user.unique_id
        ] }),
        stats.community === "Periyar University" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-col items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all duration-500 ${stats.is_verified ? "bg-green-50 border-green-100 text-green-600" : "bg-orange-50 border-orange-100 text-orange-600 animate-pulse"}`, children: [
          stats.is_verified ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black uppercase tracking-widest", children: stats.is_verified ? "Verified Donor" : "Verification Pending" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col items-center bg-gray-50 p-6 rounded-[32px] border-2 border-dashed border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeCanvas, { value: profileUrl, size: 140, level: "H" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 mt-4 uppercase tracking-widest leading-none", children: "Hero Digital ID" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 p-4 rounded-3xl border border-red-100 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "text-red-600 mb-1", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase leading-none text-center", children: "Donations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-red-600 mt-1", children: stats.donation_count })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleToggleStatus,
              disabled: isToggling || stats.days_remaining > 0,
              className: `p-4 rounded-3xl border flex flex-col items-center justify-center transition-all duration-500 transform active:scale-95 shadow-sm ${stats.is_available && stats.days_remaining === 0 ? "bg-green-50 border-green-200 hover:bg-green-100" : "bg-slate-100 border-slate-200 opacity-80"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3 h-3 rounded-full mb-1 ${stats.is_available && stats.days_remaining === 0 ? "bg-green-500 animate-pulse" : "bg-slate-400"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase leading-none", children: "Visibility" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-black uppercase mt-1 ${stats.is_available && stats.days_remaining === 0 ? "text-green-600" : "text-slate-500"}`, children: stats.days_remaining > 0 ? "Resting" : stats.is_available ? "Online" : "Offline" })
              ]
            }
          )
        ] }),
        stats.days_remaining > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-slate-900 text-white p-6 rounded-[32px] text-left relative overflow-hidden shadow-2xl animate-in zoom-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "absolute right-[-10px] bottom-[-10px] opacity-10", size: 80 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black opacity-50 uppercase tracking-widest leading-none mb-1 text-red-500", children: "Medical Recovery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-3xl font-black mt-1 text-white", children: [
            stats.days_remaining,
            " Days Left"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 w-full bg-white/10 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-red-500 h-full transition-all duration-1000",
              style: { width: `${(90 - stats.days_remaining) / 90 * 100}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] mt-3 opacity-40 font-bold italic", children: "* Automatic activation after rest period." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-2.5 rounded-2xl text-white shadow-lg shadow-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-gray-800 tracking-tight italic uppercase", children: "Urgent Help Alerts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full font-black", children: [
            notifications.length,
            " ACTIVE"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: notifications.length > 0 ? notifications.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-[40px] shadow-lg border border-gray-50 overflow-hidden group hover:shadow-2xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-red-100 text-red-600 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest italic", children: "Personal Request" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-2xl font-black text-gray-800 mt-2 italic leading-tight", children: [
                "Needs ",
                note.blood,
                " Blood"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500 font-bold text-sm mt-1", children: [
                note.patient,
                " @ ",
                note.hospital
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${note.status === "Pending" ? "bg-orange-50 text-orange-600 border-orange-100" : note.status === "Completed" ? "bg-green-600 text-white border-transparent shadow-lg shadow-green-100" : "bg-blue-50 text-blue-600 border-blue-100"}`, children: note.status === "Donated" ? "Blood Dispatched" : note.status === "Completed" ? "Process Finished" : note.status })
          ] }),
          note.status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRespond(note.notif_id, "Accepted"), className: "flex-1 bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-green-100 hover:bg-green-700 transition transform active:scale-95", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20 }),
              " ACCEPT"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRespond(note.notif_id, "Declined"), className: "flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 20 }),
              " DECLINE"
            ] })
          ] }),
          note.status === "Accepted" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 mt-6 animate-in slide-in-from-bottom duration-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${note.phone}`, className: "flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:bg-black transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 20, fill: "white" }),
                " CALL REQUESTER"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigate(`/blockchain/${note.request_id}`),
                  className: "flex-1 bg-white border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 hover:border-red-200 hover:text-red-600 transition",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16 }),
                    " VIEW LIVE LEDGER"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 p-6 rounded-[32px] border-2 border-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4", children: "Donation Confirmation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Enter Blood Bag Serial No.",
                  className: "w-full p-4 rounded-2xl border border-gray-200 outline-red-200 mb-4 font-bold",
                  value: bagId,
                  onChange: (e) => setBagId(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => triggerDonateModal(note.notif_id), className: "w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition", children: "MARK AS DONATED" })
            ] })
          ] }),
          note.status === "Donated" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-600 p-6 rounded-[32px] text-white flex items-center justify-center gap-4 shadow-xl animate-in zoom-in", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 32 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-black italic uppercase leading-none", children: "Bag in Transit" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1", children: "Safe delivery in progress." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate(`/blockchain/${note.request_id}`), className: "w-full border-2 border-dashed border-blue-100 text-blue-600 py-4 rounded-[32px] font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18 }),
              " VERIFY BLOCKCHAIN RECORD"
            ] })
          ] }),
          note.status === "Completed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-600 p-6 rounded-[32px] text-white flex items-center justify-center gap-4 shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 32 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-black italic uppercase leading-none text-white", children: "Life Saved!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1", children: "Patient received the blood." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => generateCertificate(user.name, note.blood, note.date, note.request_id),
                className: "w-full bg-slate-900 text-amber-400 py-5 rounded-[32px] font-black flex items-center justify-center gap-3 border-4 border-amber-400/20 shadow-2xl hover:scale-[1.02] transition transform active:scale-95",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 24, className: "animate-pulse" }),
                  "DOWNLOAD HERO CERTIFICATE"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate(`/blockchain/${note.request_id}`), className: "w-full border-2 border-dashed border-green-100 text-green-600 py-4 rounded-[32px] font-black text-xs flex items-center justify-center gap-2 hover:bg-green-50 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18 }),
              " VIEW FINAL LEDGER"
            ] })
          ] })
        ] }) }, note.notif_id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-20 rounded-[48px] border-2 border-dashed border-gray-100 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { size: 60, className: "text-gray-100 mb-6 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-black text-xl tracking-tight uppercase italic", children: "No urgent alerts for you." })
        ] }) })
      ] })
    ] }),
    camps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-10 border-t border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8 px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-100 p-2 rounded-xl text-red-600 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tent, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-gray-800 tracking-tight italic uppercase", children: "Upcoming Donation Drives" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2", children: camps.map((camp) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[320px] bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 relative overflow-hidden group hover:border-red-100 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 text-red-600 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 tracking-widest", children: camp.city }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-black text-gray-800 leading-tight mb-3 italic", children: camp.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-400 flex items-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-red-500" }),
          " ",
          camp.location
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-gray-50 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black text-gray-300 uppercase tracking-widest", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-black text-gray-700 flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
              " ",
              camp.date
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black text-gray-300 uppercase tracking-widest", children: "Timings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-black text-gray-700 flex items-center gap-1 mt-1 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
              " ",
              camp.time
            ] })
          ] })
        ] })
      ] }, camp.id)) })
    ] })
  ] });
};
const RequesterDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [history, setHistory] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({ total: 0, pending: 0, completed: 0 });
  const [showReceivedModal, setShowReceivedModal] = reactExports.useState(false);
  const [selectedReqId, setSelectedReqId] = reactExports.useState(null);
  const fetchHistory = () => {
    if (!user?.unique_id) return;
    fetch(`${API_URL}/api/requester/history/${user.unique_id}`, {
      credentials: "include"
    }).then((res) => res.json()).then((data) => {
      setHistory(data);
      const total = data.length;
      const pending = data.filter((r) => r.status !== "Completed" && r.status !== "Rejected").length;
      const completed = data.filter((r) => r.status === "Completed").length;
      setStats({ total, pending, completed });
    }).catch((err) => console.error("Error fetching history:", err));
  };
  reactExports.useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 1e4);
    return () => clearInterval(interval);
  }, [user.unique_id]);
  const triggerReceivedModal = (reqId) => {
    setSelectedReqId(reqId);
    setShowReceivedModal(true);
  };
  const finalizeReceived = async () => {
    setShowReceivedModal(false);
    try {
      const res = await fetch(`${API_URL}/api/request/complete/${selectedReqId}`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Life Saved! Case Closed Successfully.");
        fetchHistory();
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-500 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showReceivedModal,
        type: "success",
        title: "Confirm Blood Receipt",
        message: "Are you sure you have received the blood? This will officially close the request and notify the donor hero.",
        confirmText: "YES, I RECEIVED IT",
        onConfirm: finalizeReceived,
        onCancel: () => setShowReceivedModal(false)
      }
    ),
    user.community === "Periyar University" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 text-white p-8 rounded-[40px] mb-10 relative overflow-hidden border-b-8 border-red-600 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row justify-between items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-4 rounded-[24px] shadow-xl shadow-red-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 32, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black italic tracking-tighter uppercase", children: "Periyar University Circle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1", children: "Verified Institutional Requester" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black text-red-500 uppercase tracking-widest", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black uppercase", children: user.department || "General" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 180, className: "absolute right-[-40px] top-[-40px] opacity-5 -rotate-12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-900 p-4 rounded-[24px] text-white shadow-lg hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-black text-gray-800 tracking-tighter italic leading-none", children: [
              "Welcome, ",
              user.name,
              " 👋"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => navigate("/edit-profile"),
                className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group",
                title: "Edit Profile",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20, className: "group-hover:rotate-90 transition-transform duration-500" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2", children: [
            "Requester Control Center • ID: #",
            user.unique_id
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => navigate("/new-request"),
          className: "w-full md:w-auto bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition transform relative z-10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 24 }),
            " NEW REQUEST"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 20 }), label: "Total Requests", value: stats.total, color: "bg-slate-900" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { size: 20 }), label: "Active Requests", value: stats.pending, color: "bg-red-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20 }), label: "Closed Requests", value: stats.completed, color: "bg-green-600" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[40px] p-6 md:p-10 border border-gray-100 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-gray-800 text-xl mb-8 flex items-center gap-2 italic uppercase tracking-tighter border-b pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 24, className: "text-red-600" }),
        " Request History & Status"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8", children: history.length > 0 ? history.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative bg-slate-50 p-6 md:p-8 rounded-[32px] border border-gray-100 transition hover:bg-white hover:shadow-2xl hover:border-red-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-600 text-white w-16 h-16 rounded-[24px] flex flex-col items-center justify-center shadow-lg shadow-red-100 group-hover:scale-110 transition duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black opacity-60 leading-none mb-1 uppercase", children: "Group" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black leading-none", children: req.bloodGroup })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-gray-800 text-2xl tracking-tight leading-none", children: req.patient }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-400 flex items-center gap-1 mt-2 uppercase tracking-widest", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-red-500" }),
                " ",
                req.hospital
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-auto flex flex-col items-end gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2 border ${req.status === "Completed" ? "bg-green-50 text-green-600 border-green-100" : req.status === "On the way" ? "bg-blue-600 text-white border-transparent animate-pulse shadow-blue-200 shadow-lg" : req.status === "Accepted" ? "bg-blue-100 text-blue-600 border-blue-100" : req.status === "Rejected" ? "bg-gray-100 text-gray-400" : "bg-orange-50 text-orange-600 border-orange-100"}`, children: [
              req.status === "On the way" && /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
              req.status === "On the way" ? "Blood Dispatched" : req.status
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-3 w-full", children: [
              ["Accepted", "On the way", "Completed"].includes(req.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigate(`/blockchain/${req.id}`),
                  className: "flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[9px] tracking-widest hover:bg-black transition shadow-lg",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 14, className: "text-red-500" }),
                    " VIEW BLOCKCHAIN LEDGER"
                  ]
                }
              ),
              req.status === "On the way" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => triggerReceivedModal(req.id),
                  className: "flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[9px] tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }),
                    " I RECEIVED THE BLOOD"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-300 italic tracking-widest uppercase", children: req.date })
          ] })
        ] }),
        req.assigned_donor && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-5 bg-white border-2 border-dashed border-slate-100 rounded-[28px] animate-in slide-in-from-top duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 p-3 rounded-2xl text-red-600 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 24 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1", children: "Assigned Hero" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-gray-800 text-lg uppercase tracking-tight", children: req.assigned_donor.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `tel:${req.assigned_donor.phone}`,
                  className: "flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-black transition active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, fill: "white" }),
                    " CALL"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `https://wa.me/${req.assigned_donor.phone.replace(/\s/g, "")}?text=${encodeURIComponent(
                    `Hello ${req.assigned_donor.name}, I am ${user.name} from LifeDrop. I have sent a blood request for patient ${req.patient} (Group: ${req.bloodGroup}) at ${req.hospital}. Please check the app and help if possible! 🙏`
                  )}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-green-700 transition active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 16, fill: "white" }),
                    " WHATSAPP"
                  ]
                }
              )
            ] })
          ] }),
          req.status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold text-orange-500 mt-4 uppercase tracking-[0.2em] italic text-center sm:text-left flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 10 }),
            " Waiting for donor to accept on app. You can contact them directly above for faster response."
          ] })
        ] }),
        req.status === "Pending" && !req.assigned_donor && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-3 bg-orange-50 p-4 rounded-2xl border border-orange-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-500 p-1.5 rounded-full text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-orange-600 italic", children: "Searching for compatible heroes nearby. You will see donor details once you assign a request." })
        ] })
      ] }, req.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-32 bg-slate-50 rounded-[48px] border-2 border-dashed border-gray-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { size: 48, className: "text-gray-100" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-black text-xl tracking-tight", children: "Your Dashboard is Empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs italic mt-2 uppercase tracking-widest", children: "Start saving lives by creating your first request." })
      ] }) })
    ] })
  ] });
};
const StatCard = ({ icon, label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${color} p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.03]`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition duration-700 group-hover:rotate-12", children: React.cloneElement(icon, { size: 120 }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-5xl font-black tracking-tighter", children: value })
  ] })
] });
const BloodRequestForm = ({ user }) => {
  const navigate = useNavigate();
  const [position, setPosition] = reactExports.useState({ lat: 13.0827, lng: 80.2707 });
  const [formData, setFormData] = reactExports.useState({
    patientName: "",
    contactNumber: "",
    bloodGroup: "",
    units: 1,
    urgency: 5,
    hospital: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Current User:", user);
    if (!user || !user.unique_id) {
      toast.error("Error: User session expired. Please login again.");
      return;
    }
    const finalData = {
      ...formData,
      lat: position.lat,
      lng: position.lng,
      requester_id: user.unique_id
      // Intha unique_id thaan missing aagudhu
    };
    console.log("Sending Data to Backend:", finalData);
    try {
      const res = await fetch(`${API_URL}/api/request/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.info("Request Posted! Loading nearby donors...");
        navigate(`/matching/${data.id}`);
      } else {
        toast.error("Backend Error: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate(-1), className: "mb-4 flex items-center gap-1 text-gray-500 font-bold hover:text-red-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }),
      " Back to Dashboard"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-8 text-white flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-3 rounded-2xl animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 30 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black italic", children: "Create Blood Request" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-60 text-xs uppercase tracking-widest font-bold", children: "Emergency Portal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Patient Name", className: "p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", onChange: (e) => setFormData({ ...formData, patientName: e.target.value }), required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", placeholder: "Contact Number", className: "p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", onChange: (e) => setFormData({ ...formData, contactNumber: e.target.value }), required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "p-4 bg-gray-50 rounded-2xl border-none font-bold", onChange: (e) => setFormData({ ...formData, bloodGroup: e.target.value }), required: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Blood Group Needed" }),
            ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map((bg) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: bg, children: bg }, bg))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", placeholder: "Units Needed", min: "1", className: "p-4 bg-gray-50 rounded-2xl border-none font-bold", onChange: (e) => setFormData({ ...formData, units: e.target.value }), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Hospital Name & Branch", className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", onChange: (e) => setFormData({ ...formData, hospital: e.target.value }), required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 p-6 rounded-3xl border border-red-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-black text-red-800", children: "Urgency Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-600 font-black", children: [
              formData.urgency,
              "/10"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: "1",
              max: "10",
              value: formData.urgency,
              onChange: (e) => setFormData({ ...formData, urgency: e.target.value }),
              className: "w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-bold text-red-400 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "NORMAL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CRITICAL" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LocationPicker, { position, setPosition }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition", children: "FIND MATCH & NEARBY DONORS" })
      ] })
    ] })
  ] });
};
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
const DonorMatching = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = reactExports.useState({ request: null, matches: [] });
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    fetch(`${API_URL}/api/match-donors/${id}`, {
      credentials: "include"
      // 🔥 MUST
    }).then((res) => res.json()).then((val) => {
      setData(val);
      setLoading(false);
    }).catch((err) => console.error("Fetch error:", err));
  }, [id]);
  const sendRequest = async (donorId) => {
    try {
      const res = await fetch(`${API_URL}/api/send-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ donor_id: donorId, request_id: id })
      });
      const result = await res.json();
      toast.success(result.message);
    } catch (err) {
      toast.error("Failed to send request.");
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black text-gray-800 tracking-tight italic uppercase", children: "Scanning for Heroes..." })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[350px] md:h-[450px] lg:h-[calc(100vh-150px)] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-4 md:border-8 border-white lg:sticky lg:top-28 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(MapContainer, { center: [data.request.lat, data.request.lng], zoom: 12, style: { height: "100%", width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position: [data.request.lat, data.request.lng], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: "🚨 Emergency Location" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { center: [data.request.lat, data.request.lng], radius: 1e4, pathOptions: { color: "red", fillOpacity: 0.05 } }),
      data.matches.map((donor) => /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position: [donor.lat, donor.lng], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-600 font-black", children: donor.blood }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: donor.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-green-600", children: [
          donor.match,
          "% Match"
        ] })
      ] }) }) }, donor.unique_id))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black text-gray-800 tracking-tighter italic text-red-600 uppercase", children: "Heroes Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1", children: [
            "Requesting ",
            data.request.blood,
            " Group"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-white uppercase tracking-tighter", children: [
            data.request.community,
            " Circle"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/requester-dashboard"), className: "bg-slate-50 p-3 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5", children: data.matches.length > 0 ? data.matches.map((donor) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 w-14 h-14 md:w-16 md:h-16 rounded-3xl flex items-center justify-center group-hover:bg-red-50 transition border border-transparent group-hover:border-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "text-red-600", fill: donor.match > 85 ? "currentColor" : "none", size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-gray-800 text-lg md:text-xl leading-none", children: donor.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[7px] md:text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${donor.isExact ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`, children: donor.isExact ? "Exact Match" : "Compatible" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest", children: [
                  "Donor Group: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-bold", children: donor.blood })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 md:gap-3 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] md:text-[9px] font-black text-gray-400 flex items-center gap-1 uppercase bg-slate-50 px-2 py-1 rounded-lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, className: "text-red-500" }),
                    " ",
                    donor.distance,
                    " KM"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] md:text-[9px] font-black text-gray-400 flex items-center gap-1 uppercase bg-slate-50 px-2 py-1 rounded-lg border-l-2 border-green-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 10, className: "text-green-500" }),
                    " ",
                    donor.healthScore,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-100 p-1 rounded-full text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 10 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-slate-400 tracking-widest italic", children: donor.phone }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] font-black bg-slate-800 text-white px-2 py-0.5 rounded-full tracking-widest uppercase opacity-20", children: "Masked" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-2xl md:text-3xl font-black ${donor.match > 80 ? "text-green-600" : "text-orange-500"}`, children: [
              donor.match,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none", children: "Match" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between border-t border-dashed border-gray-100 pt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] md:text-[9px] font-bold text-gray-300 tracking-[0.2em] uppercase italic", children: [
            "ID: #",
            donor.unique_id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => sendRequest(donor.unique_id),
              className: "bg-slate-900 text-white px-6 md:px-10 py-3 md:py-3.5 rounded-[20px] font-black text-[10px] md:text-xs shadow-xl flex items-center gap-2 hover:bg-red-600 transition-all duration-300 transform active:scale-95 shadow-slate-200 uppercase tracking-widest",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }),
                " Send Request"
              ]
            }
          )
        ] })
      ] }, donor.unique_id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-10 md:p-20 rounded-[48px] border-2 border-dashed border-gray-100 text-center flex flex-col items-center animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 60, className: "text-gray-100 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-black uppercase tracking-widest", children: "No compatible donors found" })
      ] }) })
    ] })
  ] });
};
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = reactExports.useState(null);
  const [broadcastMsg, setBroadcastMsg] = reactExports.useState("");
  const [allBroadcasts, setAllBroadcasts] = reactExports.useState([]);
  const [showDeleteModal, setShowDeleteModal] = reactExports.useState(false);
  const [selectedBroadcastId, setSelectedBroadcastId] = reactExports.useState(null);
  const fetchAdminData = () => {
    fetch(`${API_URL}/api/admin/stats`, {
      credentials: "include"
    }).then((res) => res.json()).then((val) => setData(val)).catch((err) => console.error("Admin fetch error:", err));
  };
  const fetchBroadcasts = () => {
    fetch(`${API_URL}/api/broadcasts`, {
      credentials: "include"
    }).then((res) => res.json()).then((data2) => setAllBroadcasts(data2)).catch((err) => console.error("Broadcast fetch error:", err));
  };
  reactExports.useEffect(() => {
    fetchAdminData();
    fetchBroadcasts();
    const interval = setInterval(() => {
      fetchAdminData();
    }, 1e4);
    return () => clearInterval(interval);
  }, []);
  const sendBroadcast = async () => {
    if (!broadcastMsg.trim()) return toast.error("Please type a message!");
    const res = await fetch(`${API_URL}/api/admin/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: broadcastMsg })
    });
    if (res.ok) {
      setBroadcastMsg("");
      fetchBroadcasts();
      toast.success("Emergency Alert Dispatched Globally! 📢");
    }
  };
  const triggerDeleteModal = (id) => {
    setSelectedBroadcastId(id);
    setShowDeleteModal(true);
  };
  const finalizeDelete = async () => {
    setShowDeleteModal(false);
    try {
      const res = await fetch(`${API_URL}/api/broadcast/delete/${selectedBroadcastId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Broadcast removed from all users.");
        fetchBroadcasts();
      }
    } catch (err) {
      toast.error("Error deleting broadcast.");
    }
  };
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen bg-slate-900 text-white font-black italic text-2xl animate-pulse uppercase tracking-tighter", children: "Accessing System Data..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteModal,
        title: "Remove Broadcast?",
        message: "Are you sure you want to delete this emergency alert? It will be removed from all user dashboards immediately.",
        confirmText: "YES, DELETE ALERT",
        onConfirm: finalizeDelete,
        onCancel: () => setShowDeleteModal(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl gap-4 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black italic tracking-tighter uppercase", children: "System Monitoring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1", children: "LifeDrop Management Portal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 32, className: "text-red-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 200, className: "absolute right-[-50px] top-[-50px] opacity-5 -rotate-12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 p-6 md:p-8 rounded-[40px] border-2 border-dashed border-red-200 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600 p-2 rounded-xl text-white animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-red-700 uppercase tracking-widest text-sm italic", children: "Global Emergency Broadcast" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: broadcastMsg,
              placeholder: "Type urgent blood requirement or system alerts here...",
              className: "flex-1 p-5 rounded-[24px] border-2 border-transparent focus:border-red-300 outline-none font-bold text-gray-700 shadow-inner",
              onChange: (e) => setBroadcastMsg(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: sendBroadcast,
              className: "bg-red-600 text-white px-10 py-5 rounded-[24px] font-black flex items-center justify-center gap-2 shadow-xl shadow-red-100 hover:bg-red-700 transition active:scale-95",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 20 }),
                " DISPATCH"
              ]
            }
          )
        ] }),
        allBroadcasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-black text-red-400 uppercase tracking-widest mb-3", children: [
            "Live Dispatched Alerts (",
            allBroadcasts.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: allBroadcasts.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 pl-5 rounded-2xl flex items-center gap-4 shadow-sm border border-red-100 animate-in slide-in-from-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-600", children: b.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => triggerDeleteModal(b.id),
                className: "p-2 hover:bg-red-50 rounded-xl text-red-300 hover:text-red-600 transition",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
              }
            )
          ] }, b.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 150, className: "absolute right-[-20px] top-[-20px] opacity-[0.03] -rotate-12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "Total Users",
          value: data.stats.donors + data.stats.requesters,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
          color: "bg-slate-800",
          onClick: () => navigate("/admin/details/users")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "Registered Donors",
          value: data.stats.donors,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
          color: "bg-blue-600",
          onClick: () => navigate("/admin/details/donors")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "Active Requests",
          value: data.stats.pending,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 24 }),
          color: "bg-orange-500",
          onClick: () => navigate("/admin/details/requests?type=active")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "Life Saves",
          value: data.stats.completed,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { size: 24 }),
          color: "bg-green-600",
          onClick: () => navigate("/admin/details/requests?type=completed")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "University Dashboard",
          value: "PU Salem",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(School, { size: 24 }),
          color: "bg-indigo-900",
          onClick: () => navigate("/admin/university-dashboard")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "Inventory Stock",
          value: "Bank",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 24 }),
          color: "bg-rose-500",
          onClick: () => navigate("/admin/inventory")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "System Insights",
          value: "Chart",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 24 }),
          color: "bg-indigo-600",
          onClick: () => navigate("/admin/analytics")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdminCard,
        {
          label: "Camp Events",
          value: "Live",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tent, { size: 24 }),
          color: "bg-emerald-600",
          onClick: () => navigate("/admin/camps")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 border-b border-gray-50 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "text-red-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-gray-800 text-xl italic uppercase tracking-tighter", children: "Live Activity Feed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-100 text-green-600 text-[10px] font-black px-4 py-1 rounded-full animate-pulse", children: "REAL-TIME" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Request ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Patient Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Blood Group" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Hospital Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Live Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: data.recent.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 transition group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6 font-bold text-gray-400 text-xs tracking-widest", children: [
            "#",
            req.id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 font-black text-gray-800 tracking-tight", children: req.patient }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-red-50 text-red-600 px-4 py-1 rounded-xl font-black text-xs border border-red-100 inline-block", children: req.blood }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-[10px] font-bold text-gray-500 italic uppercase leading-tight max-w-[150px]", children: req.hospital }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm flex items-center justify-center w-fit gap-1 ${req.status === "Completed" ? "bg-green-600 text-white" : req.status === "On the way" ? "bg-blue-600 text-white animate-pulse" : "bg-orange-100 text-orange-600"}`, children: [
            req.status === "On the way" && /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 10 }),
            " ",
            req.status
          ] }) })
        ] }, req.id)) })
      ] }) })
    ] })
  ] });
};
const AdminCard = ({ label, value, icon, color, onClick }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "div",
  {
    onClick,
    className: `${color} p-8 rounded-[40px] text-white shadow-2xl flex flex-col justify-between h-52 relative overflow-hidden group cursor-pointer hover:scale-[1.03] transition-all duration-300 active:scale-95`,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition duration-700 group-hover:rotate-12", children: React.cloneElement(icon, { size: 140 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5 relative z-10", children: [
        icon,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-5xl font-black tracking-tighter mt-4", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold opacity-0 group-hover:opacity-60 transition-all duration-300 uppercase tracking-widest mt-2 flex items-center gap-1", children: [
          "Detailed Analytics ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "→" })
        ] })
      ] })
    ]
  }
);
const AdminDetails = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [list, setList] = reactExports.useState([]);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [isExporting, setIsExporting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let url = "";
    if (category === "users") url = `${API_URL}/api/admin/all-users`;
    if (category === "donors") url = `${API_URL}/api/admin/donors-detailed`;
    if (category === "requests") url = `${API_URL}/api/admin/requests-detailed?type=${type}`;
    fetch(url).then((res) => res.json()).then((data) => setList(data));
  }, [category, type]);
  const filteredList = list.filter(
    (item) => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.patient && item.patient.toLowerCase().includes(searchTerm.toLowerCase()) || item.blood && item.blood.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const saveAndShare = async (fileName, base64Data, mimeType) => {
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });
      await Share.share({
        title: "LifeDrop Report",
        text: `Exported ${category} report`,
        url: result.uri,
        dialogTitle: "Open or Share Report"
      });
      toast.success("Report ready!");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to save file on device.");
    }
  };
  const exportToExcel = async () => {
    setIsExporting(true);
    const fileName = `LifeDrop_${category}_Report.xlsx`;
    const worksheet = utils.json_to_sheet(filteredList);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    if (Capacitor.getPlatform() === "web") {
      writeFileSync(workbook, fileName);
      toast.success("Excel downloaded!");
    } else {
      const excelBase64 = writeSync(workbook, { bookType: "xlsx", type: "base64" });
      await saveAndShare(fileName, excelBase64);
    }
    setIsExporting(false);
  };
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new E();
      const title = `LifeDrop ${category.toUpperCase()} Report`;
      doc.setFontSize(20);
      doc.setTextColor(220, 38, 38);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 30);
      let columns = [];
      let rows = [];
      if (category === "users") {
        columns = ["Name", "Email", "Role", "Phone"];
        rows = filteredList.map((item) => [item.name, item.email, item.role, item.phone]);
      } else if (category === "donors") {
        columns = ["Status", "Name", "ID", "Blood", "Health", "Phone"];
        rows = filteredList.map((item) => [item.status, item.name, item.u_id, item.blood, `${item.health}%`, item.phone]);
      } else {
        columns = ["Patient", "Group", "Requester", "Donor", "Hospital"];
        rows = filteredList.map((item) => [item.patient, item.blood, item.requester, item.donor || "N/A", item.hospital]);
      }
      autoTable(doc, {
        startY: 40,
        head: [columns],
        body: rows,
        theme: "striped",
        headStyles: { fillColor: [220, 38, 38] }
      });
      const fileName = `LifeDrop_${category}_Report.pdf`;
      if (Capacitor.getPlatform() === "web") {
        doc.save(fileName);
        toast.success("PDF downloaded!");
      } else {
        const pdfBase64 = doc.output("datauristring").split(",")[1];
        await saveAndShare(fileName, pdfBase64, "application/pdf");
      }
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Error generating PDF");
    }
    setIsExporting(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 space-y-6 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-red-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-black capitalize text-gray-800", children: [
            type === "completed" ? "Life Saves" : type ? type : "Total",
            " ",
            category
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-red-600 uppercase tracking-widest italic", children: "Report Audit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: exportToExcel,
            disabled: isExporting,
            className: "flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl font-black text-[10px] border border-green-100 active:scale-95 transition",
            children: [
              isExporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 16 }),
              " EXCEL"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: exportToPDF,
            disabled: isExporting,
            className: "flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] hover:bg-black transition shadow-lg active:scale-95",
            children: [
              isExporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
              " PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search...",
              className: "p-2.5 pl-8 bg-slate-50 rounded-xl border-none outline-red-200 font-bold text-xs w-full md:w-48",
              onChange: (e) => setSearchTerm(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-3 text-gray-300", size: 14 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-black", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        category === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Phone" })
        ] }),
        category === "donors" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Donor Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Blood" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Location" })
        ] }),
        category === "requests" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Patient" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Group" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Requester" }),
          type === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Donor Hero" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Hospital" }),
          type === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-center", children: "Ledger" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: filteredList.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 transition font-medium text-gray-700", children: [
        category === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 font-black text-gray-800", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs", children: item.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.role === "Donor" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`, children: item.role }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs", children: item.phone })
        ] }),
        category === "donors" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status === "Active" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`, children: item.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-gray-800", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400", children: [
              "ID: #",
              item.u_id
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xl font-black text-red-600", children: item.blood }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6 font-black text-green-600", children: [
            item.health,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-[10px] font-bold text-gray-400", children: item.location })
        ] }),
        category === "requests" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 font-black text-gray-800", children: item.patient }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xl font-black text-red-600", children: item.blood }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs font-bold text-gray-500", children: item.requester }),
          type === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 font-black text-green-600 text-xs uppercase", children: item.donor }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs italic text-gray-400", children: item.hospital }),
          type === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate(`/blockchain/${item.id}`),
              className: "bg-slate-900 text-white p-2 rounded-lg hover:bg-red-600 transition shadow-md",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16 })
            }
          ) })
        ] })
      ] }, idx)) })
    ] }) }) })
  ] });
};
const InventoryManager = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const fetchInventory = () => {
    fetch(`${API_URL}/api/admin/inventory`, {
      credentials: "include"
      // 🔥 MUST
    }).then((res) => res.json()).then((data) => {
      setInventory(data);
      setLoading(false);
    });
  };
  reactExports.useEffect(() => {
    fetchInventory();
  }, []);
  const handleUpdate = async (group, action) => {
    const res = await fetch(`${API_URL}/api/admin/inventory/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ group, action })
    });
    if (res.ok) fetchInventory();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white p-8 rounded-[40px] shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-slate-100 p-2 rounded-xl text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black italic tracking-tighter", children: "Blood Bank Inventory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 12 }),
            " Live Stock Management"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: fetchInventory, className: "bg-slate-900 text-white p-3 rounded-2xl hover:rotate-180 transition-all duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: inventory.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-[40px] shadow-xl border border-gray-50 flex flex-col items-center group hover:border-red-100 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-24 h-24 flex items-center justify-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "48", cy: "48", r: "40", stroke: "#f1f5f9", strokeWidth: "8", fill: "transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "48",
              cy: "48",
              r: "40",
              stroke: item.units < 5 ? "#ef4444" : "#22c55e",
              strokeWidth: "8",
              fill: "transparent",
              strokeDasharray: 251.2,
              strokeDashoffset: 251.2 - Math.min(item.units, 100) / 100 * 251.2,
              strokeLinecap: "round",
              className: "transition-all duration-1000"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black text-gray-800", children: item.group }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-3xl font-black text-gray-800", children: [
        item.units,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 font-bold uppercase", children: "Units" })
      ] }),
      item.units < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-black text-red-500 flex items-center gap-1 mt-1 animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 10 }),
        " LOW STOCK ALERT"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-gray-300 font-bold mt-4 uppercase", children: [
        "Last Updated: ",
        item.updated
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleUpdate(item.group, "sub"),
            className: "flex-1 bg-slate-50 text-gray-400 p-3 rounded-2xl hover:bg-red-50 hover:text-red-600 transition flex justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleUpdate(item.group, "add"),
            className: "flex-1 bg-slate-50 text-gray-400 p-3 rounded-2xl hover:bg-green-50 hover:text-green-600 transition flex justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 20 })
          }
        )
      ] })
    ] }, item.group)) })
  ] });
};
Chart.register(ArcElement, plugin_tooltip, plugin_legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, plugin_title);
const AdminAnalytics = () => {
  const [data, setData] = reactExports.useState(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    fetch(`${API_URL}/api/admin/analytics`, {
      credentials: "include"
      // 🔥 MUST
    }).then((res) => res.json()).then((val) => setData(val));
  }, []);
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen flex items-center justify-center bg-slate-900 text-red-500 font-black text-xl animate-pulse italic", children: "GENERATING NEURAL INSIGHTS..." });
  const barData = {
    labels: data.labels,
    datasets: [
      {
        label: "Donors (Supply)",
        data: data.donors,
        backgroundColor: "#3b82f6",
        borderRadius: 8
      },
      {
        label: "Requests (Demand)",
        data: data.requests,
        backgroundColor: "#ef4444",
        borderRadius: 8
      }
    ]
  };
  const doughnutData = {
    labels: ["Success Saves", "Pending Requests"],
    datasets: [{
      data: [data.total_saves, data.total_requests - data.total_saves],
      backgroundColor: ["#10b981", "#f1f5f9"],
      hoverOffset: 4,
      borderWidth: 0
    }]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in zoom-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white p-8 rounded-[40px] shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-red-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black italic tracking-tighter", children: "System Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-blue-600 uppercase tracking-widest", children: "Real-time Data Intelligence" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, className: "text-green-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-green-700 uppercase", children: "System Optimized" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: "Total Donors", value: data.total_donors, sub: "Active Nodes", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-blue-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: "Total Requests", value: data.total_requests, sub: "Demand Rate", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "text-red-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: "Lives Saved", value: data.total_saves, sub: "Success Stories", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "text-green-600" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white p-8 rounded-[48px] shadow-2xl border border-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-gray-800 text-xl italic uppercase", children: "Supply vs Demand Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest", children: "Comparison of Donors vs Requirements per Blood Group" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[350px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { data: barData, options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-8 rounded-[48px] shadow-2xl text-white flex flex-col items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-gray-400 text-xs uppercase tracking-[0.3em] mb-2", children: "Overall Success Ratio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[200px] mx-auto my-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Doughnut, { data: doughnutData }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-5xl font-black italic", children: [
            (data.total_saves / (data.total_requests || 1) * 100).toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-green-500 uppercase mt-2 tracking-widest", children: "Request Completion Rate" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-8 p-6 bg-white/5 rounded-[32px] border border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black opacity-40 uppercase mb-4", children: "Critical Insight" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold leading-relaxed italic", children: data.total_requests > data.total_donors ? "⚠️ Demand is currently exceeding supply. Increase donor outreach." : "✅ System is stable. Supply meets current demand levels." })
        ] })
      ] })
    ] })
  ] });
};
const KPICard = ({ label, value, sub, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 flex items-center gap-6 group hover:border-red-100 transition duration-500", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 p-4 rounded-3xl group-hover:bg-red-50 transition", children: icon }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-4xl font-black text-gray-800 tracking-tighter leading-none", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-300 mt-2 italic", children: sub })
  ] })
] });
const CampManager = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = reactExports.useState([]);
  const [formData, setFormData] = reactExports.useState({ title: "", location: "", city: "", date: "", time: "" });
  const fetchCamps = () => {
    fetch(`${API_URL}/api/camps/all`).then((res) => res.json()).then((data) => setCamps(data));
  };
  reactExports.useEffect(() => {
    fetchCamps();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/admin/camps/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      toast.success("Camp Scheduled!");
      setFormData({ title: "", location: "", city: "", date: "", time: "" });
      fetchCamps();
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this camp?")) return;
    const res = await fetch(`${API_URL}/api/admin/camps/delete/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) fetchCamps();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-10 space-y-10 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-white p-3 rounded-full shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black italic tracking-tighter", children: "Camp Organizer" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-gray-800 text-xl mb-6 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "text-red-600" }),
          " Schedule New Camp"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Camp Title (e.g. Mega Blood Drive)", className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Full Address", className: "w-full p-4 bg-gray-50 rounded-2xl border-none font-bold", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "City", className: "w-full p-4 bg-gray-50 rounded-2xl border-none font-bold", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }), required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "p-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-400", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", className: "p-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-400", value: formData.time, onChange: (e) => setFormData({ ...formData, time: e.target.value }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition", children: "PUBLISH CAMP" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-gray-400 text-sm uppercase tracking-[0.3em] px-2", children: "Upcoming Events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: camps.map((camp) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 text-white p-8 rounded-[48px] shadow-xl flex flex-col md:flex-row justify-between items-center group relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tent, { className: "absolute right-[-20px] bottom-[-20px] opacity-10", size: 150 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
              " ",
              camp.date,
              " | ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }),
              " ",
              camp.time
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-black italic", children: camp.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-red-600" }),
              " ",
              camp.location,
              ", ",
              camp.city
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(camp.id), className: "mt-6 md:mt-0 p-4 bg-white/10 rounded-2xl text-white hover:bg-red-600 transition z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 24 }) })
        ] }, camp.id)) })
      ] })
    ] })
  ] });
};
const BlockchainView = () => {
  const { id } = useParams();
  const [chain, setChain] = reactExports.useState([]);
  const trackingUrl = window.location.href;
  reactExports.useEffect(() => {
    fetch(`${API_URL}/api/blockchain/view/${id}`, {
      credentials: "include"
      // 🔥 MUST
    }).then((res) => res.json()).then((data) => setChain(data));
  }, [id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto p-6 md:p-10 space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 40 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black italic tracking-tighter", children: "LifeDrop Immutable Ledger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]", children: "Powered by Blockchain Technology" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center gap-8 shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeCanvas, { value: trackingUrl, size: 120 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-gray-800 text-xl", children: "Digital Verification QR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Scan this QR on the blood bag to verify the complete donation history and donor eligibility." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent", children: chain.map((block, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in slide-in-from-bottom", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-[32px] shadow-xl border border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-red-600 text-xs uppercase tracking-widest", children: block.event }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-gray-300", children: block.time })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 p-4 rounded-2xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[10px] font-mono text-gray-500 overflow-hidden", children: JSON.stringify(block.data, null, 2) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] font-mono text-gray-300 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 8 }),
            " PREV: ",
            block.prev_hash
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] font-mono text-green-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 8 }),
            " CURR: ",
            block.curr_hash
          ] })
        ] })
      ] })
    ] }, idx)) })
  ] });
};
const Contact = () => {
  const [formData, setFormData] = reactExports.useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = reactExports.useState(false);
  useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.info("Thank you! Your suggestion has been sent to Admin.");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in zoom-in duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black italic tracking-tighter mb-4", children: "Contact Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed mb-8", children: "Have a suggestion or need help? Send us a message and our admin team will get back to you." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-600/20 p-3 rounded-2xl text-red-500 border border-red-600/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-500 uppercase", children: "Support Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "lifedrop108@gmail.com" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-600/20 p-3 rounded-2xl text-green-500 border border-green-600/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-500 uppercase", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-green-400", children: "Response in 24 Hours" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-red-600/10 rounded-full blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-10 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 10 }),
          " Full Name"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "John Doe", className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 10 }),
          " Email Address"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "john@example.com", className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 10 }),
          " Your Message"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: "4", placeholder: "How can we improve?", className: "w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold resize-none", value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition flex items-center justify-center gap-2",
          children: [
            loading ? "SENDING..." : "SEND MESSAGE",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight$1, { size: 18 })
          ]
        }
      )
    ] })
  ] }) });
};
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [email, setEmail] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message || "Email not found!");
      }
    } catch (err) {
      toast.error("Connection error!");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/check-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Verified Successfully!");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP! Please check again.");
      }
    } catch (err) {
      toast.error("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Error updating password!");
      }
    } catch (err) {
      toast.error("Server error!");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md mx-auto p-6 md:p-10 mt-10 animate-in fade-in zoom-in duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 p-8 text-white text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 32, className: "text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black italic", children: "Account Recovery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1", children: "Secure Password Reset" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendOTP, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 text-center", children: "Enter your email to receive a reset code." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-4 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "Email Address", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", onChange: (e) => setEmail(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2", children: [
          loading ? "SENDING..." : "SEND RESET CODE",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight$1, { size: 18 })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleVerifyOTP, className: "space-y-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
          "Enter the 4-digit code sent to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800", children: email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", maxLength: "4", placeholder: "0000", className: "w-full p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-red-500 outline-none text-center text-3xl font-black tracking-[15px]", onChange: (e) => setOtp(e.target.value), required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2", children: loading ? "VERIFYING..." : "VERIFY CODE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStep(1), className: "text-[10px] font-bold text-gray-400 uppercase hover:text-red-600 transition", children: "Change Email" })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleReset, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 text-center", children: "Create a strong new password." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-4 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "New Password", className: "w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold", onChange: (e) => setNewPassword(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg", children: loading ? "UPDATING..." : "UPDATE PASSWORD" })
      ] })
    ] })
  ] }) });
};
const EditProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    fullName: user?.name || "",
    phone: ""
    // Fetch pannanum
  });
  const [position, setPosition] = reactExports.useState({ lat: 13.0827, lng: 80.2707 });
  reactExports.useEffect(() => {
    const fetchProfile = async () => {
      user.role === "donor" ? `/api/donor/${user.unique_id}` : `/api/requester/history/${user.unique_id}`;
      if (user.role === "donor") {
        const res = await fetch(`${API_URL}/api/donor/${user.unique_id}`);
        const data = await res.json();
        setFormData({ fullName: data.name, phone: data.phone });
        setPosition(data.location);
      }
    };
    fetchProfile();
  }, [user]);
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatePayload = {
      full_name: formData.fullName,
      phone: formData.phone,
      lat: position.lat,
      lng: position.lng
    };
    console.log("Calling API:", `${API_URL}/api/profile/update/${user.role}/${user.unique_id}`);
    try {
      const res = await fetch(`${API_URL}/api/profile/update/${user.role}/${user.unique_id}`, {
        method: "PUT",
        // ✅ Method PUT-ah irukanum
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        toast.success("Profile Updated!");
        navigate(-1);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Network Error:", err);
      toast.error("Connection error. Check if backend is live.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-slate-400 hover:text-red-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-black italic tracking-tighter flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "text-red-600" }),
        " Account Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12" }),
      " "
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdate, className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-gray-800 uppercase text-sm tracking-widest border-b pb-4", children: "Personal Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-4 top-4 text-gray-300", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: formData.fullName,
                  className: "w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none outline-red-200 font-bold",
                  onChange: (e) => setFormData({ ...formData, fullName: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase ml-2", children: "Phone Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-4 top-4 text-gray-300", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "tel",
                  value: formData.phone,
                  className: "w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none outline-red-200 font-bold",
                  onChange: (e) => setFormData({ ...formData, phone: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-blue-600 shrink-0", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-blue-700 leading-relaxed uppercase", children: "Email and Blood Group are verified and cannot be changed manually. Contact admin for corrections." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-gray-800 uppercase text-sm tracking-widest border-b pb-4", children: "Location Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LocationPicker, { position, setPosition }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition flex items-center justify-center gap-2 active:scale-95",
            children: loading ? "SAVING..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 20 }),
              " SAVE CHANGES"
            ] })
          }
        )
      ] })
    ] })
  ] });
};
const UniversityDashboard = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/admin-dashboard"), className: "bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-slate-400 hover:text-red-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black italic tracking-tighter uppercase", children: "Periyar University Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-red-600 uppercase tracking-[0.3em]", children: "Institutional Management Hub" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuCard, { label: "Verify Donors", sub: "Pending ID Audits", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, {}), color: "bg-orange-500", onClick: () => navigate("/admin/verifications") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuCard, { label: "Total Donors", sub: "Verified PU Members", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {}), color: "bg-blue-600", onClick: () => navigate("/admin/university/details/donors") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuCard, { label: "Total Requesters", sub: "PU Access List", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {}), color: "bg-purple-600", onClick: () => navigate("/admin/university/details/requesters") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuCard, { label: "Donation History", sub: "PU Internal Saves", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, {}), color: "bg-green-600", onClick: () => navigate("/admin/university/details/history") })
    ] })
  ] });
};
const MenuCard = ({ label, sub, icon, color, onClick }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: "bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 flex flex-col items-center text-center group hover:border-red-100 transition-all duration-500", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${color} p-4 rounded-3xl text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`, children: React.cloneElement(icon, { size: 32 }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-black text-gray-800", children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase mt-1", children: sub })
] });
const UniversityDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [list, setList] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const fetchData = () => {
    setLoading(true);
    fetch(`${API_URL}/api/admin/university/${type}`).then((res) => res.json()).then((data) => {
      setList(data);
      setLoading(false);
    }).catch((err) => {
      toast.error("Error fetching data");
      setLoading(false);
    });
  };
  reactExports.useEffect(() => {
    fetchData();
  }, [type]);
  const filteredList = list.filter(
    (item) => Object.values(item).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const exportExcel = async () => {
    const fileName = `LifeDrop_PU_${type}_Report.xlsx`;
    const ws = utils.json_to_sheet(filteredList);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "PU_Data");
    if (Capacitor.getPlatform() === "web") {
      writeFileSync(wb, fileName);
      toast.success("Excel file downloaded!");
    } else {
      try {
        const excelBase64 = writeSync(wb, { bookType: "xlsx", type: "base64" });
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: excelBase64,
          directory: Directory.Documents,
          recursive: true
        });
        await Share.share({
          title: "University Report",
          url: savedFile.uri,
          dialogTitle: "Open Excel Report"
        });
      } catch (error) {
        console.error("Excel Export Error:", error);
        toast.error("Failed to save Excel file");
      }
    }
  };
  const exportPDF = async () => {
    const doc = new E("l", "mm", "a4");
    doc.setFontSize(18);
    doc.text(`Periyar University - ${type.toUpperCase()} REPORT`, 14, 15);
    let headers = [];
    let body = [];
    if (type === "history") {
      headers = [["Patient", "Blood", "Requester", "Requester Phone", "Donor Hero", "Donor Phone", "Hospital", "Date"]];
      body = filteredList.map((i) => [i.patient, i.blood, i.requester_name, i.requester_phone, i.donor_name, i.donor_phone, i.hospital, i.date]);
    } else if (type === "donors") {
      headers = [["Name", "Email", "Phone", "Blood", "Dept", "Role", "Status"]];
      body = filteredList.map((i) => [i.name, i.email, i.phone, i.blood, i.dept, i.role, i.status]);
    } else {
      headers = [["Name", "Email", "Phone", "Dept", "Role", "Year"]];
      body = filteredList.map((i) => [i.name, i.email, i.phone, i.dept, i.role, i.year]);
    }
    autoTable(doc, {
      startY: 25,
      head: headers,
      body,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] }
    });
    const fileName = `LifeDrop_PU_${type}_Report.pdf`;
    if (Capacitor.getPlatform() === "web") {
      doc.save(fileName);
      toast.success("PDF Report downloaded!");
    } else {
      try {
        const pdfBase64 = doc.output("datauristring").split(",")[1];
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Documents,
          recursive: true
        });
        await Share.share({
          title: "University PDF Report",
          url: savedFile.uri,
          dialogTitle: "Open PDF Report"
        });
      } catch (error) {
        console.error("PDF Export Error:", error);
        toast.error("Failed to save PDF file");
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-10 space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "bg-slate-100 p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-black capitalize tracking-tight text-gray-800", children: [
            "PU ",
            type === "history" ? "Donation History" : type
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-red-600 uppercase tracking-widest italic", children: "University Circle Audit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportExcel, className: "bg-green-50 text-green-700 px-5 py-2.5 rounded-xl font-black text-[10px] border border-green-100 hover:bg-green-100 transition uppercase tracking-widest", children: "Excel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportPDF, className: "bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] shadow-lg shadow-red-100 hover:bg-red-700 transition uppercase tracking-widest", children: "PDF Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full md:w-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search records...",
              className: "w-full p-3 pl-10 bg-slate-50 rounded-2xl border-none outline-red-200 font-bold text-xs",
              onChange: (e) => setSearchTerm(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 text-gray-300", size: 16 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: type === "history" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Patient & Blood" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Requester Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Donor Hero" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Hospital & Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-center", children: "Ledger" })
      ] }) : type === "donors" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Donor Info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Blood" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Dept / Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Contact" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Requester Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Dept / Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: "Phone" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "10", className: "p-20 text-center font-bold text-gray-400 animate-pulse", children: "LOADING DATA..." }) }) : filteredList.length > 0 ? filteredList.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 transition group", children: [
        type === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-gray-800", children: item.patient }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-red-50 text-red-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase", children: [
              "Group: ",
              item.blood
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-700 text-sm", children: item.requester_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-black text-blue-500 flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 10 }),
              " ",
              item.requester_phone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-green-50 p-2 rounded-2xl border border-green-100 w-fit", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14, className: "text-green-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-green-700 uppercase leading-none", children: item.donor_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-green-600 mt-1", children: item.donor_phone })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 italic", children: item.hospital }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-black text-slate-400 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
              " ",
              item.date
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(`/blockchain/${item.id}`), className: "p-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16 }) }) })
        ] }),
        type === "donors" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status === "Verified" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`, children: item.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-gray-800", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-gray-400 uppercase", children: [
              "ID: ",
              item.email
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xl font-black text-red-600", children: item.blood }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black text-gray-700 uppercase", children: item.dept }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold text-gray-400 uppercase", children: [
              item.role,
              " | ",
              item.year
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs font-black text-blue-500", children: item.phone })
        ] }),
        type === "requesters" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 font-black text-gray-800 uppercase", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs font-bold text-gray-400", children: item.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black text-gray-700 uppercase", children: item.dept }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold text-gray-400 uppercase", children: [
              item.role,
              " | ",
              item.year
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-xs font-black text-blue-500", children: item.phone })
        ] })
      ] }, idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "10", className: "p-20 text-center text-gray-400 font-bold italic", children: "No records found." }) }) })
    ] }) }) })
  ] });
};
const NativeAppLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  reactExports.useEffect(() => {
    const setupNativeUI = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.hide();
        } catch (e) {
          console.warn("StatusBar plugin not available");
        }
      }
    };
    const setupBackButton = async () => {
      if (Capacitor.isNativePlatform()) {
        App$1.addListener("backButton", (data) => {
          if (location.pathname === "/") {
            App$1.exitApp();
          } else {
            navigate(-1);
          }
        });
      }
    };
    setupNativeUI();
    setupBackButton();
    return () => {
      if (Capacitor.isNativePlatform()) {
        App$1.removeAllListeners();
      }
    };
  }, [location.pathname, navigate]);
  return null;
};
function App() {
  const [user, setUser] = reactExports.useState(() => {
    const savedUser = localStorage.getItem("lifedrop_user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) {
      localStorage.setItem("lifedrop_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lifedrop_user");
    }
  }, [user]);
  const handleLogoutTrigger = () => {
    setShowLogoutConfirm(true);
  };
  const finalizeLogout = () => {
    setUser(null);
    localStorage.removeItem("lifedrop_user");
    setShowLogoutConfirm(false);
    toast.success("Logged out successfully!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col font-sans relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(NativeAppLogic, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, { user, handleLogout: handleLogoutTrigger }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatBot, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BroadcastAlert, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showLogoutConfirm,
        title: "Confirm Logout",
        message: "Are you sure you want to sign out? You will need to login again to access your dashboard and alerts.",
        confirmText: "YES, LOGOUT",
        cancelText: "STAY LOGGED IN",
        onConfirm: finalizeLogout,
        onCancel: () => setShowLogoutConfirm(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-24 md:pt-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Home, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/register-donor", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DonorRegister, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/register-requester", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequesterRegister, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Login, { setUser }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/profile/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PublicProfile, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/blockchain/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(BlockchainView, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Contact, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ForgotPassword, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/donor-dashboard",
          element: user && user.role === "donor" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DonorDashboard, { user }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/requester-dashboard",
          element: user && user.role === "requester" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RequesterDashboard, { user }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/new-request",
          element: user && user.role === "requester" ? /* @__PURE__ */ jsxRuntimeExports.jsx(BloodRequestForm, { user }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/matching/:id",
          element: user ? /* @__PURE__ */ jsxRuntimeExports.jsx(DonorMatching, { user }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin-dashboard",
          element: user && user.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin/details/:category",
          element: user && user.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDetails, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin/inventory",
          element: user && user.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryManager, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin/analytics",
          element: user && user.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminAnalytics, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin/camps",
          element: user && user.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CampManager, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/admin/university-dashboard", element: user?.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(UniversityDashboard, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/admin/university/details/:type", element: user?.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(UniversityDetails, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin/verifications",
          element: user?.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminVerification, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/edit-profile",
          element: user ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditProfile, { user, setUser }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] }) });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
