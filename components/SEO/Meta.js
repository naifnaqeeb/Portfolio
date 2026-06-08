import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
           {/* Primary Meta Tags */}
            <title>Naif Naqeeb — Full-Stack AI Engineer</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Naif Naqeeb — Full-Stack AI Engineer" />
            <meta name="description"
                content="Naif Naqeeb's personal portfolio — Full-Stack AI Engineer specializing in LLM applications, RAG pipelines, Agentic AI, and scalable cloud systems. Built with Ubuntu 20.04 theme using Next.js and Tailwind CSS." />
            <meta name="author" content="Naif Naqeeb (naifnaqeeb)" />
            <meta name="keywords"
                content="naifnaqeeb, naif naqeeb portfolio, naif naqeeb developer, full stack AI engineer, LLM engineer, RAG pipeline, agentic AI, LangChain developer, VIT student, ubuntu portfolio, next.js portfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            {/* Search Engine */}
            <meta name="image" content="images/logos/fevicon.webp" />
            {/* Schema.org for Google */}
            <meta itemProp="name" content="Naif Naqeeb — Full-Stack AI Engineer" />
            <meta itemProp="description"
                content="Naif Naqeeb's personal portfolio — Full-Stack AI Engineer specializing in LLM applications, RAG pipelines, Agentic AI, and scalable cloud systems." />
            <meta itemProp="image" content="images/logos/fevicon.webp" />
            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Naif Naqeeb — Full-Stack AI Engineer" />
            <meta name="twitter:description"
                content="Naif Naqeeb's personal portfolio — Full-Stack AI Engineer specializing in LLM applications, RAG pipelines, Agentic AI, and scalable cloud systems." />
            <meta name="twitter:site" content="naifnaqeeb" />
            <meta name="twitter:creator" content="naifnaqeeb" />
            <meta name="twitter:image:src" content="images/logos/logo_1024.webp" />
            {/* Open Graph general (Facebook, Pinterest & Google+) */}
            <meta name="og:title" content="Naif Naqeeb — Full-Stack AI Engineer" />
            <meta name="og:description"
                content="Naif Naqeeb's personal portfolio — Full-Stack AI Engineer specializing in LLM applications, RAG pipelines, Agentic AI, and scalable cloud systems." />
            <meta name="og:image" content="images/logos/logo_1200.webp" />
            <meta name="og:url" content="https://naifnaqeeb.github.io/" />
            <meta name="og:site_name" content="Naif Naqeeb Personal Portfolio" />
            <meta name="og:locale" content="en_IN" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="images/logos/fevicon.webp" />
            <link rel="apple-touch-icon" href="images/logos/logo.webp" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" as="style" />
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
