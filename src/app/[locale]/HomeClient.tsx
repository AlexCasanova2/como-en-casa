'use client'

import Pricing from '@/components/ui/Pricing'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import BlogPreviewSection from '@/components/sections/BlogPreviewSection'

interface BlogPost {
    id: string
    title: string
    excerpt: string
    slug: string
    created_at: string
}

interface HomeClientProps {
    blogPosts: BlogPost[] | null
    locale: string
}

export default function HomeClient({ blogPosts, locale }: HomeClientProps) {
    return (
        <div id="home-page-container" style={{ minHeight: '100vh' }}>
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <Pricing />
            <BlogPreviewSection blogPosts={blogPosts} locale={locale} />
            <Footer />
        </div>
    )
}
