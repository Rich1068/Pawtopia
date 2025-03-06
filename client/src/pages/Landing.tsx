//import {useState} from 'react';
import HeroSection from "../components/Landing/HeroSection";
//import HeroSection2 from '../components/Landing/HereSection2';
import CenterText from "../components/Landing/CenterText";
import { motion } from "motion/react";
import Carousel from "../components/Landing/Carousel/Carousel";
import HeroSection2 from "../components/Landing/HeroSection2";

const Landing = () => {
  return (
    <>
      <div className="bg-[url(/assets/img/wallpaper.jpg)] relative bg-fixed bg-center bg-cover bg-no-repeat">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <HeroSection />
          <CenterText />
          <HeroSection2 />
          <Carousel />
        </motion.div>
      </div>
    </>
  );
};

export default Landing;
