"use client";
import React, { useState, useEffect } from 'react';
import Icon from '../icons';

interface ProgressProps {
  icon: string;
  name?: string;
  loading: boolean;
  error: boolean;
}

const DropProgress: React.FC<ProgressProps> = ({ icon, name, loading, error }) => {
  const [complete, setComplete] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);
  const [color, setColor] = useState<string>("#ed665f");

  useEffect(() => {
    if (name) {
      let timeout = setInterval(() => {
        setWidth(prev => {
          if (prev < 100) {
            if (loading && prev > 40) return prev + 0.1;
            if (loading && prev > 95) return prev;
            return prev + 0.9;
          }
          setComplete(true);
          setColor("#6cc08a");
          return prev;
        });
      }, 15);

      return () => clearInterval(timeout);
    }
  }, [loading]);

  return (
    <div className="flex items-center w-full h-14 mb-4">
      <div className="flex">
        <Icon name={icon} width="50px" height="50px" opacity={complete || error ? 1 : 0.5} />
      </div>
      <div className="flex flex-col justify-end items-start flex-grow h-full py-2.5 pl-4">
        <div className="flex justify-between items-center w-full text-sm mb-3.5">
          <p>{name}</p>
          <Icon
            className={complete ? "check" : error ? "close" : ""}
            name={complete ? "CHECK" : error ? "CLOSE" : ""}
            width="20px"
            height="20px"
          />
        </div>
        <div className="relative w-full h-0.5 mb-1 bg-red-500 bg-opacity-50">
          <div
            className={`absolute z-10 w-full h-0.5 left-0 top-0`}
            style={{ width: `${width || 0}%`, background: error ? 'red' : color || 'gray' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DropProgress;