import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-screen-lg w-full h-96 overflow-auto">
            {children} 
        </div> 
    </div> 
  ); 
};

export default Container;