import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Card, CardMedia } from "@mui/material";

// import Swiper from react id swiper
import Swiper from "react-id-swiper";

// import css for react id swiper
import "swiper/css/swiper.css";

const useStyles = makeStyles({
  cardMedia: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
});

const ReactIdSwiper = ({ pictures, index = 0 }) => {
  const classes = useStyles();

  const [images, setImages] = useState();

  useEffect(() => {
    if (pictures.length > 0) {
      setImages(pictures);
    }
  }, [pictures]);

  const params = {
    initialSlide: index,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
    },
    // pagination: {
    //   el: ".swiper-pagination",
    //   clickable: true,
    // },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
  };

  return (
    <Swiper {...params}>
      {images?.map((image) => {
        return (
          <Card key={image.url}>
            <CardMedia className={classes.cardMedia} image={image.url} title={image.name} />
          </Card>
        );
      })}
    </Swiper>
  );
};

export default ReactIdSwiper;
