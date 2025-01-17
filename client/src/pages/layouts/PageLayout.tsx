import React from 'react';
import { Container, Box } from '@mui/material';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    title,
    maxWidth = 'lg'
}) => {
    return (
        <Box component="main" sx={{ py: 4 }}>
            <Container maxWidth={maxWidth}>
                {title && (
                    <Box component="header" sx={{ mb: 4 }}>
                        <h2>{title}</h2>
                    </Box>
                )}
                {children}
            </Container>
        </Box>
    );
};