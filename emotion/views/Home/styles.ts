import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Title = styled.h3`
  color: ${({theme}) => theme.color.primary};
`;

const BaseText = styled.p<{ size: string }>`
  font-size: ${({ size }) => size};
`;

export const Text = styled(BaseText)``;