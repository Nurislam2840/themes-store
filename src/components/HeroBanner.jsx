// src/components/HeroBanner.jsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
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
      const { data } = await supabase.from("banners").select("*").eq("is_active", true).order("order_index", { ascending: true });
      if (data && data.length > 0) setBanners(data);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[420px] md:aspect-video flex justify-center items-center bg-gray-50 dark:bg-brand-dark">
        <FaSpinner className="text-4xl text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 dark:bg-brand-dark">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-[450px] sm:h-[500px] md:aspect-video md:h-auto" 
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={banner.id}>
            {({ isActive }) => (
              <div className="relative w-full h-full flex items-center overflow-hidden">
                
                <div className="absolute inset-0">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className={`object-cover transition-transform duration-[10000ms] ease-out ${isActive ? "scale-105" : "scale-100"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/80 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 pt-20 md:pt-0">
                  <div className="max-w-2xl text-left">
                    {isActive && (
                      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/20 backdrop-blur-md border border-brand-gold/30 text-brand-gold text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                          <FaCheckCircle size={10} /> <span>Premium Quality Guaranteed</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.15]">
                          <span className="text-transparent bg-clip-text bg-gold-gradient">{banner.title.split(' ').slice(0, 3).join(' ')}</span>{" "}
                          <span className="text-white">{banner.title.split(' ').slice(3).join(' ')}</span>
                        </h1>

                        <p className="text-gray-300 text-xs md:text-lg max-w-xl mb-6 md:mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">{banner.subtitle}</p>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href={banner.cta_link} className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-black px-6 py-3 rounded-xl text-sm font-bold transition-all">
                            {banner.cta_text} <FaArrowRight size={12} />
                          </Link>
                          <Link href="/themes" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:border-brand-gold text-white px-6 py-3 rounded-xl text-sm font-bold transition-all">
                            Browse Themes
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
      <style jsx global>{`
        .swiper-pagination { bottom: 15px !important; text-align: left !important; padding-left: 1.5rem !important; }
        @media (min-width: 768px) { .swiper-pagination { padding-left: 3rem !important; } }
        .swiper-pagination-bullet { background: rgba(255,255,255,0.4); width: 6px; height: 6px; }
        .swiper-pagination-bullet-active { background: #F59E0B; width: 20px; border-radius: 4px; }
      `}</style>
    </div>
  );
}