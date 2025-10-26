import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export function Navbar() {
    return (
        <AppBar position="static" sx={{ m: 0, p: 0 }}>
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                My App
            </Typography>
            <Button color="inherit">Login</Button>
        </Toolbar>
        </AppBar>
    );
}
