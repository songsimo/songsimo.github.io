import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const HeaderStyles = styled.header`
    nav ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: grid;
        grid-template-columns: repeat(4, auto);
        justify-content: space-betwen
    }
    nav ul li a {
        display: inline-blok;
        padding: 1rem
    }
`;

export default function Header() {
    return (
        <HeaderStyles>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to= "/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </HeaderStyles>
    );
}
