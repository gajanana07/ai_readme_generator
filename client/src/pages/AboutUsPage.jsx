// About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import { FileText, Zap, CheckCircle, Layers } from "lucide-react";
import { motion } from "framer-motion"; // 👈 animations
import logo from "../../public/logoo.png";

export default function About() {
  const navigate = useNavigate();

  const infoData = [
    {
      icon: <FileText size={48} />,
      title: "AI-Powered Content",
      description:
        "Generate professional, well-structured README files instantly with the help of AI. No more blank-page struggle.",
    },
    {
      icon: <Zap size={48} />,
      title: "Save Hours of Work",
      description:
        "Focus on building your project while we handle the documentation in seconds—clear, concise, and customized.",
    },
    {
      icon: <CheckCircle size={48} />,
      title: "Polished & Consistent",
      description:
        "Every README follows best practices with clean formatting, sections, and consistency that impress recruiters and collaborators.",
    },
    {
      icon: <Layers size={48} />,
      title: "Tailored to Your Project",
      description:
        "Whether it’s web apps, data science, or open-source libraries, our generator adapts the README to fit your project’s style.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-900 via-green-800 to-black text-white relative overflow-hidden">
      {/* Decorative Watercolor Blob (Inspectocat) with Animation */}
      {/* Decorative Watercolor Blobs with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 0.2, y: 0 }} // 👈 keeps watermark faded
        transition={{ duration: 1 }}
        className="absolute top-10 left-10 w-64 h-64 bg-[url('/inspectocat.png')] bg-contain bg-no-repeat pointer-events-none"
      ></motion.div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-gradient-to-r from-green-700/40 to-green-900/30 hover:from-green-600/50 hover:to-green-800/40 transition-all duration-300 border border-green-700 z-[50]"
      >
        Home
      </button>

      {/* Top Section */}
      <motion.div
        className="text-center px-6 pt-20 pb-16 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-4">
          <img src={logo} alt="Project Icon" className="w-16 h-16" />
          <h1 className="text-5xl font-extrabold">ReadMe AI</h1>
        </div>

        <p className="mt-4 text-gray-400 text-lg">
          Less time writing docs, more time building.
        </p>

        <motion.div
          className="mt-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6 relative inline-block">
            Empowering Your Projects
            <span className="absolute -z-10 left-0 bottom-1 w-full h-4 bg-[url('/images/watercolor-stroke.png')] bg-cover opacity-40"></span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-200">
            At ReadMe AI, we believe great projects deserve great documentation.
            Our platform harnesses AI to create clear, structured, and
            professional README files—helping developers save time, showcase
            their work effectively, and focus on building what truly matters.
          </p>
        </motion.div>
      </motion.div>

      {/* Info Cards with Scroll Animation */}
      <div className="p-10 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-10">Why Choose Us?</h1>

        <div className="flex flex-col items-center gap-8">
          {infoData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <InfoCard
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-black/40 text-center text-gray-300 py-8 border-t border-gray-700 relative z-10">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Connect with Us
        </h2>
        <p className="mb-6">
          Be part of our journey and explore the future of smart documentation.
        </p>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-700/40 to-green-900/30 hover:from-green-600/50 hover:to-green-800/40 transition-all duration-300 border border-green-700"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-700/40 to-green-900/30 hover:from-green-600/50 hover:to-green-800/40 transition-all duration-300 border border-green-700"
          >
            Instagram ↗
          </a>
          <a
            href="mailto:contact@example.com"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-700/40 to-green-900/30 hover:from-green-600/50 hover:to-green-800/40 transition-all duration-300 border border-green-700"
          >
            Email ↗
          </a>
        </div>

        <p className="text-sm text-gray-500">
          © 2025 Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
