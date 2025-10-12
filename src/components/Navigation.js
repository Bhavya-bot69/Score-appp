import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

function Navigation({ breadcrumb }) {
  const navigate = useNavigate();
  const { user, logout } = useApp();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        color: "#333"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#2563eb",
              cursor: "pointer",
              fontSize: "1.5rem"
            }}
            onClick={() => navigate("/admin/events")}
          >
            ScoreApp
          </Typography>
          {breadcrumb && (
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                fontSize: "1rem"
              }}
            >
              {breadcrumb}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0e7ff', color: '#4f46e5' }}>
                <PersonOutlineOutlinedIcon fontSize="small" />
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: "#333",
                  fontWeight: 500
                }}
              >
                {user.username || user.name || "User"}
              </Typography>
              <Button
                variant="outlined"
                onClick={logout}
                sx={{
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 2.5,
                  py: 0.8,
                  borderWidth: "2px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#ef4444",
                    color: "white",
                    borderColor: "#ef4444",
                    borderWidth: "2px",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
                  }
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
