import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ApiDocsPage } from '../pages/ApiDocsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                // Redirect root → /api-docs
                element: <ApiDocsPage />,
            },
            {
                path: 'api-docs',
                element: <ApiDocsPage />,
            },
        ],
    },
]);
