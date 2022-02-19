import { Card, CardMedia, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";

// import Swiper from react id swiper
import Swiper from "react-id-swiper";

// import css for react id swiper
import "swiper/css/swiper.css";

const useStyles = makeStyles({
  card: {
    // height: "50vh",
  },
  cardMedia: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
});

const ReactIdSwiper = ({ pictures }) => {
  const classes = useStyles();

  const [images, setImages] = useState();

  useEffect(() => {
    if (pictures.length > 10) {
      setImages(pictures);
    }
  }, [pictures]);

  const params = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
  };

  return (
    <Swiper {...params}>
      {images?.map((pic, index) => {
        return (
          <Card className={classes.card} key={index}>
            <CardMedia className={classes.cardMedia} image={pic} title={pic} />
          </Card>
        );
      })}
    </Swiper>
  );
};

export default ReactIdSwiper;
