import React from 'react';
import { HiBadgeCheck } from "react-icons/hi";

const Testimonials = () => {

    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@neilstellar',
            date: 'April 20, 2025',
            text: 'Radiant made undercutting all of our competitors an absolute breeze. The team was incredibly responsive and delivered beyond our expectations.'
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: 'May 10, 2025',
            text: 'Absolutely love this platform! It streamlined our entire workflow and saved us countless hours of manual work.'
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            date: 'June 5, 2025',
            text: 'The best investment we made this year. Our team productivity increased by 40% within the first month.'
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Casey Williams',
            handle: '@caseycodes',
            date: 'May 10, 2025',
            text: 'Game-changer for our business. The intuitive interface and powerful features make it a must-have tool.'
        },
    ];

    const TestimonialCard = ({ card }) => (
        
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 
        w-72 shrink-0 bg-white">
        
            <div className="flex gap-2">
               
                {/* Image */}
                <img className="w-11 h-11 object-cover rounded-full"  src={card.image} alt={`${card.name}'s avatar`}/>

                {/* Name & Date */}
                <div className="flex flex-col">
                
                    <div className="flex items-center gap-1">

                        <p className="font-medium text-gray-900">{card.name}</p>
                        
                        <HiBadgeCheck className='w-4 h-4 text-indigo-500'/>
                    
                    </div>
            
                    <span className="text-xs text-slate-500">{card.handle}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{card.date}</span>
            
                </div>
            
            </div>

            {/* Description */}
            <p className="text-sm pt-4 text-gray-700 leading-relaxed">
                "{card.text}"
            </p>

        </div>
        
    );

    const doubledCards = [...cardsData, ...cardsData];

    return (
        <>
        <style>{`
            @keyframes marqueeScroll {
                0% {
                    transform: translateX(0%);
                }
                100% {
                    transform: translateX(-50%);
                }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
                will-change: transform;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }

            /* Hover pause effect */
            .marquee-row:hover .marquee-inner {
                animation-play-state: paused;
            }

            /* Smooth fade gradients */
            .fade-left {
                background: linear-gradient(to right, white 0%, white 20%, transparent 100%);
            }
            
            .fade-right {
                background: linear-gradient(to left, white 0%, white 20%, transparent 100%);
            }

            @media (max-width: 640px) {
                .fade-left, .fade-right {
                    width: 60px;
                }
            }
        `}</style>

        <div className="py-6">
           
            {/* Section Header - Optional but nice */}
            <div className="text-center mb-6 p-1">
                <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
                <p className="text-gray-600 mt-2">Trusted by millions of happy customers worldwide</p>
            </div>
            
            {/* First Row - Left to Right */}
            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">

                <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none fade-left"></div>
                
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-2 pb-2">
                    {doubledCards.map((card, idx) => (
                        <TestimonialCard key={`row1-${idx}`} card={card} />
                    ))}
                </div>
            
                <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none fade-right"></div>
            
            </div>

            {/* Second Row - Right to Left */}
            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative mt-2">
        
                <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none fade-left"></div>
        
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-2 pb-2">
                    {doubledCards.map((card, idx) => (
                        <TestimonialCard key={`row2-${idx}`} card={card} />
                    ))}
                </div>
        
                <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none fade-right"></div>
        
            </div>
        
        </div>
        </>
    );
};

export default Testimonials;