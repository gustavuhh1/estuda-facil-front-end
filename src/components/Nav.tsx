"use client";

import Link from "next/link";
import styled from "styled-components";

const NavBar = styled.nav`
  display: flex;
  gap: 20px;
  background: #222;
  padding: 1rem;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export function Nav() {
  return (
    <NavBar>
      <Link href="/inicio" passHref>
        <NavLink>Início</NavLink>
      </Link>
      <Link href="/mensagens" passHref>
        <NavLink>Mensagens</NavLink>
      </Link>
      <Link href="/painel-admin" passHref>
        <NavLink>Painel Admin</NavLink>
      </Link>
    </NavBar>
  );
}
