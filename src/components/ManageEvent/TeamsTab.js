import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";

function TeamsTab({ teams = [], venues = [], onTeamsChange = () => {} }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({
    name: "",
    projectTitle: "",
    leaderName: "",
    leaderEmail: "",
    categoryId: "",
  });
  
  const fileInputRef = useRef(null);
  const [excelScriptLoaded, setExcelScriptLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load the SheetJS library for Excel parsing
    if (window.XLSX) {
      setExcelScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    script.onload = () => {
      console.log("SheetJS library loaded successfully.");
      setExcelScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Could not load the SheetJS library for Excel import.");
      alert("Error: Could not load the library required for Excel import. Please check your internet connection.");
    };

    document.body.appendChild(script);

    // Clean up by removing the script when the component unmounts
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []); // This effect runs only once when the component mounts

  const handleAddTeam = () => {
    setCurrentTeam({
      name: "",
      projectTitle: "",
      leaderName: "",
      leaderEmail: "",
      categoryId: "",
    });
    setOpenDialog(true);
  };

  const handleSaveTeam = () => {
    if (!currentTeam.name || !currentTeam.leaderName || !currentTeam.leaderEmail || !currentTeam.categoryId) {
      alert("Team name, leader name, leader email, and category are required");
      return;
    }

    const newTeam = {
      id: currentTeam.id || Date.now(),
      ...currentTeam,
      createdAt: currentTeam.createdAt || new Date().toISOString(),
    };

    let updatedTeams;
    if (currentTeam.id) {
      updatedTeams = teams.map((t) => (t.id === currentTeam.id ? newTeam : t));
    } else {
      updatedTeams = [...teams, newTeam];
    }
    onTeamsChange(updatedTeams);
    setOpenDialog(false);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      const updatedTeams = teams.filter((t) => t.id !== teamId);
      onTeamsChange(updatedTeams);
    }
  };

  const handleExportPDF = () => {
    if (!window.jspdf) {
        alert("PDF generation library is not loaded.");
        console.error("jsPDF library not found on window object.");
        return;
    }
    const doc = new window.jspdf.jsPDF();
    doc.setFontSize(18);
    doc.text("Teams List", 14, 20);
    let yPosition = 40;
    doc.setFontSize(12);
    teams.forEach((team, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${team.name}`, 14, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text(`Project: ${team.projectTitle}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Leader: ${team.leaderName} (${team.leaderEmail})`, 20, yPosition);
      yPosition += 6;
      doc.text(`Category: ${team.categoryId || "N/A"}`, 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
    });
    doc.save("teams.pdf");
  };

  const handleExportExcel = () => {
    const escapeCsvCell = (cell) => {
      const strCell = String(cell || '');
      if (/[",\n]/.test(strCell)) {
        const escapedCell = strCell.replace(/"/g, '""');
        return `"${escapedCell}"`;
      }
      return strCell;
    };
    const headers = ["Team Name", "Project Title", "Leader Name", "Leader Email", "Category"];
    const csvRows = [
      headers.join(','),
      ...teams.map(team => [
        escapeCsvCell(team.name),
        escapeCsvCell(team.projectTitle),
        escapeCsvCell(team.leaderName),
        escapeCsvCell(team.leaderEmail),
        escapeCsvCell(team.categoryId || 'N/A'),
      ].join(','))
    ];
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "teams.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleFileImport = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          if (!window.XLSX) {
              console.error("SheetJS library (XLSX) not found on window object.");
              alert("Error: The Excel processing library is missing. Please contact support.");
              return;
          }
          try {
              const data = new Uint8Array(e.target.result);
              const workbook = window.XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const json = window.XLSX.utils.sheet_to_json(worksheet, { defval: '' });

              const normalizeKey = (key) => {
                  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
              };

              const normalizedFieldMapping = {
                  teamname: 'name',
                  name: 'name',
                  team: 'name',
                  projecttitle: 'projectTitle',
                  project: 'projectTitle',
                  title: 'projectTitle',
                  leadername: 'leaderName',
                  leader: 'leaderName',
                  leadname: 'leaderName',
                  leaderemail: 'leaderEmail',
                  email: 'leaderEmail',
                  leadermail: 'leaderEmail',
                  mail: 'leaderEmail',
                  category: 'categoryId',
                  cat: 'categoryId'
              };

              const extractRowData = (row) => {
                  const result = {
                      name: '',
                      projectTitle: '',
                      leaderName: '',
                      leaderEmail: '',
                      categoryId: ''
                  };

                  for (const [key, value] of Object.entries(row)) {
                      if (value === undefined || value === null || value === '') continue;

                      const normalizedKey = normalizeKey(key);
                      const mappedField = normalizedFieldMapping[normalizedKey];

                      if (mappedField && !result[mappedField]) {
                          result[mappedField] = String(value).trim();
                      }
                  }

                  return result;
              };

              const newTeams = json.map((row, index) => {
                  const teamData = extractRowData(row);

                  if (!teamData.name || !teamData.leaderName || !teamData.leaderEmail) {
                      console.warn(`Skipping row ${index + 2} - missing required fields`);
                      return null;
                  }

                  return {
                      id: Date.now() + Math.random(),
                      name: teamData.name,
                      projectTitle: teamData.projectTitle,
                      leaderName: teamData.leaderName,
                      leaderEmail: teamData.leaderEmail,
                      categoryId: teamData.categoryId,
                      createdAt: new Date().toISOString(),
                  };
              }).filter(Boolean);

              if (newTeams.length > 0) {
                const updatedTeams = [...teams, ...newTeams];
                onTeamsChange(updatedTeams);
                alert(`Successfully imported ${newTeams.length} team(s)`);
              } else {
                alert('No valid teams found in the file. Please ensure required columns exist: Team Name, Leader Name, and Leader Email');
              }
          } catch (error) {
              console.error("Error parsing file:", error);
              alert("Error processing the file. Please ensure it's a valid Excel or CSV file.");
          }
      };
      reader.readAsArrayBuffer(file);

      event.target.value = null;
  };


  
  return (
    <Box>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        style={{ display: 'none' }}
        accept=".xlsx, .xls, .csv"
      />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTeam}
          sx={{
            backgroundColor: '#6d28d9',
            '&:hover': { backgroundColor: '#5b21b6' },
            fontWeight: 'bold',
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Add Team
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={!excelScriptLoaded}
          sx={{
            borderColor: '#d1d5db',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#f9fafb', borderColor: '#9ca3af' },
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {excelScriptLoaded ? 'Import Excel' : 'Loading...'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={handleExportPDF}
          sx={{
            borderColor: '#d1d5db',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#f9fafb', borderColor: '#9ca3af' },
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Export PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={handleExportExcel}
          sx={{
            borderColor: '#d1d5db',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#f9fafb', borderColor: '#9ca3af' },
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Export CSV
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Team Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Project Title</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Leader Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Leader Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                  No teams added yet. Click "Add Team" to get started.
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
                <TableRow key={team.id} sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}>
                  <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{team.name}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{team.projectTitle || "-"}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{team.leaderName}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{team.leaderEmail}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{team.categoryId || "Not assigned"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => { setCurrentTeam(team); setOpenDialog(true); }}
                      sx={{ color: "#3b82f6", "&:hover": { backgroundColor: "#eff6ff" } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTeam(team.id)}
                      sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fef2f2" } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentTeam.id ? "Edit Team" : "Add New Team"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Team Name" value={currentTeam.name} onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Project Title" value={currentTeam.projectTitle || ''} onChange={(e) => setCurrentTeam({ ...currentTeam, projectTitle: e.target.value })} margin="normal" />
          <TextField fullWidth label="Team Leader Name" value={currentTeam.leaderName} onChange={(e) => setCurrentTeam({ ...currentTeam, leaderName: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Team Leader Email" type="email" value={currentTeam.leaderEmail} onChange={(e) => setCurrentTeam({ ...currentTeam, leaderEmail: e.target.value })} margin="normal" required />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select value={currentTeam.categoryId || ''} onChange={(e) => setCurrentTeam({ ...currentTeam, categoryId: e.target.value })} label="Category">
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="Hardware">Hardware</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: "none", color: "#7c3aed", fontWeight: 600, px: 3, py: 1.2, borderRadius: "10px", background: "rgba(124, 58, 237, 0.08)", "&:hover": { background: "rgba(124, 58, 237, 0.15)" } }}>
            Cancel
          </Button>
          <Button onClick={handleSaveTeam} variant="contained" sx={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", textTransform: "none", px: 4, py: 1.2, fontWeight: 700, borderRadius: "10px", boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)", transition: "all 0.3s ease", "&:hover": { background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.35)" } }}>
            {currentTeam.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamsTab;

