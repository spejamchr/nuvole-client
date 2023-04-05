import EditProfile from '@/EditProfile';
import Home from '@/Home';
import Journals from '@/Journals';
import NotFound from '@/NotFound';
import { CurrentUserResource } from '@/WithCurrentUser/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

interface Props {
  currentUser: CurrentUserResource;
}

export const authorizedRouter = ({ currentUser }: Props) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: <Home currentUser={currentUser} />,
        ErrorBoundary: NotFound,
      },
      {
        path: 'journals',
        element: <Journals currentUser={currentUser} />,
      },
      {
        path: 'profile/edit',
        element: <EditProfile currentUser={currentUser} />,
      },
      {
        path: 'profile/new',
        element: <Navigate to="/" replace />,
      },
    ],
    { basename: '/app' },
  );

const AuthorizedRouter: React.FC<Props> = (props) => (
  <RouterProvider router={authorizedRouter(props)} />
);

export default observer(AuthorizedRouter);
