import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionType?: "fade" | "slide" | "scale" | "slideUp" | "slideDown";
}

const PageTransition = ({ 
  children, 
  className = "", 
  transitionType = "fade" 
}: PageTransitionProps) => {
  
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { duration: 0.3, ease: "easeOut" }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const motionProps = transitions[transitionType];

  return (
    <motion.div
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Wrapper for route-level animations
const RouteTransition = ({ 
  children, 
  className = "",
  transitionType = "slideUp" 
}: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <PageTransition 
        className={`min-h-screen ${className}`}
        transitionType={transitionType}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

// Staggered children animation container
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const StaggerContainer = ({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  );
};

export { PageTransition, RouteTransition, StaggerContainer };
export type { PageTransitionProps, StaggerContainerProps };