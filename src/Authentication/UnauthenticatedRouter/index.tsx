import NotFound from '@/NotFound';
import { observer } from 'mobx-react';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Display, { Props as DisplayProps } from '../Display';
import NewProfile, { Props as NewProfileProps } from '../NewProfile';

type Props = DisplayProps & NewProfileProps;

export const unauthenticatedRouter = (props: Props) =>
  createBrowserRouter(
    [
      {
        path: '/profile/new',
        element: <NewProfile {...props} />,
        ErrorBoundary: NotFound,
      },
      {
        path: '*',
        element: <Display {...props} />,
      },
    ],
    { basename: '/app' },
  );

const UnauthenticatedRouter: React.FC<Props> = (props) => (
  <RouterProvider router={unauthenticatedRouter(props)} />
);

export default observer(UnauthenticatedRouter);
