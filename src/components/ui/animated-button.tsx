import * as React from "react"
import { motion, type MotionProps } from "framer-motion"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonProps {
  animationType?: "scale" | "bounce" | "shake" | "pulse" | "lift";
  children: React.ReactNode;
}

const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps & MotionProps
>(({ 
  className, 
  animationType = "scale", 
  children, 
  disabled,
  ...props 
}, ref) => {
  
  const animations = {
    scale: {
      whileHover: { scale: disabled ? 1 : 1.05 },
      whileTap: { scale: disabled ? 1 : 0.95 },
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    bounce: {
      whileHover: { 
        y: disabled ? 0 : -2,
        transition: { type: "spring", stiffness: 400 }
      },
      whileTap: { 
        y: disabled ? 0 : 1,
        transition: { type: "spring", stiffness: 400 }
      }
    },
    shake: {
      whileHover: disabled ? {} : {
        x: [0, -1, 1, -1, 1, 0],
        transition: { duration: 0.4 }
      },
      whileTap: { scale: disabled ? 1 : 0.98 }
    },
    pulse: {
      animate: disabled ? {} : {
        scale: [1, 1.02, 1],
        transition: { duration: 2, repeat: Infinity }
      },
      whileHover: { scale: disabled ? 1 : 1.05 },
      whileTap: { scale: disabled ? 1 : 0.95 }
    },
    lift: {
      whileHover: disabled ? {} : {
        y: -3,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        transition: { type: "spring", stiffness: 300 }
      },
      whileTap: { 
        y: disabled ? 0 : -1,
        transition: { type: "spring", stiffness: 300 }
      }
    }
  };

  const motionProps = animations[animationType];

  return (
    <motion.div
      className="inline-block"
      {...motionProps}
    >
      <Button
        ref={ref}
        className={cn(
          "transform-gpu", // Enable hardware acceleration
          disabled && "cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
});

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
export type { AnimatedButtonProps };