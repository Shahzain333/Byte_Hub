import React, { useState } from 'react'

const faqs = [
  {
    question: "Do you accept walk-ins or is a reservation required?",
    answer:
      "We welcome both walk-ins and reservations. However, we highly recommend booking a table in advance, especially on weekends and holidays, to avoid wait times. You can reserve online or give us a call anytime.",
  },
  {
    question: "Do you offer vegetarian or vegan options?",
    answer:
      "Absolutely! We have a dedicated section on our menu for vegetarian and vegan dishes. Our chefs are also happy to accommodate dietary preferences or allergies — just let your server know when you arrive.",
  },
  {
    question: "What are your opening hours?",
    answer:
      "We're open Monday through Friday from 11:00 AM - 10:00 PM, Saturday and Sunday from 10:00 AM to 11:00 PM. Kitchen closes 30 minutes before closing time.",
  },
  {
    question: "Do you offer takeaway or home delivery?",
    answer:
      "Yes! We offer both takeaway and home delivery. You can place your order through our website, give us a call, or find us on major food delivery platforms. Delivery is available within a 10 km radius.",
  },
]

const adminEmail = 'adminbytehub@gmail.com'

const FaqItem = ({ question, answer, index, isOpen, onToggle }) => {
  return (
    
    <div className={`border-b border-[#FFB703]/30 group cursor-pointer transition-colors duration-200 ${
        isOpen ? 'bg-[#FFB703]/2' : 'hover:bg-[#FFB703]/5'}`} onClick={onToggle}>

      {/* Question Row */}
      <div className="flex items-center gap-5 px-2 py-5">

        <span className="font-mono text-xs text-[#FFB703] tracking-widest w-7 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="flex-1 text-stone-800 text-sm md:text-[1.10rem] font-medium leading-snug tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {question}
        </span>

        <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-sm md:text-[1.10rem] transition-all duration-300 ${
            isOpen ? 'border-[#FFB703] text-[#FFB703] rotate-45'
              : 'border-stone-300 text-stone-400 group-hover:border-[#FFB703] group-hover:text-[#FFB703]'}`}>
          +
        </span>

      </div>

      {/* Answer */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64' : 'max-h-0'}`}>
        <p className="pl-12 pr-10 pb-6 text-stone-500 text-sm leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
          {answer}
        </p>

      </div>

    </div>

  )
}

const Faqs = () => {

  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
   
   <section className="bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6 py-7 md:py-14">

      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-4 md:mb-8">

          <div className="inline-flex items-center gap-2 mb-2">
            
            <span className="w-5 h-px bg-[#FFB703]"></span>
            <span className="text-[#FFB703] text-xl tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}>
              FAQ
            </span>

          </div>

          <h2 className="text-4xl sm:text-5xl font-semibold text-stone-900 leading-tight tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Questions, answered.
          </h2>

          <p className="text-stone-500 text-base leading-relaxed max-w-md">
            Everything you need to know before getting started.
          </p>

        </div>

        {/* FAQ List */}
        <div className="border-t border-[#FFB703]/30">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 flex items-center gap-4">

          <p className="text-stone-400 text-sm">Still have questions?</p>
          <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(adminEmail)}`} target="_blank"
            rel="noopener noreferrer" className="text-sm text-[#FFB703] hover:text-[#E09A05] transition-colors 
            duration-200 underline underline-offset-4 decoration-[#FFB703]/40 hover:decoration-[#E09A05]">
            We'd love to help →
          </a>

        </div>

      </div>

    </section>
  )
}

export default Faqs