import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">DevOrbit</div>

      {/* Search */}
      <div className="navbar-search">
        <SearchIcon className="search-icon" />
        <input type="text" placeholder="Search creators..." />
      </div>

      {/* Menu */}
      <div className="navbar-menu">
        <Link to="/Home">
          <button>
            <HomeOutlinedIcon />
          </button>
        </Link>

        <Link to="/Explore">
          <button>
            <ExploreOutlinedIcon />
          </button>
        </Link>

        <Link to="/create">
          <button>
            <AddBoxOutlinedIcon />
          </button>
        </Link>

        <Link to="/notifications">
          <button>
            <FavoriteBorderOutlinedIcon />
          </button>
        </Link>

        <Link to="/messages">
          <button>
            <ChatBubbleOutlineOutlinedIcon />
          </button>
        </Link>
      </div>

      {/* Profile */}
      <Link to="/profile">
        <div className="navbar-profile">
          <AccountCircleOutlinedIcon />
        </div>
      </Link>

      {/* Logout */}
      <button className="navbar-logout" onClick={handleLogout}>
        <LogoutIcon />
      </button>
    </header>
  );
}
