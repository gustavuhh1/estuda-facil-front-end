import styled from "styled-components";
import ProfessorAPI from "./AlunoTurmaManager";
import AlunoAPI from "./AlunoApi";
import AdminAPI from "./AdminApi";
import TokenRegistroAPI from "./TokenRegistroApi";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 4rem;
  padding: 3rem;
`;

export default function ContainerApiTest() {
  return (
    <Container >
      <ProfessorAPI />
      <AlunoAPI />
      <AdminAPI />
      <TokenRegistroAPI />
    </Container>
  );
}
