import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function CategoryManager() {
  const { categories, setCategories } = useApp();
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", weight: 1 });

  const handleAddCategory = () => {
    setCategories([...categories, { id: Date.now(), ...newCategory }]);
    setOpen(false);
    setNewCategory({ name: "", weight: 1 });
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Category Manager
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} secondaryAction={
            <IconButton edge="end" onClick={() => handleDeleteCategory(category.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={category.name} secondary={`Weight: ${category.weight}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Category
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Weight"
            type="number"
            value={newCategory.weight}
            onChange={(e) => setNewCategory({ ...newCategory, weight: parseFloat(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCategory}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryManager;
