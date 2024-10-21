import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen m-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-screen-lg w-full">
        {children}
      </div>
    </div>
  ); 
};

export default Container;