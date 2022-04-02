import { FC, Children, isValidElement, cloneElement } from 'react';

export const ButtonsGroup: FC = ({ children, ...props }) => (
  <>
    {Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child, { ...props });
      }

      return child;
    })}
  </>
);
