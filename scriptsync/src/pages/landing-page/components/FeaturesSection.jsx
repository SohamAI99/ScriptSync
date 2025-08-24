import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturesSection = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      id: 1,
      icon: 'Users',
      title: 'Real-Time Collaboration',
      description: 'Write together with your team in real-time. See live cursors, instant edits, and collaborate seamlessly across any device.',
      highlights: ['Live cursor tracking', 'Instant synchronization', 'Multi-user editing'],
      color: 'primary'
    },
    {
      id: 2,
      icon: 'GitBranch',
      title: 'Version Control',
      description: 'Never lose your work with automatic saves and comprehensive version history. Compare changes and restore any previous version.',
      highlights: ['Automatic saves', 'Version history', 'Change comparison'],
      color: 'secondary'
    },
    {
      id: 3,
      icon: 'Shield',
      title: 'Secure Sharing',
      description: 'Share your scripts securely with password protection, expiration dates, and granular permission controls.',
      highlights: ['Password protection', 'Time-limited access', 'Permission controls'],
      color: 'success'
    },
    {
      id: 4,
      icon: 'CheckCircle',
      title: 'Approval Workflows',
      description: 'Streamline your review process with built-in approval workflows, comments, and feedback management.',
      highlights: ['Review workflows', 'Inline comments', 'Approval tracking'],
      color: 'warning'
    }
  ];

  const handleFeatureClick = () => {
    onAuthClick('register');
  };

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-background to-background/95 relative overflow-hidden" ref={ref}>
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/5 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with stagger animation */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Everything You Need to
            <motion.span 
              className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Create Amazing Scripts
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground font-body max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Professional tools designed for modern script writers and production teams. 
            Collaborate efficiently and bring your stories to life.
          </motion.p>
        </motion.div>

        {/* Features Grid with stagger animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.id}
              className="group relative"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.8 + index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              {/* Glow effect on hover */}
              <motion.div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${
                    feature?.color === 'primary' ? 'rgba(139, 92, 246, 0.1)' :
                    feature?.color === 'secondary' ? 'rgba(236, 72, 153, 0.1)' :
                    feature?.color === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)'
                  } 0%, transparent 70%)`
                }}
              />
              
              <div
                className="relative glass-effect border border-border rounded-2xl p-6 transition-all duration-300 hover:glass-effect-hover hover:shadow-elevated cursor-pointer h-full"
                onClick={handleFeatureClick}
              >
                {/* Animated Icon */}
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    feature?.color === 'primary' ? 'from-primary/20 to-primary/10' :
                    feature?.color === 'secondary' ? 'from-secondary/20 to-secondary/10' :
                    feature?.color === 'success'? 'from-success/20 to-success/10' : 'from-warning/20 to-warning/10'
                  } flex items-center justify-center mb-4 relative overflow-hidden group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon 
                    name={feature?.icon} 
                    size={24} 
                    className={`${
                      feature?.color === 'primary' ? 'text-primary' :
                      feature?.color === 'secondary' ? 'text-secondary' :
                      feature?.color === 'success'? 'text-success' : 'text-warning'
                    } relative z-10`}
                  />
                  {/* Pulsing background effect */}
                  <motion.div 
                    className={`absolute inset-0 rounded-xl ${
                      feature?.color === 'primary' ? 'bg-primary/20' :
                      feature?.color === 'secondary' ? 'bg-secondary/20' :
                      feature?.color === 'success'? 'bg-success/20' : 'bg-warning/20'
                    }`}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Content */}
                <motion.h3 
                  className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {feature?.title}
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground font-body mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  {feature?.description}
                </motion.p>

                {/* Highlights with stagger */}
                <ul className="space-y-2">
                  {feature?.highlights?.map((highlight, highlightIndex) => (
                    <motion.li 
                      key={highlightIndex} 
                      className="flex items-center space-x-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 1.2 + index * 0.1 + highlightIndex * 0.05 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Icon name="Check" size={16} className="text-success" />
                      </motion.div>
                      <span className="font-body">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA with enhanced animations */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div 
            className="relative glass-effect border border-border rounded-2xl p-8 max-w-2xl mx-auto overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Animated background gradient */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05), rgba(34, 197, 94, 0.05))",
                  "linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(34, 197, 94, 0.05), rgba(139, 92, 246, 0.05))",
                  "linear-gradient(225deg, rgba(34, 197, 94, 0.05), rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))",
                  "linear-gradient(315deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05), rgba(34, 197, 94, 0.05))"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10">
              <motion.h3 
                className="text-2xl font-heading font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1.7 }}
              >
                Ready to Transform Your Writing Process?
              </motion.h3>
              <motion.p 
                className="text-muted-foreground font-body mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1.8 }}
              >
                Join thousands of writers who have already revolutionized their creative workflow with ScriptSync.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 1.9, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleFeatureClick}
                  iconName="Rocket"
                  iconPosition="left"
                  className="shadow-floating hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Writing Today</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;