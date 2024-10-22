import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
  
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-screen-lg w-full">
        {children}
      </div>

  ); 
};

export default Container;