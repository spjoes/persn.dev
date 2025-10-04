"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type BusinessCardClientProps = {
  contactPhone: string | null;
};

export default function BusinessCardClient({ contactPhone }: BusinessCardClientProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          
          <div>
            <div className="mb-6 flex items-center gap-6">
              <div className="h-20 w-20 overflow-hidden rounded-xl border-2 border-zinc-600 flex-shrink-0">
                <Image
                  src="/images/picture.jpg"
                  alt="Joseph Kerper"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">
                  Joseph Kerper
                </h2>
                <p className="text-lg text-zinc-300">
                  Software Engineering
                </p>
                <p className="text-medium text-zinc-400">
                  San Jose State University
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-3">
                <Link
                  href="mailto:joeykerp@gmail.com"
                  target="_blank"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 will-change-transform"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-white">
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">Email</p>
                    <p className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">joeykerp@gmail.com</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-zinc-400 transition-colors group-hover:text-white">
                      <path d="M15 3h6v6"/>
                      <path d="M10 14 21 3"/>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </div>
                </Link>

                {contactPhone && (
                  <a
                    href={`sms:+1${contactPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    className="group flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 will-change-transform"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-white">
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                        <path d="M12 18h.01"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">Mobile</p>
                      <p className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">{contactPhone}</p>
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-zinc-400 transition-colors group-hover:text-white">
                        <path d="M15 3h6v6"/>
                        <path d="M10 14 21 3"/>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      </svg>
                    </div>
                  </a>
                )}
              </div>

              <div className="space-y-3">

                <Link
                  href="https://github.com/spjoes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 will-change-transform"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-white" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">GitHub</p>
                    <p className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">@spjoes</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-zinc-400 transition-colors group-hover:text-white">
                      <path d="M15 3h6v6"/>
                      <path d="M10 14 21 3"/>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </div>
                </Link>

                <Link
                  href="https://www.linkedin.com/in/jkerper/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 will-change-transform"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white" fill="currentColor">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">LinkedIn</p>
                    <p className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">@jkerper</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-zinc-400 transition-colors group-hover:text-white">
                      <path d="M15 3h6v6"/>
                      <path d="M10 14 21 3"/>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </div>
                </Link>

                <Link
                  href="https://www.x.com/IAmTh3Person"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 will-change-transform"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white"><title>X</title><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">Twitter</p>
                    <p className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">@IAmTh3Person</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-zinc-400 transition-colors group-hover:text-white">
                      <path d="M15 3h6v6"/>
                      <path d="M10 14 21 3"/>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-700 pt-6">
              <h3 className="mb-3 text-sm font-semibold text-zinc-300">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "TypeScript", "Next.js", "Node.js", 
                  "Tailwind CSS", "MongoDB", "PostgreSQL", "Supabase"
                ].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-700 pt-6">
              <Link
                href="https://persn.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 will-change-transform"
              >
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-300">
                    Visit my portfolio
                  </p>
                  <p className="text-base font-medium text-zinc-200 transition-colors group-hover:text-white">
                    https://persn.dev
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-white">
                      <path d="M15 3h6v6"/>
                      <path d="M10 14 21 3"/>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </div>
                </div>
              </Link>
             </div>
           </div>
         </div>
       </motion.div>
    </div>
  );
}