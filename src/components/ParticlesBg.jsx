import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBg() {
  const init = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
  init={init}
  options={{
    fullScreen: { enable: false },

    fpsLimit: 60,

    particles: {
      number: {
        value: 35,
        density: {
          enable: true,
          area: 900
        }
      },

      color: { value: "#ff4fa3" },

      opacity: {
        value: 0.3
      },

      size: {
        value: { min: 2, max: 5 }
      },

      move: {
        enable: true,
        speed: 0.1,          // 🔥 медленно
        direction: "none",   // 🔥 без направления
        random: true,        // 🔥 мягкое дрейфование
        straight: false,
        outModes: {
          default: "out"     // 🔥 плавный выход за границу
        }
      }
    },

    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse"
        }
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4
        }
      }
    },

    detectRetina: true
  }}
/>
  );
}