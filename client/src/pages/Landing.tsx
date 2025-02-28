//import {useState} from 'react';
import HeroSection from '../components/Landing/HeroSection';
//import HeroSection2 from '../components/Landing/HereSection2';
import CenterText from '../components/Landing/CenterText';
import { motion } from 'motion/react';
import Carousel from '../components/Landing/Carousel/Carousel';

const Landing = () => {
  return( 
  <>
  <motion.div
    initial={{ opacity:0 }} animate={{ opacity:1 }}  >
    <HeroSection/>
    <CenterText/>
    <Carousel/>
  </motion.div>
  </>
  );
};

export default Landing;
