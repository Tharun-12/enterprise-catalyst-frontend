import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";

export default function ECatalog() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-pink-500">
      <div className="relative mx-auto max-w-5xl px-4 py-6 text-center md:py-8">

        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          Enterprise E-Catalog
        </span>

        <h1 className="mt-3 text-xl font-bold text-white md:text-2xl">
          Explore Our Product Collection
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/90 md:text-sm">
          Discover our complete range of products, specifications, and
          solutions in one convenient digital catalog.
        </p>

        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">

          {/* Contact Us */}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-pink-600 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
          >
            <BookOpen className="h-4 w-4" />
            Contact Us
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          {/* Get in Touch */}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            <MessageCircle className="h-4 w-4" />
            Talk to Our Team
          </a>

        </div>
      </div>
    </section>
  );
}