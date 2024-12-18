import React from "react";
import "./About.css";
import { GiCommercialAirplane } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";

const About = () => {
  return (
    <section className="about-container">
      <div className="about-container-header">
        <span>We offer the Best</span>
        <span>
          Out team of travel experts is dedicated to ensuring that you have the
          vacation of a lifetime. Choose us for your next adventure and see why
          we are best in the business.
        </span>
      </div>
      <div className="about-container__parent">
        <div className="about-container__box">
          <div className="about-container__boxIcon">
            <GiCommercialAirplane />
          </div>
          <span className="about-container__boxTitle">International Tours</span>
          <span className="about-container__boxText">
            Explore the world like never before with out International tours.
            Discover new cultures meet new people and create memories that will
            last a lifetime.
          </span>
        </div>
        <div className="about-container__box">
          <div className="about-container__boxIcon">
            <BsFillPeopleFill />
          </div>
          <span className="about-container__boxTitle">Travel Community</span>
          <span className="about-container__boxText">
            Join our travel commnunity and connect with like minded travelers
            from around the world, Share tips stories and advice on your next
            advanture.
          </span>
        </div>
        <div className="about-container__box">
          <div className="about-container__boxIcon">
            <CiPercent />
          </div>
          <span className="about-container__boxTitle">Great Offers</span>
          <span className="about-container__boxText">
            Dont miss out our exclusive discounts and deals on flights, hotel
            and vacation packages. Save big and travel more with our special
            offers.
          </span>
        </div>
      </div>
    </section>
  );
};

export default About;
