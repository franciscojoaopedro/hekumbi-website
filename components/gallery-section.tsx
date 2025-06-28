"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Interactive3DCard } from "./interactive-3d-card"
import { PinchZoomGallery } from "./pinch-zoom-gallery"
import { Eye, ZoomIn, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"])

  // Placeholder images - em produção, usar imagens reais dos projetos
  const galleryImages = [
    // "/placeholder.svg?height=400&width=400&text=Projeto+Condomínio+1",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Hospital+1",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Escola+1",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Shopping+1",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Empresa+1",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Igreja+1",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Condomínio+2",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Hospital+2",
    // "/placeholder.svg?height=400&width=400&text=Projeto+Escola+2",
    "images/IMG-20250615-WA0049.jpg",
    "images/IMG-20250615-WA0053.jpg",
    "images/IMG-20250604-WA0021.jpg",
    "images/IMG-20250604-WA0024.jpg",
    "images/IMG-20250527-WA0018.jpg",
    "images/IMG-20250518-WA0006.jpg",
    "images/IMG-20250518-WA0006.jpg",
    "images/IMG-20250518-WA0006.jpg",
    "images/IMG-20250518-WA0006.jpg",
    "images/IMG-20250518-WA0006.jpg",
    "images/IMG-20250518-WA0006.jpg",
  ]

  const projects = [
    {
      title: "Centralidade do Sequele",
      category: "Condomínio",
      description: "Lavagem dos sofás",
      image: galleryImages[0],
    },
     {
      title: "Centralidade do Sequele",
      category: "Condomínio",
      description: "Lavagem dos sofás",
      image: galleryImages[1],
    },
     {
      title: "Residencia  Projecto nova vida",
      category: "Residencial",
      description: "Lavagem dos sofás e tapetes",
      image: galleryImages[2],
    },
    {
      title: "Residencia  Projecto nova vida",
      category: "Residencial",
      description: "Lavagem dos sofás e tapetes",
      image: galleryImages[3],
    },

    
    {
      title: "Igreja internacional Sabedoria de Deus ( IISD)",
      category: "Religioso",
      description: "Lavagem e manutenção de templo",
      image: galleryImages[4],
    },
  ]

  return (
    <section id="galeria" className="py-20 bg-slate-800/30 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }} className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 15 }}
          transition={{ duration: 0.8 }}
          style={{ transformPerspective: 1000 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            whileHover={{
              rotateY: 5,
              scale: 1.05,
              transformPerspective: 1000,
            }}
          >
            Nossa <span className="text-cyan-400">Galeria</span>
          </motion.h2>
          <motion.div className="w-24 h-1 bg-cyan-400 mx-auto mb-8" whileHover={{ scaleX: 1.5, rotateZ: 5 }} />
          <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto" whileHover={{ rotateX: 2, scale: 1.02 }}>
            Conheça alguns dos nossos projetos realizados com excelência
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          style={{ y, transformPerspective: 1000 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 45 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Interactive3DCard intensity={1.2} className="h-full">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ transform: "translateZ(10px)" }}
                    />

                    {/* View Button */}
                    <motion.button
                      onClick={() => setSelectedImage(project.image)}
                      className="absolute top-4 right-4 bg-cyan-500/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1, rotateZ: 15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>

                  <div className="p-6">
                    <motion.div
                      className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full mb-3"
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                    >
                      {project.category}
                    </motion.div>

                    <motion.h3
                      className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors"
                      whileHover={{ rotateX: 5, scale: 1.02 }}
                    >
                      {project.title}
                    </motion.h3>

                    <motion.p
                      className="text-gray-300 text-sm leading-relaxed"
                      whileHover={{ rotateX: 2, scale: 1.01 }}
                    >
                      {project.description}
                    </motion.p>
                  </div>
                </div>
              </Interactive3DCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700 p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Galeria Interativa 3D</h3>
            <p className="text-gray-300 mb-6">Use gestos para explorar nossa galeria em 3D</p>
            <div className="flex justify-center gap-4 text-sm text-cyan-400">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                <span>Pinch para zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Arraste para mover</span>
              </div>
            </div>
          </div>

          <PinchZoomGallery images={galleryImages} className="h-96" />
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, rotateY: -15 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.8, rotateY: 15 }}
            className="relative max-w-4xl max-h-full"
            style={{ transformPerspective: 1000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={selectedImage}
              alt="Projeto em destaque"
              className="w-full h-full object-contain rounded-lg"
              whileHover={{ scale: 1.02, rotateY: 2 }}
            />
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
