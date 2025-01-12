// Define colors for the light theme
const lightTheme = {
    mainColor: "#62C1E5",        // Light Blue
    appColor: "#fff",            // White (App background)
    secondaryColor: "#575757",   // Dark Gray (Secondary elements)
    disabledColor: "#F3F4F6",    // Light Gray (Disabled elements)
    bottomDarkColor: "#171717",  // Dark background for certain areas
    bottomwhiteColor: "#fff",    // White (for bottom areas)
    mainTextColor: "#000",       // Black (Main text color)
  };
  
  // Define colors for the dark theme
  const darkTheme = {
    mainColor: "#A2CFF5",        // Light Blue (Main color)
    appColor: "#101010",         // Dark Gray (App background)
    secondaryColor: "#575757",   // Dark Gray (Secondary elements)
    disabledColor: "#202020",    // Darker Gray (Disabled elements)
    bottomDarkColor: "#171717",  // Dark background for certain areas
    bottomwhiteColor: "#fff",    // White (for bottom areas)
    mainTextColor: "#fff",       // White (Main text color)
  };
  
  // Function to return colors based on the theme (light or dark)
  export const getColorsForTheme = (theme) => {
    return theme === "light" ? lightTheme : darkTheme;
  };
  
  // Server URL remains the same for all themes
  export const server = "http://192.168.31.118:5000/";
  