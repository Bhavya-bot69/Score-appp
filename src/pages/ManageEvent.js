import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  Grid,
  Fade,

} from "@mui/material";

// Import icons for the stat cards
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

import Navigation from "../components/Navigation";
import TeamsTab from "../components/ManageEvent/TeamsTab";
import JudgesTab from "../components/ManageEvent/JudgesTab";
import RoundsTab from "../components/ManageEvent/RoundsTab";
import VenuesTab from "../components/ManageEvent/VenuesTab";
import CriteriaTab from "../components/ManageEvent/CriteriaTab";

function ManageEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [teams, setTeams] = useState([]);
  const [judges, setJudges] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [venues, setVenues] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const foundEvent = events.find((e) => e.id === parseInt(eventId));
    setEvent(foundEvent);

    setTeams(JSON.parse(localStorage.getItem(`teams_${eventId}`) || "[]"));
    setJudges(JSON.parse(localStorage.getItem(`judges_${eventId}`) || "[]"));
    setRounds(JSON.parse(localStorage.getItem(`rounds_${eventId}`) || "[]"));
    setVenues(JSON.parse(localStorage.getItem(`venues_${eventId}`) || "[]"));
    setCriteria(JSON.parse(localStorage.getItem(`criteria_${eventId}`) || "[]"));
  }, [eventId]);

  const saveData = (key, data) => {
    localStorage.setItem(`${key}_${eventId}`, JSON.stringify(data));
  };

  const handleTabChange = (event, newValue) => {
    if (newValue !== currentTab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTab(newValue);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleTeamsChange = (updatedTeams) => {
    setTeams(updatedTeams);
    saveData("teams", updatedTeams);
  };

  const handleJudgesChange = (updatedJudges) => {
    setJudges(updatedJudges);
    saveData("judges", updatedJudges);
  };

  const handleRoundsChange = (updatedRounds) => {
    setRounds(updatedRounds);
    saveData("rounds", updatedRounds);
  };

  const handleVenuesChange = (updatedVenues) => {
    setVenues(updatedVenues);
    saveData("venues", updatedVenues);
  };

  const handleCriteriaChange = (updatedCriteria) => {
    setCriteria(updatedCriteria);
    saveData("criteria", updatedCriteria);
  };

  if (!event) {
    return (
      <Box sx={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Navigation breadcrumb="Dashboard / Loading..." />
        <Box sx={{ maxWidth: "1400px", mx: "auto", px: 4, py: 6 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  const tabs = [
    { 
      label: "Overview", 
      icon: <DashboardOutlinedIcon sx={{ fontSize: "1.1rem", mr: 1 }} />,
      count: null 
    },
    { 
      label: "Teams", 
      icon: <GroupOutlinedIcon sx={{ fontSize: "1.1rem", mr: 1 }} />,
      count: teams.length 
    },
    { 
      label: "Judges", 
      icon: <GavelOutlinedIcon sx={{ fontSize: "1.1rem", mr: 1 }} />,
      count: judges.length 
    },
    { 
      label: "Rounds", 
      icon: <SyncOutlinedIcon sx={{ fontSize: "1.1rem", mr: 1 }} />,
      count: rounds.length 
    },
    { 
      label: "Venues", 
      icon: <PlaceOutlinedIcon sx={{ fontSize: "1.1rem", mr: 1 }} />,
      count: venues.length 
    },
    {
      label: "Criteria",
      icon: <CategoryOutlinedIcon sx={{ fontSize: "1.1rem", mr: 1 }} />,
      count: criteria.length
    },
  ];
  
  // A helper component for the stat cards to avoid repetition
  const StatCard = ({ title, value, icon }) => (
    <Card
      sx={{
        borderRadius: "20px",
        p: 3.5,
        textAlign: "center",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(124, 58, 237, 0.15)",
          transform: "translateY(-8px)",
          borderColor: "rgba(124, 58, 237, 0.3)",
          background: "linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)"
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: -15,
        right: -15,
        fontSize: '90px',
        color: 'rgba(124, 58, 237, 0.06)',
        transition: "all 0.4s ease"
      }}>
        {icon}
      </Box>
      <Typography
        variant="h2"
        sx={{
          color: "#7c3aed",
          fontWeight: 800,
          fontSize: "3.2rem",
          mb: 0.5,
          position: "relative",
          zIndex: 1
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "0.85rem",
          position: "relative",
          zIndex: 1
        }}
      >
        {title}
      </Typography>
    </Card>
  );

  // Tab content wrapper with smooth animations
  const TabContent = ({ children, isActive }) => (
    <Fade in={isActive && !isTransitioning} timeout={300}>
      <Box
        sx={{
          background: "white",
          borderRadius: "0 0 20px 20px",
          p: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          minHeight: "400px",
          opacity: isTransitioning ? 0.5 : 1,
          transition: "opacity 0.3s ease"
        }}
      >
        {children}
      </Box>
    </Fade>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Navigation breadcrumb={`Dashboard / ${event.name}`} />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: 4, py: 4 }}>
        {/* Event Header */}
        <Box sx={{ 
          mb: 4, 
          p: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1e293b",
              mb: 0.5,
              fontSize: "2.5rem"
            }}
          >
            {event.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontSize: "0.95rem"
            }}
          >
            {event.description || "No description provided for this event."}
          </Typography>
        </Box>

        {/* Enhanced Tab System */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            borderBottom: "none"
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              py: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "#ffffff",
                minHeight: "60px",
                px: 3,
                py: 2,
                mx: 0.5,
                borderRadius: "14px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&.Mui-selected": {
                  color: "#7c3aed",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%)",
                  boxShadow: "0 2px 8px rgba(124, 58, 237, 0.15)"
                },
                "&:hover": {
                  color: "#7c3aed",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)",
                  transform: "translateY(-1px)"
                },
                "&:not(.Mui-selected):hover": {
                  background: "rgba(248, 250, 252, 0.8)"
                }
              },
              "& .MuiTabs-indicator": {
                display: "none" // Hide default indicator since we're using custom background
              },
              "& .MuiTabs-scrollButtons": {
                color: "#7c3aed",
                "&.Mui-disabled": {
                  opacity: 0.3
                }
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {tab.icon}
                    {tab.label}
                    {tab.count !== null && (
                      <Box
                        sx={{
                          ml: 1.5,
                          px: 1.5,
                          py: 0.3,
                          borderRadius: "12px",
                          background: currentTab === index 
                            ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" 
                            : "#e2e8f0",
                          color: currentTab === index ? "white" : "#64748b",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          minWidth: "24px",
                          textAlign: "center",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {tab.count}
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ position: "relative" }}>
          {currentTab === 0 && (
            <TabContent isActive={currentTab === 0}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Teams" value={teams.length} icon={<GroupOutlinedIcon fontSize="inherit" />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Judges" value={judges.length} icon={<GavelOutlinedIcon fontSize="inherit" />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Rounds" value={rounds.length} icon={<SyncOutlinedIcon fontSize="inherit" />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Venues" value={venues.length} icon={<PlaceOutlinedIcon fontSize="inherit" />} />
                </Grid>
              </Grid>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    mb: 3,
                    fontSize: "1.4rem"
                  }}
                >
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentTab(1)}
                    startIcon={<GroupOutlinedIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      textTransform: "none", 
                      px: 3, 
                      py: 1.5, 
                      fontSize: "0.95rem", 
                      fontWeight: 600,
                      borderRadius: "14px", 
                      boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.35)",
                        transform: 'translateY(-3px)'
                      }
                    }}
                  >
                    Add Team
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/admin/event/${eventId}/results`)}
                    startIcon={<DashboardOutlinedIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      textTransform: "none",
                      px: 3,
                      py: 1.5,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      borderRadius: "14px",
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: "0 8px 25px rgba(16, 185, 129, 0.35)",
                        transform: 'translateY(-3px)'
                      }
                    }}
                  >
                    View Results
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentTab(2)}
                    startIcon={<GavelOutlinedIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      textTransform: "none",
                      px: 3,
                      py: 1.5,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      borderRadius: "14px",
                      boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.35)",
                        transform: 'translateY(-3px)'
                      }
                    }}
                  >
                    Add Judge
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentTab(3)}
                    startIcon={<SyncOutlinedIcon />}
                    sx={{
                      borderColor: "#7c3aed",
                      color: "#ffffff",
                      textTransform: "none", 
                      px: 3, 
                      py: 1.5, 
                      fontSize: "0.95rem", 
                      fontWeight: 600,
                      borderRadius: "14px",
                      borderWidth: "2px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: "#7c3aed",
                        color: "white",
                        borderColor: "#7c3aed",
                        transform: 'translateY(-2px)',
                        boxShadow: "0 6px 20px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    Manage Rounds
                  </Button>
                </Box>
              </Box>
            </TabContent>
          )}

          {[1, 2, 3, 4, 5].includes(currentTab) && (
            <TabContent isActive={[1, 2, 3, 4, 5].includes(currentTab)}>
              {currentTab === 1 && <TeamsTab teams={teams} venues={venues} categories={criteria} onTeamsChange={handleTeamsChange} />}
              {currentTab === 2 && (
                <JudgesTab
                  judges={judges}
                  venues={venues}
                  categories={criteria}
                  teams={teams}
                  onJudgesChange={handleJudgesChange}
                  eventId={eventId}
                  eventName={event.name}
                />
              )}
              {currentTab === 3 && <RoundsTab rounds={rounds} onRoundsChange={handleRoundsChange} />}
              {currentTab === 4 && <VenuesTab venues={venues} onVenuesChange={handleVenuesChange} />}
              {currentTab === 5 && <CriteriaTab categories={criteria} onCategoriesChange={handleCriteriaChange} />}
            </TabContent>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ManageEvent;
