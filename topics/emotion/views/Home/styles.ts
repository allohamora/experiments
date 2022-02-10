import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.color.primary};
`;

const BaseText = styled.p<{ size: string }>`
  font-size: ${({ size }) => size};
`;

export const Text = styled(BaseText)``;
