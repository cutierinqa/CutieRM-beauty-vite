import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBg() {
  const init = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      init={init}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: { value: 35 },
          color: { value: "#ff4fa3" },
          opacity: { value: 0.2 },
          size: { value: 4 },
          move: {
            enable: true,
            speed: 0.6
          }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" }
          }
        }
      }}
    />
  );
}