import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { CssBaseline, Container } from "@mui/material";
import Categories from "./components/Pages/Categories";
import NotFoundPage from "./components/Pages/NotFoundPage";
import About from "./components/Pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Listing from "./components/Pages/Listing";
import Alert from "./components/UI/Alert";
import AuthModal from "./components/Authtentication/AuthModal";
import Product from "./components/Pages/Product";
import UpdateCategory from "./components/Pages/UpdateCategory";
import CreateProduct from "./components/Pages/CreateProduct";
import UpdateProduct from "./components/Pages/UpdateProduct";
import ImageModal from "./components/UI/ImageModal";
import Specifications from "./components/Pages/Specifications";
import ConfirmModal from "./components/UI/ConfirmModal";
import ModifyAboutPictures from "./components/Pages/ModifyAboutPictures";
import CreateCategory from "./components/Pages/CreateCategory";
import { AppState } from "./context/app-context";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fcbf49",
    },
    secondary: {
      main: "#0077b6",
    },
    badge: {
      main: "#cc400c",
    },
    background: {
      paper: "#0e2532",
      default: "#272a2c",
    },
    text: {
      primary: "#ffeebd",
    },
  },
  typography: {
    fontFamily: '"Montserrat","sans-serif"',
  },
  components: {
    // Name of the component
    MuiBackdrop: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#347598",
    },
    secondary: {
      main: "#F3CA7B",
    },

    badge: {
      main: "#bb3e03",
    },
    background: {
      paper: "#dcd7d0",
      default: "#ece7e0",
    },
    text: {
      primary: "#161616",
    },
  },
  typography: {
    fontFamily: '"Montserrat","sans-serif"',
  },
  components: {
    // Name of the component
    MuiBackdrop: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  blurLayer: {
    filter: "blur(2px)",
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: "all 1s",
  },
  mainContainer: {
    minHeight: "79vh",
    padding: "1rem",
    marginTop: "14vh",
  },
}));

const App = () => {
  const classes = useStyles();
  const { openAuth, confirm, imageModal, darkMode, isAdmin } = AppState();
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  useEffect(() => {
    if (openAuth || confirm.open || imageModal.open) {
      setIsAnyModalOpen(true);
    } else {
      setIsAnyModalOpen(false);
    }
  }, [openAuth, confirm.open, imageModal.open]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <div className={isAnyModalOpen ? classes.blurLayer : ""}>
          <Header />
          <Container maxWidth="lg" className={classes.mainContainer}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Categories />} />
              <Route path="/listing/:catname" element={<Listing />} />
              <Route path="/product/:prod_id" element={<Product />} />
              <Route path="/about" element={<About />} />

              {/* Only for admins */}
              <Route path="/createproduct" element={isAdmin ? <CreateProduct /> : <Categories />} />
              <Route path="/updateproduct/:prod_id" element={isAdmin ? <UpdateProduct /> : <Categories />} />
              <Route path="/createcategory" element={isAdmin ? <CreateCategory /> : <Categories />} />
              <Route path="/updatecategory/:cat_id" element={isAdmin ? <UpdateCategory /> : <Categories />} />
              <Route path="/specifications" element={isAdmin ? <Specifications /> : <Categories />} />
              <Route path="/updateaboutpictures" element={isAdmin ? <ModifyAboutPictures /> : <Categories />} />

              {/* Not found page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
          <Footer />
        </div>
      </BrowserRouter>
      <AuthModal />
      <ImageModal />
      <ConfirmModal />
      <Alert />
    </ThemeProvider>
  );
};

export default App;
