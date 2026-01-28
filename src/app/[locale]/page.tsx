
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
    const supabase = createClient()

    // Fetch latest 3 blog posts from DB
    const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('language', locale)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

    return <HomeClient blogPosts={blogPosts} locale={locale} />
}

