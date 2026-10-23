"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { FaArrowRight, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (data && data.length > 0) setBanners(data);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full aspect-video flex justify-center items-center bg-brand-dark">
        <FaSpinner className="text-4xl text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-brand-dark">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-[60vh] sm:h-[65vh] md:aspect-video md:h-auto"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            {({ isActive }) => (
              <div className="relative w-full h-full flex items-center">
                
                {/* Background Image (ক্লিয়ার ও উজ্জ্বল) */}
                <div className="absolute inset-0">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                      isActive ? "scale-105" : "scale-100"
                    }`}
                  />
                  
                  {/* স্মার্ট ওভারলে: বাম দিকে ডার্ক, ডান দিকে ক্লিয়ার */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/70 to-transparent"></div>
                  
                  {/* নিচের দিকের হালকা ওভারলে (টেক্সট রিডিং এর জন্য) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent"></div>
                </div>

                {/* Content Container (বাম দিকে এলাইন করা) */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
                  <div className="max-w-2xl text-left mt-10 md:mt-0">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/20 backdrop-blur-md border border-brand-gold/30 text-brand-gold text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
                          <FaCheckCircle size={10} />
                          <span>Premium Quality Guaranteed</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 leading-[1.15] md:leading-[1.1]">
                          <span className="text-transparent bg-clip-text bg-gold-gradient">
                            {banner.title.split(' ').slice(0, 3).join(' ')}
                          </span>{" "}
                          <span className="text-white">
                            {banner.title.split(' ').slice(3).join(' ')}
                          </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-gray-300 text-sm md:text-lg max-w-xl mb-8 md:mb-10 leading-relaxed font-light">
                          {banner.subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                          <Link
                            href={banner.cta_link}
                            className="group inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-black px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-bold transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105"
                          >
                            {banner.cta_text}
                            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                          <Link
                            href="/themes"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:border-brand-gold text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-bold transition-all hover:bg-white/20"
                          >
                            Browse All Themes
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Pagination */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
          text-align: left !important;
          padding-left: 3rem !important;
        }
        @media (max-width: 768px) {
          .swiper-pagination {
            padding-left: 1.5rem !important;
          }
        }
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.4);
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #F59E0B;
          width: 28px;
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(245,158,11,0.6);
        }
      `}</style>
    </div>
  );
}