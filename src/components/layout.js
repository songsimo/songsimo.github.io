import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const LayoutStyles = styled.div`
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
`;

export default function Layout({ children }) {
    return (
        <LayoutStyles>
            <Header />
            <main>header</main>
            <Footer />
        </LayoutStyles>
    );
}
