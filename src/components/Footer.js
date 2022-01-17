import React from "react";
import styled from "styled-components"; 

const FooterStyles = styled.footer`
    text-align: center;
    padding: 1rem;
`;

export default function Footer() {
    return (
        <FooterStyles>
            Song simo, { new Date().getFullYear() }
        </FooterStyles>
    );
}
