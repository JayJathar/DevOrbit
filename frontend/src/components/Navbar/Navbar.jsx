import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import devlogo from "../../assets/devlogo.svg";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

const NAV_ITEMS = [
  {
    key: "home",
    href: "/Home",
    label: "Home",
    on: HomeRoundedIcon,
    off: HomeOutlinedIcon,
  },
  {
    key: "explore",
    href: "/Explore",
    label: "Explore",
    on: ExploreRoundedIcon,
    off: ExploreOutlinedIcon,
  },
  {
    key: "messages",
    href: "/messages",
    label: "Messages",
    on: MailRoundedIcon,
    off: MailOutlineOutlinedIcon,
  },
  {
    key: "alerts",
    href: "/notifications",
    label: "Alerts",
    on: NotificationsRoundedIcon,
    off: NotificationsNoneOutlinedIcon,
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoadingUser(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          setUser(null);

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Close the mobile quick-menu when tapping/clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close menu automatically if the viewport is resized above mobile width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href) =>
    location.pathname.toLowerCase().startsWith(href.toLowerCase());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // On mobile widths, tapping the profile avatar opens the quick-menu
  // instead of navigating straight to /profile.
  const handleProfileClick = (e) => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      e.preventDefault();
      setMobileMenuOpen((prev) => !prev);
    }
  };

  const handleMobileNewPost = () => {
    setMobileMenuOpen(false);
    navigate("/CreatePost");
  };

  const handleMobileLogout = () => {
    setMobileMenuOpen(false);
    handleLogout();
  };

  const profileImage =
    user?.profileImage ||
    user?.profilePic ||
    user?.profilePhoto ||
    user?.avatar ||
    user?.avatarUrl ||
    user?.photoURL ||
    user?.image ||
    "";

  const displayName =
    user?.fullname ||
    user?.fullName ||
    user?.name ||
    user?.displayName ||
    "User";

  const rawUsername = user?.username || user?.userName || "";

  const displayUsername = rawUsername
    ? rawUsername.startsWith("@")
      ? rawUsername
      : `@${rawUsername}`
    : "";

  const userInitial = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand" aria-label="DevOrbit home">
          <span className="sidebar-mark">
            <img src={devlogo} alt="DevOrbit" className="sidebar-logo" />
          </span>

          <span className="sidebar-wordmark">
            <span className="sidebar-wordmark-main">Dev</span>

            <span className="sidebar-wordmark-accent">Orbit</span>
          </span>
        </Link>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          <div className="sidebar-nav-label">Workspace</div>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.on : item.off;

            return (
              <Link
                key={item.key}
                to={item.href}
                className={`sidebar-nav-link ${active ? "is-active" : ""}`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <span className="sidebar-nav-icon">
                  <Icon />
                </span>

                <span className="sidebar-nav-text">{item.label}</span>

                {active && <span className="sidebar-active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="sidebar-post-btn"
          onClick={() => navigate("/CreatePost")}
          aria-label="Create new post"
        >
          <span className="sidebar-post-icon">
            <AddOutlinedIcon />
          </span>

          <span className="sidebar-post-content">
            <span className="sidebar-post-title">New post</span>
            <span className="sidebar-post-subtitle">Share something</span>
          </span>

          <span className="sidebar-post-arrow">↗</span>
        </button>

        <div className="sidebar-spacer" />

        <div className="sidebar-profile-wrap" ref={mobileMenuRef}>
          {mobileMenuOpen && (
            <div className="mobile-quick-menu" role="menu">
              <button
                type="button"
                className="mobile-quick-menu-item"
                role="menuitem"
                onClick={handleMobileNewPost}
              >
                <span className="mobile-quick-menu-icon">
                  <AddOutlinedIcon />
                </span>
                New post
              </button>

              <Link
                to="/settings"
                className="mobile-quick-menu-item"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mobile-quick-menu-icon">
                  <SettingsOutlinedIcon />
                </span>
                Settings
              </Link>

              <button
                type="button"
                className="mobile-quick-menu-item mobile-quick-menu-logout"
                role="menuitem"
                onClick={handleMobileLogout}
              >
                <span className="mobile-quick-menu-icon">
                  <LogoutRoundedIcon />
                </span>
                Log out
              </button>
            </div>
          )}

          <Link
            to="/profile"
            className={`sidebar-profile ${
              isActive("/profile") ? "is-active" : ""
            }`}
            aria-label="Profile"
            onClick={handleProfileClick}
          >
            <div className="sidebar-avatar">
              {loadingUser ? (
                <span className="sidebar-avatar-initial">...</span>
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="sidebar-profile-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="sidebar-avatar-initial">{userInitial}</span>
              )}

              <span className="sidebar-avatar-status" />
            </div>
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">
                {loadingUser ? "Loading..." : displayName}
              </span>
              <span className="sidebar-profile-username">
                {loadingUser ? "" : displayUsername}
              </span>
            </div>

            <MoreHorizRoundedIcon className="sidebar-profile-more" />
          </Link>
        </div>

        <div className="sidebar-bottom">
          <Link
            to="/settings"
            className={`sidebar-bottom-link ${
              isActive("/settings") ? "is-active" : ""
            }`}
          >
            <span className="sidebar-bottom-icon">
              {isActive("/settings") ? (
                <SettingsRoundedIcon />
              ) : (
                <SettingsOutlinedIcon />
              )}
            </span>
            <span>Settings</span>
          </Link>
          <button
            type="button"
            className="sidebar-bottom-link sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-bottom-icon">
              <LogoutRoundedIcon />
            </span>
            <span>Log out</span>
          </button>
        </div>
        <div className="sidebar-footer">
          <span className="sidebar-footer-dot" />
          <span>DevOrbit</span>
          <span className="sidebar-footer-version">v1.0</span>
        </div>
      </aside>
    </>
  );
}
