import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa"; // Importing social media icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Social Media Content Analyzer</h2>
        <p className="text-sm mb-4">Email: <a href="mailto:sagarhaldar987@gmail.com" className="underline">sagarhaldar987@gmail.com</a></p>

        <div className="flex justify-center space-x-6 mb-4">
          {/* LinkedIn Icon */}
          <a href="https://www.linkedin.com/in/sagar-haldar-87282b201/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-blue-600 text-2xl hover:text-blue-800 transition duration-200" />
          </a>

          {/* GitHub Icon */}
          <a href="https://github.com/Sagarhaldar0009" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-gray-300 text-2xl hover:text-gray-500 transition duration-200" />
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          &copy; 2025 Sagar Haldar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
