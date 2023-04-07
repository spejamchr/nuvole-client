import EditProfile from '@/EditProfile';
import Home from '@/Home';
import Journals from '@/Journals';
import NotFound from '@/NotFound';
import PublicKeys from '@/PublicKeys';
import { CurrentUserResource } from '@/WithCurrentUser/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

interface Props {
  currentUser: CurrentUserResource;
}

export const authenticatedRouter = ({ currentUser }: Props) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: <Home currentUser={currentUser} />,
        ErrorBoundary: NotFound,
      },
      {
        path: 'journals',
        element: <Journals />,
      },
      {
        path: 'profile/edit',
        element: <EditProfile currentUser={currentUser} />,
      },
      {
        path: 'profile/new',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'public-keys',
        element: <PublicKeys />,
      },
    ],
    { basename: '/app' },
  );

const AuthenticatedRouter: React.FC<Props> = (props) => (
  <RouterProvider router={authenticatedRouter(props)} />
);

export default observer(AuthenticatedRouter);
