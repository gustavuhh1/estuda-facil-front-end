import styled from "styled-components";

const Box = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2d4d3a;
`;

export default function TokenRegistroAPI() {
  return (
    <Box>
      <Title>Token Registro API</Title>
      <p>Teste do registro via token para novos usuários.</p>
    </Box>
  );
}
