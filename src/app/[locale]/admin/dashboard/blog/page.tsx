
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Edit2, Trash2, X, Eye, Globe, Save, Layout, FileText, Settings } from 'lucide-react'

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setPosts(data)
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.target as HTMLFormElement)

        const postData = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            image_url: formData.get('image_url'),
            language: formData.get('language'),
            is_published: formData.get('is_published') === 'on',
            meta_title: formData.get('meta_title'),
            meta_description: formData.get('meta_description')
        }

        let error
        if (editingPost?.id) {
            const { error: updateError } = await supabase
                .from('blog_posts')
                .update(postData)
                .eq('id', editingPost.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from('blog_posts')
                .insert([postData])
            error = insertError
        }

        if (error) {
            alert(error.message)
        } else {
            setIsModalOpen(false)
            setEditingPost(null)
            fetchPosts()
        }
        setIsSaving(false)
    }

    const deletePost = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id)
            if (!error) fetchPosts()
        }
    }

    const openEditModal = (post: any = null) => {
        setEditingPost(post || {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image_url: '/images/blog_header.png',
            language: 'es',
            is_published: true,
            meta_title: '',
            meta_description: ''
        })
        setIsModalOpen(true)
    }

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div id="admin-blog-container">
            <div id="blog-header-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div id="search-wrapper" style={{ position: 'relative', width: '400px' }}>
                    <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por título o slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', fontSize: '0.95rem' }}
                    />
                </div>
                <button
                    onClick={() => openEditModal()}
                    style={{ background: '#d4a373', color: 'white', border: 'none', padding: '0.85rem 1.8rem', borderRadius: '50px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 4px 12px rgba(212, 163, 115, 0.2)' }}>
                    <Plus size={20} strokeWidth={3} /> Nueva Entrada
                </button>
            </div>

            <div id="blog-list-grid" style={{ display: 'grid', gap: '1.2rem' }}>
                {loading ? <p style={{ textAlign: 'center', color: '#666', padding: '3rem' }}>Cargando publicaciones...</p> : filteredPosts.map(post => (
                    <div key={post.id} className="admin-card" style={{ background: 'white', padding: '1.2rem 1.5rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{post.title}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '50px', background: post.is_published ? '#dcfce7' : '#fef3c7', color: post.is_published ? '#15803d' : '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {post.is_published ? 'Publicado' : 'Borrador'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>{post.language}</span>
                                </div>
                                <p style={{ margin: '0.4rem 0 0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>/{post.slug}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button onClick={() => window.open(`/${post.language}/blog/${post.slug}`, '_blank')} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver post">
                                <Eye size={18} color="#64748b" />
                            </button>
                            <button onClick={() => openEditModal(post)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                <Edit2 size={18} color="#d4a373" />
                            </button>
                            <button onClick={() => deletePost(post.id)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Eliminar">
                                <Trash2 size={18} color="#ef4444" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div id="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div id="modal-content" style={{ background: 'white', padding: '0', borderRadius: '32px', width: '100%', maxWidth: '1100px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

                        {/* Modal Header */}
                        <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{editingPost?.id ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
                                <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Completa los detalles para tu entrada de blog.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', flexGrow: 1, overflow: 'hidden' }}>

                            {/* Main Content Area */}
                            <div style={{ padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem', borderRight: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>Título de la entrada</label>
                                        <input name="title" defaultValue={editingPost?.title} required placeholder="Escribe un título atractivo..." style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 500, outlineColor: '#d4a373' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>URL Amigable (slug)</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>comoencasa.com/blog/</span>
                                            <input name="slug" defaultValue={editingPost?.slug} required placeholder="mi-primera-entrada" style={{ flexGrow: 1, background: 'transparent', border: 'none', padding: '0.5rem 0', fontWeight: 600, color: '#1e293b', outline: 'none' }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>Extracto (Preview)</label>
                                        <textarea name="excerpt" defaultValue={editingPost?.excerpt} rows={3} placeholder="Un breve resumen que se verá en el listado..." style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '2px solid #e2e8f0', resize: 'none', fontSize: '1rem', outlineColor: '#d4a373' }} />
                                    </div>
                                    <div className="form-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>Contenido Completo (Markdown)</label>
                                        <textarea name="content" defaultValue={editingPost?.content} rows={15} required placeholder="Empieza a escribir tu historia..." style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '1rem', lineHeight: '1.6', outlineColor: '#d4a373', fontFamily: 'inherit', flexGrow: 1 }} />
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Area */}
                            <div style={{ padding: '2.5rem', background: '#fafafa', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                {/* Status Card */}
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <h4 style={{ margin: '0 0 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}><Settings size={18} color="#d4a373" /> Publicación</h4>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        <div className="form-group">
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Idioma</label>
                                            <select name="language" defaultValue={editingPost?.language} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1e293b' }}>
                                                <option value="es">Español (ES)</option>
                                                <option value="en">English (EN)</option>
                                            </select>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Visibilidad</span>
                                            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                                <input type="checkbox" name="is_published" defaultChecked={editingPost?.is_published} style={{ opacity: 0, width: 0, height: 0 }} />
                                                <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: editingPost?.is_published ? '#d4a373' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                                                    <span style={{ position: 'absolute', height: '18px', width: '18px', left: editingPost?.is_published ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                                </span>
                                            </label>
                                        </div>

                                        <button type="submit" disabled={isSaving} style={{ width: '100%', background: '#1e293b', color: 'white', border: 'none', padding: '1.1rem', borderRadius: '50px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', transition: 'all 0.2s', marginTop: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
                                            {isSaving ? 'Guardando...' : <><Save size={20} /> Guardar Entrada</>}
                                        </button>
                                    </div>
                                </div>

                                {/* SEO Card */}
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <h4 style={{ margin: '0 0 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}><Globe size={18} color="#3b82f6" /> Configuración SEO</h4>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        <div className="form-group">
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Meta Title</label>
                                            <input name="meta_title" defaultValue={editingPost?.meta_title} placeholder="Max 60 caracteres" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }} />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Meta Description</label>
                                            <textarea name="meta_description" defaultValue={editingPost?.meta_description} rows={3} placeholder="Max 155 caracteres" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem', resize: 'none' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Media Card */}
                                <div className="form-group">
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>Imagen de cabecera (URL)</label>
                                    <input name="image_url" defaultValue={editingPost?.image_url} style={{ width: '100%', padding: '0.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }} />
                                    {editingPost?.image_url && (
                                        <div style={{ marginTop: '0.8rem', borderRadius: '12px', overflow: 'hidden', height: '100px', border: '1px solid #e2e8f0' }}>
                                            <img src={editingPost.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
