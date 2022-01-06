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

const dummyData = [
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_01.jpg?alt=media&token=37fa467c-f18e-451c-91ae-1afc9240eb10",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_02.jpg?alt=media&token=7724de16-fd9f-43a9-8daf-5af8d03b6d68",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_04.jpg?alt=media&token=9c681eb6-fc38-4b76-9c8f-dd3e02246853",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_05.jpg?alt=media&token=3bf5c823-a930-48a6-9480-fdc14d81ecb5",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_06.jpg?alt=media&token=3e977096-2a36-4b2e-894e-c28fc71ccc59",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_10.jpg?alt=media&token=02e527f2-0a86-4048-b4f6-5c21f99262a1",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_11.jpg?alt=media&token=e69cce77-148f-4584-adfb-2bb36bc137ca",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_14.jpg?alt=media&token=1822685a-7ec3-4f7c-adf9-5eeb09f1e4cd",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_15.jpg?alt=media&token=ab3b6df1-4701-4531-ae00-180e54606aa4",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_19.jpg?alt=media&token=e2cb10dc-8c94-4767-8362-a3d40f6e3ca2",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_27.jpg?alt=media&token=fe41c6de-cfb6-464d-b4b3-ea6b6497a06a",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_28.jpg?alt=media&token=0a514e53-cf0c-4d39-aa42-2462356b9723",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_29.jpg?alt=media&token=80280b5c-ae92-475f-9627-60fbc1d3c434",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_32.jpg?alt=media&token=9f3bc9a0-95e2-4c22-97cf-025035ebd065",
  "https://firebasestorage.googleapis.com/v0/b/forever-leather-goods.appspot.com/o/workshopPictures%2Fworkshop_35.jpg?alt=media&token=967aef82-51c1-43e1-a5c5-7cf13782d6a3",
];

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
