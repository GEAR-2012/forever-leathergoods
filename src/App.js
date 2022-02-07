import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./components/Pages/Categories";
import NotFoundPage from "./components/Pages/NotFoundPage";
import About from "./components/Pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Listing from "./components/Pages/Listing";
import { makeStyles } from "@material-ui/core/styles";
import { Container, createTheme, ThemeProvider } from "@material-ui/core";
import { AppState } from "./context/app-context";
import Alert from "./components/UI/Alert";
import AuthModal from "./components/Authtentication/AuthModal";
import Product from "./components/Pages/Product";
import CreateCategory from "./components/Pages/CreateCategory";
import UpdateCategory from "./components/Pages/UpdateCategory";
import CreateProduct from "./components/Pages/CreateProduct";
import UpdateProduct from "./components/Pages/UpdateProduct";
import ImageModal from "./components/UI/ImageModal";
import Specifications from "./components/Pages/Specifications";
import ConfirmModal from "./components/UI/ConfirmModal";
import ModifyAboutPictures from "./components/Pages/ModifyAboutPictures";

const App = () => {
  const { darkMode, isAdmin } = AppState();

  const darkTheme = createTheme({
    palette: {
      type: "dark",
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
        // primary: "#adb5bf",// too bad (almost same as disabled text)
        primary: "#ffeebd",
      },
    },
    typography: {
      fontFamily: '"Montserrat","sans-serif"',
    },
  });

  const lightTheme = createTheme({
    palette: {
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
  });

  const useStyles = makeStyles((theme) => ({
    mainContainer: {
      minHeight: "80vh",
      padding: theme.spacing(4),
      marginTop: "1.2rem",
    },
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Header />
        <Container maxWidth="lg" className={classes.mainContainer}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Categories />} />
            <Route path="/listing/:catname" element={<Listing />} />
            <Route path="/product/:productid" element={<Product />} />
            <Route path="/about" element={<About />} />

            {/* Only for admins */}
            <Route path="/produpload" element={isAdmin ? <CreateProduct /> : <Categories />} />
            <Route path="/produpdate/:productid" element={isAdmin ? <UpdateProduct /> : <Categories />} />
            <Route path="/newcategory" element={isAdmin ? <CreateCategory /> : <Categories />} />
            <Route path="/modifycategory/:catid" element={isAdmin ? <UpdateCategory /> : <Categories />} />
            <Route path="/specifications" element={isAdmin ? <Specifications /> : <Categories />} />
            <Route path="/modifyaboutpictures" element={isAdmin ? <ModifyAboutPictures /> : <Categories />} />

            {/* Not found page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
      <AuthModal />
      <ImageModal />
      <ConfirmModal />
      <Alert />
    </ThemeProvider>
  );
};

export default App;
