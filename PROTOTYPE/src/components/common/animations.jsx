import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Page Transition wrapper
export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade in with configurable direction & delay
export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  direction = 'up',
  className = '',
  ...props
}) {
  const directions = {
    up: { y: 16, x: 0 },
    down: { y: -16, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initialOffset = directions[direction] || directions.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container for coordinating entry of children
export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0,
  className = '',
  ...props
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item used inside StaggerContainer
export function StaggerItem({
  children,
  className = '',
  yOffset = 16,
  ...props
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// Animated Number Counter (e.g. 0 -> 68%)
export function AnimatedNumber({
  value,
  duration = 1.2,
  suffix = '',
  prefix = '',
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Extract numeric part
    const numericTarget = typeof value === 'number' ? value : parseFloat(value) || 0;
    let startTime = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numericTarget * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    const animId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

// Animated Progress Bar that animates width from 0% to value
export function AnimatedProgress({
  value = 0,
  max = 100,
  duration = 0.9,
  colorClass = 'bg-blue-600',
  className = ''
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration, ease: [0.25, 1, 0.5, 1] }}
        className={`h-full rounded-full ${colorClass}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
