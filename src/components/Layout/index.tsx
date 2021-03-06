import React from 'react';
import Navigation from '../Navigation';
import styled from 'styled-components';

interface Props {
    title: string;
    children: any;
}

const Layout = (props: Props) => {
    return (
        <>
            <Navigation />
            <Container>
                <Title>Music {props.title}</Title>
                {props.children}
            </Container>
        </>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
`;

const Title = styled.span`
    font-size: 1.5em;
    font-wieght: bold;
    color: #fff;
`;

export default Layout;
