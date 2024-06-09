import { createTheme } from "@mui/material";

export const Theme = createTheme({
    palette:{
        mode: "dark",
        primary:{
            main: "#46c4bd",
            ash: "#a5a7a6",
        },
        secondary: {
            main: "#a5a7a6"
        }
    },
    typography: {
        fontFamily: 'Eczar, Roboto, Arial, sans-serif',
        // Define custom variants
        variants: {
            h3: {
                fontWeight: 700,
                fontStyle: 'italic',
            },
            h5: {
                fontWeight: 700,
                fontStyle: 'italic',
            },
            body6: {
                fontWeight: 600,
                fontStyle: 'italic',
            },
            h2: {
                fontWeight: 700,
                fontStyle: 'normal',
            },
            body1: {
                fontWeight: 400,
                fontStyle: 'normal',
            },
            body2: {
                fontWeight: 100,
                fontStyle: 'normal',
            },
            // Add more variants as needed
        },
    },
});
