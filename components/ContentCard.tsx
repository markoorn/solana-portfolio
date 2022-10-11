import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { Project } from '../types/Project';

type Props = {
  onClick: () => void;
  project: Project;
};

const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/silverstag/image/upload/v1664966534/ternoa/placeholder_eukgmf.png';

export default function ContentCard({ project, onClick }: Props) {
  return (
    <motion.div
      className="w-1/3 p-5"
      initial={{
        x: -500,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.5,
      }}
    >
      <div
        className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden z-10"
        onClick={onClick}
      >
        <div className="relative pb-48 overflow-hidden">
          <Image
            priority
            className="absolute inset-0 h-full w-full object-cover"
            src={project.imageUrl || PLACEHOLDER_IMAGE}
            objectFit={'cover'}
            layout={'fill'}
            alt=""
          />
        </div>
        <div className="px-4 p-4 border-t border-b">
          <h2 className="mt-2 mb-2  font-bold">{project.title}</h2>
          <p className="text-sm h-30 overflow-clip">{project.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
