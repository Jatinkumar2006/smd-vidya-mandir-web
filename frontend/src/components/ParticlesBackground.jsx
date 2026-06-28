import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    // loadSlim loads the lightweight version of tsParticles (no heavy plugins)
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1, // Sit above the image, below the text
        pointerEvents: 'none', // Ensure it doesn't block clicks on the page
      }}
      options={{
        fullScreen: { enable: false, zIndex: 1 },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Lines connect to cursor on hover
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.6,
                color: "#f59e0b" // Gold grab lines
              },
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff", // White particles
          },
          links: {
            color: "#ffffff", // White links
            distance: 120,
            enable: true,
            opacity: 0.3, // Soft transparency
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60, // Number of particles
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
