import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  
  const scriptLines = [
    'FADE IN:',
    'EXT. COFFEE SHOP - DAY',
    'A bustling coffee shop with writers collaborating...',
    'Two SCREENWRITERS sit across from each other,',
    'laptops open, discussing their latest project.',
    '',
    'WRITER 1',
    'What if we add real-time collaboration?',
    '',
    'WRITER 2', 
    '(excited)',
    'That\'s exactly what ScriptSync does!'
  ];

  // Typing animation effect
  useEffect(() => {
    if (currentLineIndex < scriptLines.length) {
      const currentLine = scriptLines[currentLineIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= currentLine.length) {
          setTypingText(prev => {
            const lines = scriptLines.slice(0, currentLineIndex);
            lines.push(currentLine.substring(0, charIndex));
            return lines.join('\n');
          });
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
          }, 500);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    } else {
      // Reset animation after completion
      const resetTimeout = setTimeout(() => {
        setCurrentLineIndex(0);
        setTypingText('');
      }, 3000);
      
      return () => clearTimeout(resetTimeout);
    }
  }, [currentLineIndex]);

  const handleGetStarted = () => {
    onAuthClick('register');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
        {/* Floating orbs with different sizes and animations */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main Headline with stagger animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Collaborative Script Writing
            <motion.span 
              className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Reimagined
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-body max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Create, collaborate, and perfect your scripts in real-time with professional writers and monitors. 
            Experience the future of screenplay development with ScriptSync.
          </motion.p>
        </motion.div>

        {/* CTA Buttons with hover animations */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={handleGetStarted}
              iconName="Zap"
              iconPosition="left"
              className="shadow-floating hover:shadow-2xl transition-all duration-300 min-w-48 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </motion.div>
        </motion.div>



        {/* Enhanced Visual Preview with Glowing Effects */}
        <motion.div 
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl transform scale-105 animate-pulse"></div>
          
          <motion.div 
            className="relative glass-effect border border-border rounded-2xl p-8 shadow-elevated max-w-4xl mx-auto backdrop-blur-sm"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Browser-like header with animations */}
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex space-x-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-destructive"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-warning"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-success"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
              </div>
              <motion.div 
                className="flex-1 glass-effect rounded-lg px-4 py-2 relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                <span className="text-sm text-muted-foreground font-mono">ScriptSync Editor</span>
                <motion.div 
                  className="absolute top-0 left-0 h-full w-1 bg-primary"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            {/* Floating action buttons - positioned above script content and aligned to left */}
            <motion.div 
              className="flex justify-start items-center gap-4 mb-6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, type: "spring" }}
            >
              <motion.div 
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30 shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
              >
                <Icon name="Zap" size={18} className="text-primary" />
              </motion.div>
              <motion.div 
                className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary/30 shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.3)" }}
              >
                <Icon name="Users" size={18} className="text-secondary" />
              </motion.div>
            </motion.div>

            {/* Enhanced Script Content with Typing Animation */}
            <div className="text-left space-y-2 font-mono text-sm min-h-[300px]">
              {typingText.split('\n').map((line, index) => {
                const isCharacter = line === 'WRITER 1' || line === 'WRITER 2';
                const isDirection = line.includes('(') && line.includes(')');
                const isSceneHeader = line.includes('EXT.') || line.includes('INT.') || line === 'FADE IN:';
                
                return (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-muted-foreground w-6 text-right">{index + 1}</span>
                    <div className="flex-1">
                      {isSceneHeader ? (
                        <span className="text-primary font-bold">{line}</span>
                      ) : isCharacter ? (
                        <span className="text-secondary font-bold">{line}</span>
                      ) : isDirection ? (
                        <span className="text-accent italic">{line}</span>
                      ) : (
                        <span className="text-foreground">{line}</span>
                      )}
                      
                      {/* Live collaboration indicator */}
                      {line.includes('collaboration') && (
                        <motion.div 
                          className="inline-flex items-center ml-2 px-2 py-1 rounded bg-secondary/20 text-secondary text-xs"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 2, type: "spring" }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Icon name="User" size={12} className="mr-1" />
                          </motion.div>
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Writers editing
                          </motion.span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Blinking cursor */}
              <motion.div 
                className="flex items-start space-x-4"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-muted-foreground w-6 text-right">{typingText.split('\n').length + 1}</span>
                <div className="w-2 h-5 bg-primary"></div>
              </motion.div>
            </div>
            

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;