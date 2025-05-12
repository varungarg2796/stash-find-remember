
import React from 'react';

interface CharacterCountProps {
  current: number;
  max: number;
  className?: string;
}

const CharacterCount = ({ current, max, className = "" }: CharacterCountProps) => {
  const isNearLimit = current >= max * 0.8;
  const isAtLimit = current >= max;
  
  return (
    <div className={`text-xs ${isAtLimit ? 'text-destructive' : isNearLimit ? 'text-amber-500' : 'text-muted-foreground'} mt-1 text-right ${className}`}>
      {current}/{max}
    </div>
  );
};

export default CharacterCount;
