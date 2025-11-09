import React, { useRef, useState } from "react";
import dov1 from "/kaley.jpg";
import dov2 from "/gorey.jpg";
import dov3 from "/me.jpg";

const Card = ({ name, role, description, image, github, linkedin, twitter }) => {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative bg-white overflow-hidden rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      {hover && (
        <span
          className="absolute w-40 h-40 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 blur-3xl opacity-30 rounded-full pointer-events-none transition-transform duration-300"
          style={{ top: pos.y - 80, left: pos.x - 80 }}
        ></span>
      )}

      <div className="relative z-10 flex flex-col items-center p-8 text-center">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full shadow-md mb-4 object-cover border-4 border-indigo-100 transition-transform duration-500 hover:scale-105"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{name}</h2>
        <p className="text-sm text-indigo-500 font-medium mb-3">{role}</p>
        <p className="text-sm text-gray-600 mb-5 px-4">{description}</p>

        <div className="flex space-x-5 text-indigo-600">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <i className="bi bi-github text-2xl"></i>
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <i className="bi bi-linkedin text-2xl"></i>
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <i className="bi bi-twitter text-2xl"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DeveloperCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
      <Card
        name="Bijaya Tamang"
        role="MERN Stack Developer"
        description="Building seamless booking experiences with clean UI and powerful backend logic."
        image={dov3}
        github="https://github.com/kojing777"
        linkedin="#"
        twitter="#"
      />
      <Card
        name="Prayuz Gamal"
        role="Quality Assurance Engineer"
        description="Designing user-focused interfaces and ensuring top-notch performance and accessibility."
        image={dov1}
        github="https://github.com/Prayuzzzzzz"
        linkedin="#"
        twitter="#"
      />
      <Card
        name="Sachin Magar"
        role="Frontend Developer"
        description="Ensuring scalability, security, and efficiency across YatriGhar’s digital ecosystem."
        image={dov2}
        github="https://github.com/sujanmagr"
        linkedin="#"
        twitter="#"
      />
    </div>
  );
}
