"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const services = [
    "Limpeza de Condomínios",
    "Higienização Hospitalar",
    "Limpeza de Escritórios",
    "Limpeza de Shoppings",
    "Limpeza de Escolas",
    "Limpeza de Igrejas",
    "Limpeza Pós Obra",
    "Limpeza de Eventos",
    "Limpeza de Residências",
    "Limpeza de Vidros",
    "Limpeza de Estofados",
  ]

  const quickLinks = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Galeria", href: "#galeria" },
    { name: "Contato", href: "#contato" },
    { name: "Localização", href: "#localizacao" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61575488696097", color: "hover:text-blue-500" },
    { icon: Instagram, href: "https://www.instagram.com/hekumbihigienizacaoelimpeza", color: "hover:text-pink-500" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", color: "hover:text-cyan-400" },
  ]

  return (
    <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                HEKUMBI
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-cyan-400"
                >
                  .
                </motion.span>
              </h3>
              <p className="text-cyan-400 text-sm font-medium">Comércio Geral e Serviços</p>
            </motion.div>

            <motion.p className="text-gray-300 text-sm leading-relaxed mb-6" whileHover={{ rotateX: 2, scale: 1.01 }}>
              Empresa angolana especializada em soluções de limpeza e higienização profissional, comprometida com a
              excelência e qualidade em todos os nossos serviços.
            </motion.p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.div className="flex items-center gap-3 text-gray-300 text-sm" whileHover={{ x: 5, rotateY: 2 }}>
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Shopping Talatona, casa n.º 92, Luanda</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-gray-300 text-sm" whileHover={{ x: 5, rotateY: 2 }}>
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+244 972 620 967</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-gray-300 text-sm" whileHover={{ x: 5, rotateY: 2 }}>
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>contato@hekumbi.co.ao</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h4 className="text-lg font-bold text-white mb-6" whileHover={{ rotateX: 5, scale: 1.02 }}>
              Nossos Serviços
            </motion.h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 5, rotateY: 2 }}
                  className="text-gray-300 text-sm hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h4 className="text-lg font-bold text-white mb-6" whileHover={{ rotateX: 5, scale: 1.02 }}>
              Links Rápidos
            </motion.h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-gray-300 text-sm hover:text-cyan-400 transition-colors"
                    whileHover={{ x: 5, rotateY: 2 }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h4 className="text-lg font-bold text-white mb-6" whileHover={{ rotateX: 5, scale: 1.02 }}>
              Newsletter
            </motion.h4>
            <motion.p className="text-gray-300 text-sm mb-4" whileHover={{ rotateX: 2, scale: 1.01 }}>
              Receba novidades e dicas de limpeza diretamente no seu email.
            </motion.p>

            <div className="space-y-3">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input
                  type="email"
                  placeholder="Seu email"
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, rotateY: 2 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">Inscrever-se</Button>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <motion.p className="text-gray-300 text-sm mb-3" whileHover={{ rotateX: 2, scale: 1.01 }}>
                Siga-nos nas redes sociais:
              </motion.p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                    whileHover={{
                      scale: 1.1,
                      rotateY: 15,
                      rotateX: 15,
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{ transformPerspective: 1000 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-slate-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p className="text-gray-400 text-sm" whileHover={{ rotateX: 2, scale: 1.01 }}>
              © {currentYear} HEKUMBI - Comércio Geral e Serviços. Todos os direitos reservados.
            </motion.p>

            <motion.div className="flex gap-6 text-sm" whileHover={{ rotateX: 2, scale: 1.01 }}>
              <motion.a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" whileHover={{ y: -2 }}>
                Política de Privacidade
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" whileHover={{ y: -2 }}>
                Termos de Uso
              </motion.a>
            </motion.div>
          </div>

          {/* Company Details */}
          <motion.div className="mt-4 text-center" whileHover={{ rotateX: 2, scale: 1.01 }}>
            <p className="text-gray-500 text-xs">
              NIF: 5002411601 | Matriculada na Conservatória do Registo Comercial do Guiché Único da Empresa
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
