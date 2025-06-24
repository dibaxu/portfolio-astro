import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial, AdaptiveDpr, Bvh, Preload } from "@react-three/drei";
import * as THREE from "three";

// Crear el material shader personalizado
const LiquidMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uRipples: new Array(10).fill().map(() => new THREE.Vector2(0, 0)),
    uRippleStrengths: new Array(10).fill(0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec2 uRipples[10];
    uniform float uRippleStrengths[10];
    varying vec2 vUv;

    // Función de ruido simplex
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec2 mod289(vec2 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec3 permute(vec3 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                         -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 st = vUv;
      vec2 mouse = uMouse * 0.5 + 0.5;
      
      // Movimiento líquido más orgánico
      vec2 liquidFlow = vec2(
        snoise(st * 2.0 + vec2(uTime * 0.1, 0.0)) * 0.02,
        snoise(st * 2.0 + vec2(0.0, uTime * 0.08)) * 0.02
      );
      
      st += liquidFlow;
      
      // Múltiples capas de ruido para crear fluido dinámico
      float noise1 = snoise(st * 4.0 + uTime * 0.05);
      float noise2 = snoise(st * 8.0 + uTime * 0.08 + vec2(100.0)) * 0.5;
      float noise3 = snoise(st * 16.0 + uTime * 0.12 + vec2(200.0)) * 0.25;
      
      float combinedNoise = (noise1 + noise2 + noise3) * 0.5 + 0.5;
      
      // Efecto de ondas por clicks
      float rippleEffect = 0.0;
      for(int i = 0; i < 10; i++) {
        vec2 ripplePos = uRipples[i];
        float strength = uRippleStrengths[i];
        if(strength > 0.0) {
          float dist = length(st - ripplePos);
          float wave = sin(dist * 30.0 - uTime * 8.0) * 0.5 + 0.5;
          float falloff = 1.0 - smoothstep(0.0, 0.3, dist);
          rippleEffect += wave * falloff * strength;
        }
      }
      
      // Influencia sutil del mouse
      float mouseDistance = length(st - mouse);
      float mouseInfluence = 1.0 - smoothstep(0.0, 0.4, mouseDistance);
      mouseInfluence *= 0.15;
      
      // Combinación final con ondas
      float finalNoise = combinedNoise + mouseInfluence + rippleEffect * 0.3;
      
      // Gradientes de colores vibrantes
      vec3 purple = vec3(0.4, 0.2, 0.8);     // Púrpura profundo
      vec3 blue = vec3(0.2, 0.6, 1.0);       // Azul cyan
      vec3 pink = vec3(1.0, 0.3, 0.6);       // Rosa vibrante  
      vec3 yellow = vec3(1.0, 0.8, 0.2);     // Amarillo cálido
      vec3 teal = vec3(0.2, 0.8, 0.8);       // Verde azulado

      // Mezcla de colores basada en posición y ruido
      vec3 colorA = mix(purple, blue, smoothstep(0.0, 1.0, st.x + combinedNoise * 0.3));
      vec3 colorB = mix(pink, teal, smoothstep(0.0, 1.0, st.y + combinedNoise * 0.2));
      vec3 colorC = mix(blue, yellow, smoothstep(0.2, 0.8, finalNoise));
      
      // Mezcla final con múltiples capas
      vec3 finalColor = mix(colorA, colorB, smoothstep(0.3, 0.7, finalNoise));
      finalColor = mix(finalColor, colorC, smoothstep(0.4, 0.9, combinedNoise + rippleEffect));
      
      // Efecto de ondas que afecta el color
      finalColor += vec3(rippleEffect * 0.4);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Extender para usar en JSX
extend({ LiquidMaterial });

// Componente del plano con shader
function LiquidPlane() {
  const meshRef = useRef();
  const { viewport, pointer } = useThree();
  const [ripples] = useState(() =>
    new Array(10).fill().map(() => new THREE.Vector2(0, 0))
  );
  const [rippleStrengths] = useState(() => new Array(10).fill(0));
  const [rippleIndex, setRippleIndex] = useState(0);

  // Memoizar uniforms iniciales
  const uniforms = useMemo(
    () => ({
      uTime: 0,
      uMouse: new THREE.Vector2(0, 0),
      uResolution: new THREE.Vector2(viewport.width, viewport.height),
      uRipples: ripples,
      uRippleStrengths: rippleStrengths,
    }),
    [viewport.width, viewport.height, ripples, rippleStrengths]
  );

  // Actualizar uniforms en cada frame
  useFrame((state) => {
    if (meshRef.current?.material) {
      const material = meshRef.current.material;

      // Actualizar tiempo
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Suavizar movimiento del mouse
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(pointer.x, pointer.y),
        0.02
      );

      // Animar decaimiento de ondas
      let needsUpdate = false;
      for (let i = 0; i < rippleStrengths.length; i++) {
        if (rippleStrengths[i] > 0) {
          rippleStrengths[i] *= 0.985;
          if (rippleStrengths[i] < 0.01) {
            rippleStrengths[i] = 0;
          }
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        material.uniforms.uRippleStrengths.value = [...rippleStrengths];
      }
    }
  });

  // Manejar clicks para crear ondas
  const handleClick = (event) => {
    event.stopPropagation();

    // Convertir coordenadas del click a UV (0-1)
    const x = (pointer.x + 1) / 2;
    const y = (pointer.y + 1) / 2;

    // Agregar nueva onda
    ripples[rippleIndex].set(x, y);
    rippleStrengths[rippleIndex] = 1.0;

    // Actualizar uniforms
    if (meshRef.current?.material) {
      meshRef.current.material.uniforms.uRipples.value = [...ripples];
      meshRef.current.material.uniforms.uRippleStrengths.value = [
        ...rippleStrengths,
      ];
    }

    setRippleIndex((prev) => (prev + 1) % 10);
  };

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <liquidMaterial {...uniforms} transparent={false} />
    </mesh>
  );
}

// Componente principal
const AnimatedBackground = () => {
  return (
    <div className='fixed inset-0 -z-10'>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Bvh>
          <AdaptiveDpr pixelated />
          <LiquidPlane />
          <Preload all />
        </Bvh>
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
