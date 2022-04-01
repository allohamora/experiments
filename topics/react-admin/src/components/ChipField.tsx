import { FC } from 'react';
import { ChipFieldProps, ChipField as Original } from 'react-admin';

export const ChipField: FC<ChipFieldProps> = (props) => <Original color="primary" {...props} />;
