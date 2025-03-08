
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

type AmbientParticle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  direction: number;
};

const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AmbientParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const { theme } = useTheme();
  
  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Reinitialize particles when canvas is resized
      initParticles();
    };
    
    const initParticles = () => {
      if (!canvas) return;
      
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // Density based on canvas size
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.2 + 0.05,
          direction: Math.random() * Math.PI * 2,
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas with transparent background to create trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Change direction slightly for natural movement
        particle.direction += (Math.random() - 0.5) * 0.05;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const particleColor = theme === 'dark' 
          ? `rgba(255, 255, 255, ${particle.opacity})` 
          : `rgba(0, 0, 0, ${particle.opacity})`;
          
        ctx.fillStyle = particleColor;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      aria-hidden="true"
    />
  );
};

export default AmbientBackground;
