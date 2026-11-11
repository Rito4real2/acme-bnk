'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 1',
      testimonialTextKey: 'testimonials.testimonial1',
      defaultTestimonialText: `I'm Hunter Hamilton from North Carolina, Currently living in Arizona with my Family, i came across Astrofinex Bank, while browsing through facebook, I accessed the site and contact them via whatsapp and i started investing with $5000 and am making $51,560.00 Weekly.💵💵`,
      name: 'Hunter Hamilton',
      country: 'UNITED STATES',
    },
    {
      id: 2,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 2',
      testimonialTextKey: 'testimonials.testimonial2',
      defaultTestimonialText: `Hello everyone I'm Charlotte from South Africa 🇿🇦 It is very easy to make investments on this platform. They have different payment methods that are secured and easy to use. I have also earned more from my account upgrade with amazing new features added to it thank you all so much ❤️.`,
      name: 'Charlotte Lesoto',
      country: 'SOUTH AFRICA',
    },
    {
      id: 3,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 3',
      testimonialTextKey: 'testimonials.testimonial3',
      defaultTestimonialText: `Blessings be unto you ma'am Violante Valeria and your company Astrofinex Bank, you're such a big comfort and a big help to me regarding bitcoin investment ma'am , God bless you for using your skills of trading to bless us the Philippines🇵🇭 because we normally have a low economy 💖 thanks ma'am Violante Valeria once again and i will do tell my friends to join the winning team.`,
      name: 'Michael Chen',
      country: 'CANADA',
    },
    {
      id: 4,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 4',
      testimonialTextKey: 'testimonials.testimonial4',
      defaultTestimonialText: `Hi Astrofinex Bank. I'm just writing to say thank you!! Astrofinex Bank is in my blood now. I finally found my life! I want to say a big thank you to Astrofinex Bank , Just got my profit of $7500 in my Bank account. This is indeed a trust worthy platform to invest.`,
      name: 'Emily Rodriguez',
      country: 'UNITED STATES',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-2 mb-10 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Client Feedback
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
          Client Testimonials
        </h2>
        <p className="font-mono text-xs sm:text-sm text-gray-400">
          Hear directly from users leveraging our investment ledger platform worldwide.
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: false,
          dynamicBullets: false,
        }}
        navigation={false}
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
        }}
        className="pb-14 [&_.swiper-pagination-bullet]:bg-gray-500 [&_.swiper-pagination-bullet-active]:bg-amber-500 [&_.swiper-button-next]:text-gray-400 [&_.swiper-button-prev]:text-gray-400 [&_.swiper-button-next]:scale-75 [&_.swiper-button-prev]:scale-75"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="h-auto">
            <div className="flex flex-col justify-between h-full bg-gray-800/60 text-white p-6 sm:p-8 rounded-2xl border border-gray-700/60 shadow-lg transition-all hover:border-amber-500/40">
              
              {/* Testimonial Quote */}
              <p className="font-mono text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                "{t(testimonial.testimonialTextKey, { defaultValue: testimonial.defaultTestimonialText })}"
              </p>

              {/* Author Profile Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-700/60">
                <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-full bg-gray-700 border border-gray-600">
                  <Image
                    src={testimonial.imageSrc}
                    alt={testimonial.imageAlt}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-mono font-bold text-sm text-white">
                    {testimonial.name}
                  </span>
                  <span className="font-mono text-xs text-red-400 font-semibold tracking-wider">
                    {testimonial.country}
                  </span>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
};

export default Testimonials;