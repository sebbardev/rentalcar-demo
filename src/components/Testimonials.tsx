"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Quote, Send, CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { submitReview } from "@/services/reviewService";
import { toast } from "react-hot-toast";

interface TestimonialProps {
  initialTestimonials?: Array<{
    id: number;
    name: string;
    role: string | null;
    rating: number;
    content: string;
  }>;
}

export default function Testimonials({ initialTestimonials }: TestimonialProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    rating: 5,
    content: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = initialTestimonials || [];

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-scroll for carousel
  useEffect(() => {
    if (testimonials.length <= itemsPerView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        const maxIndex = testimonials.length - itemsPerView;
        return next > maxIndex ? 0 : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [checkScrollButtons]);

  // Auto-scroll functionality
  useEffect(() => {
    if (testimonials.length > 3) {
      autoScrollIntervalRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const { scrollLeft, scrollWidth, clientWidth } = container;
          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 340, behavior: 'smooth' });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [testimonials.length]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -340, behavior: 'smooth' });
      // Pause auto-scroll on manual interaction
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        setTimeout(() => {
          if (testimonials.length > 3) {
            autoScrollIntervalRef.current = setInterval(() => {
              const container = scrollContainerRef.current;
              if (container) {
                const { scrollLeft, scrollWidth, clientWidth } = container;
                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                  container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                  container.scrollBy({ left: 340, behavior: 'smooth' });
                }
              }
            }, 3000);
          }
        }, 10000); // Resume after 10 seconds
      }
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 340, behavior: 'smooth' });
      // Pause auto-scroll on manual interaction
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        setTimeout(() => {
          if (testimonials.length > 3) {
            autoScrollIntervalRef.current = setInterval(() => {
              const container = scrollContainerRef.current;
              if (container) {
                const { scrollLeft, scrollWidth, clientWidth } = container;
                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                  container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                  container.scrollBy({ left: 340, behavior: 'smooth' });
                }
              }
            }, 3000);
          }
        }, 10000); // Resume after 10 seconds
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // DEMO MODE: Always show success message when form is filled
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setSubmitted(true);
    toast.success("Merci pour votre avis !");
    setFormData({ name: "", email: "", role: "", rating: 5, content: "" });
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 3000);
    
    setSubmitting(false);
  };

  // Block body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
      // Hide navbar when modal is open
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      // Show navbar when modal is closed
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = '';
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = '';
      }
    };
  }, [showForm]);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-5"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[var(--color-highlight)] rounded-full mix-blend-multiply filter blur-[128px] opacity-5"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-xs font-black text-[var(--color-highlight)] uppercase tracking-[0.3em] mb-4">Témoignages</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] uppercase tracking-tighter mb-6">Ce que disent <span className="text-[var(--color-secondary)]">nos clients</span></h3>
            <p className="text-[var(--color-text-muted)] text-lg font-light leading-relaxed">
              La satisfaction de nos clients est notre priorité absolue. Découvrez leurs retours d'expérience avec Premium Car Rental.
            </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {testimonials.map((item) => (
                <div key={item.id} className="flex-shrink-0 px-3 sm:px-4" style={{ width: `${100 / itemsPerView}%` }}>
                  <div className="bg-[var(--color-bg)] p-6 sm:p-8 md:p-10 rounded-[2rem] relative h-[320px] md:h-[340px] flex flex-col hover:bg-white transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-gray-100 hover:shadow-2xl group">
                    <Quote className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[var(--color-primary)] opacity-10 rotate-180 group-hover:opacity-20 transition-opacity" size={36} />
                    
                    {/* User Info */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-black text-lg">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-[var(--color-primary)] text-lg sm:text-xl uppercase tracking-tight group-hover:text-[var(--color-secondary)] transition-colors">
                            {item.name}
                          </h4>
                          {item.role && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.role}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex mb-4 sm:mb-6 text-[var(--color-highlight)]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "" : "text-gray-200"} />
                      ))}
                    </div>

                    {/* Review Content */}
                    <p className="text-[var(--color-text-muted)] leading-relaxed font-light text-base sm:text-lg flex-grow">
                      "{item.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--color-primary)] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--color-primary)] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                aria-label="Témoignage suivant"
              >
                <ChevronRight size={20} className="sm:w-7 sm:h-7" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * itemsPerView)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / itemsPerView) === index
                        ? "bg-[var(--color-primary)] w-6"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                    aria-label={`Groupe de témoignages ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Add Review Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => setShowForm(true)}
            className="group relative bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white px-8 sm:px-12 py-5 sm:py-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-500 shadow-2xl shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden mx-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center gap-2 sm:gap-3">
              Partagez Votre Avis
              <Send size={18} className="group-hover:rotate-12 transition-transform" />
            </span>
          </button>
        </div>

        {/* Review Form Modal */}
        {showForm && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowForm(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div 
              className="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                margin: 'auto',
              }}
            >
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all"
              >
                <X size={24} />
              </button>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="mb-8 p-6 bg-[var(--color-bg)] rounded-[2rem] text-[var(--color-accent)]">
                    <CheckCircle className="h-20 w-20 mx-auto" />
                  </div>
                  <h3 className="text-3xl font-black text-[var(--color-primary)] mb-4 uppercase">
                    Merci Pour Votre <span className="text-[var(--color-secondary)]">Avis !</span>
                  </h3>
                  <p className="text-[var(--color-text-muted)] font-light text-lg">
                    Votre avis sera publié après validation par notre équipe.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                    Laissez Votre <span className="text-[var(--color-secondary)]">Avis</span>
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-8 font-light">
                    Partagez votre expérience avec Premium Car Rental
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                        Votre Note *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            className="transition-all hover:scale-110"
                          >
                            <Star
                              size={36}
                              fill={star <= formData.rating ? "var(--color-highlight)" : "none"}
                              className={star <= formData.rating ? "text-[var(--color-highlight)]" : "text-gray-200"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                          Nom Complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                          placeholder="Ex: Ahmed Alami"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                          placeholder="ahmed@example.com"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                        Profil (optionnel)
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                        placeholder="Ex: Client Fidèle, Touriste, Entrepreneur"
                      />
                    </div>

                    {/* Review Content */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                        Votre Avis *
                      </label>
                      <textarea
                        required
                        maxLength={1000}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={5}
                        className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm resize-none"
                        placeholder="Partagez votre expérience avec notre service..."
                      />
                      <p className="text-[10px] text-gray-400 mt-2 text-right">
                        {formData.content.length}/1000 caractères
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-secondary)] hover:to-[var(--color-primary)] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Publier Mon Avis
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
