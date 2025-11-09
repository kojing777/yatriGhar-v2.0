import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaArrowUp, FaArrowLeft, FaArrowRight, FaTimes, FaExpand } from 'react-icons/fa'

const images = [
    'https://i.pinimg.com/1200x/b2/93/ed/b293ed226dea5a9b09f978f6f97f7448.jpg',
    'https://i.pinimg.com/736x/21/42/9a/21429a87cfd282896d2adb6d596744c0.jpg',
    'https://i.pinimg.com/736x/08/b2/8e/08b28eb271231836a1a15bc21bf812a1.jpg',
    'https://i.pinimg.com/736x/5e/02/08/5e020803773b2ff8d25c8ede8a756a19.jpg',
    'https://i.pinimg.com/1200x/3e/84/6d/3e846d470cb2bba32c49f4bdb893e411.jpg',
    'https://i.pinimg.com/736x/50/f8/ae/50f8ae7d25c9c47f495bf75df36405f0.jpg',
    'https://i.pinimg.com/736x/69/1f/1a/691f1a642b4dadd98f1eab711603beb4.jpg',
    'https://i.pinimg.com/736x/2b/98/20/2b9820bd330b79b9ff7830064bf6e588.jpg',
    'https://i.pinimg.com/1200x/d8/4e/e5/d84ee5c443a65009088b66e3d78c5371.jpg',
    'https://i.pinimg.com/736x/a2/cb/8e/a2cb8ecb98858b19bb727f09b811b118.jpg',
    'https://i.pinimg.com/736x/b0/8f/0b/b08f0bc6d04da1d1a53a26f9517708f6.jpg',
    'https://i.pinimg.com/1200x/ce/4c/ae/ce4cae1267d337dbb25999c5f038a873.jpg'
]

function randomNameFallback() {
    const names = ['Aarav', 'Maya', 'Rohan', 'Anika', 'Siddharth', 'Isha', 'Karan', 'Priya']
    return names[Math.floor(Math.random() * names.length)]
}

const GalleryAll = () => {
    const [userName, setUserName] = useState('Guest')
    const [showTop, setShowTop] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [mounted, setMounted] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setMounted(true)
        window.scrollTo(0, 0)

        try {
            const raw = localStorage.getItem('user')
            if (raw) {
                const parsed = JSON.parse(raw)
                const name = parsed?.name || (parsed?.firstName && parsed?.lastName && `${parsed.firstName} ${parsed.lastName}`)
                setUserName(name || randomNameFallback())
            } else {
                setUserName(randomNameFallback())
            }
        } catch (e) {
            console.warn(e)
            setUserName(randomNameFallback())
        }

        const requestedIndex = location?.state?.imageIndex
        if (typeof requestedIndex === 'number') {
            const el = document.getElementById(`gallery-${requestedIndex}`)
            if (el) {
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200)
                el.classList.add('ring-4', 'ring-amber-400')
                setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2200)
            }
        }

        const onScroll = () => setShowTop(window.scrollY > 400)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [location])

    useEffect(() => {
        if (!modalOpen) return
        const onKey = (e) => {
            if (e.key === 'Escape') setModalOpen(false)
            if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % images.length)
            if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + images.length) % images.length)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [modalOpen])

    const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/20 px-4 py-8 mt-14 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className={`text-center mb-12 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
                    YatriGhar Gallery
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Curated photos by {userName} — explore our favourite stays and destinations across Nepal's beautiful landscapes.
                </p>
            </div>

            {/* Gallery Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                {images.map((src, idx) => (
                    <div
                        id={`gallery-${idx}`}
                        key={idx}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                        onClick={() => {
                            setCurrentIndex(idx)
                            setModalOpen(true)
                        }}
                    >
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                            <img
                                src={src}
                                alt={`YatriGhar Gallery - Photo ${idx + 1}`}
                                loading="lazy"
                                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Hover Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center justify-between text-white">
                                    <div>
                                        <h3 className="font-semibold text-sm">YatriGhar Photo #{idx + 1}</h3>
                                        <p className="text-xs text-white/80 mt-1">Click to view full size</p>
                                    </div>
                                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                                        <FaExpand className="text-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Corner Badge */}
                            <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                #{idx + 1}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="relative max-w-6xl w-full mx-4">
                        {/* Close Button */}
                        <button
                            aria-label="Close gallery"
                            onClick={() => setModalOpen(false)}
                            className="absolute -top-4 -right-4 z-10 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300"
                        >
                            <FaTimes className="text-lg" />
                        </button>

                        {/* Main Image */}
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={images[currentIndex]} 
                                alt={`YatriGhar Gallery - Photo ${currentIndex + 1}`} 
                                className="w-full h-[70vh] object-contain"
                            />
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-between mt-6 px-4">
                            <button
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setCurrentIndex((i) => (i - 1 + images.length) % images.length) 
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <FaArrowLeft className="text-sm" />
                                Previous
                            </button>

                            <div className="text-white text-center">
                                <div className="text-sm font-medium text-amber-200">YatriGhar Gallery</div>
                                <div className="text-lg font-semibold">Photo {currentIndex + 1} of {images.length}</div>
                            </div>

                            <button
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setCurrentIndex((i) => (i + 1) % images.length) 
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                Next
                                <FaArrowRight className="text-sm" />
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                            {images.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                                        idx === currentIndex 
                                            ? 'ring-4 ring-amber-500 scale-110' 
                                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrentIndex(idx)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Back to Top Button */}
            {showTop && (
                <button
                    onClick={handleBackToTop}
                    aria-label="Back to top"
                    className="fixed right-6 bottom-6 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                    <FaArrowUp className="text-lg" />
                </button>
            )}
        </div>
    )
}

export default GalleryAll