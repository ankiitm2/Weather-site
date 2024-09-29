import { useEffect } from "react";
import Weather from "./Components/Weather";

function App() {
  useEffect(() => {
    const canvas = document.getElementById(
      "sunbeamCanvas"
    ) as HTMLCanvasElement | null; // Cast to HTMLCanvasElement
    if (!canvas) return; // Check for null
    const ctx = canvas.getContext("2d");

    // Initial canvas size setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Variables
    // eslint-disable-next-line prefer-const
    let config = {
      amountOfBeams: 50,
      minLength: window.innerHeight,
      maxLength: Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2),
      gradientStartOpacity: 0.05,
      gradientEndOpacity: 0,
      circleRadius: 130,
      blurStrength: 5,
      fadeInOutTime: 15,
      rotationSpeed: -0.004,
      lineWidth: 45,
      beamOrigin: { x: canvas.width / 2, y: canvas.height / 2 },
      beamColor: "#FFFF99",
    };

    function generateBeams() {
      // eslint-disable-next-line prefer-const
      let beams = [];
      for (let i = 0; i < config.amountOfBeams; i++) {
        // eslint-disable-next-line prefer-const
        let length =
          Math.random() * (config.maxLength - config.minLength) +
          config.minLength;
        // eslint-disable-next-line prefer-const
        let angle = Math.random() * Math.PI * 2;
        // eslint-disable-next-line prefer-const
        let widthRandomness = Math.random();
        // eslint-disable-next-line prefer-const
        let biasedWidth = widthRandomness * widthRandomness;
        // eslint-disable-next-line prefer-const
        let width =
          biasedWidth * (config.lineWidth - config.lineWidth / 10) +
          config.lineWidth / 10;
        // eslint-disable-next-line prefer-const
        let opacityPhase = Math.random() * Math.PI * 2;

        beams.push({ length, angle, width, opacityPhase });
      }
      return beams;
    }

    let beams = generateBeams();

    function drawBeams() {
      if (!ctx) return; // Check if ctx is not null
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Object is possibly 'null'
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.filter = `blur(${config.blurStrength}px)`;
      ctx.translate(config.beamOrigin.x, config.beamOrigin.y);

      beams.forEach((beam) => {
        // eslint-disable-next-line prefer-const
        let opacity =
          (Math.sin(
            (performance.now() / 1000 + beam.opacityPhase) /
              config.fadeInOutTime
          ) +
            1) /
          2;

        // eslint-disable-next-line prefer-const
        let gradient = ctx.createLinearGradient(
          0,
          0,
          Math.cos(beam.angle) * beam.length,
          Math.sin(beam.angle) * beam.length
        );
        gradient.addColorStop(
          0,
          `rgba(255, 255, 153, ${config.gradientStartOpacity * opacity})`
        );
        gradient.addColorStop(
          1,
          `rgba(255, 255, 153, ${config.gradientEndOpacity})`
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(beam.angle) * beam.length,
          Math.sin(beam.angle) * beam.length
        );
        ctx.stroke();
      });

      ctx.restore();
    }

    function animate() {
      beams.forEach((beam) => {
        beam.angle += config.rotationSpeed;
      });

      drawBeams();
      requestAnimationFrame(animate);
    }

    const handleResize = () => {
      if (!canvas) return; // Check for null
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      config.minLength = window.innerHeight;
      config.maxLength = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2
      );
      config.beamOrigin = { x: canvas.width / 2, y: canvas.height / 2 };
      beams = generateBeams();
    };

    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <canvas id="sunbeamCanvas"></canvas>
      <Weather />
    </>
  );
}

export default App;
