import EditProfile from '@/EditProfile';
import Home from '@/Home';
import Journals from '@/Journals';
import NotFound from '@/NotFound';
import PublicKeys from '@/PublicKeys';
import { findLink } from '@/Resource/Types';
import { UserSessionResource } from '@/SessionStore/Types';
import { CurrentUserResource } from '@/WithCurrentUser/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';
import { Result } from 'resulty';

interface Props {
  session: UserSessionResource;
  currentUser: CurrentUserResource;
}

type DynamicRouteCreator = (props: Props) => Result<unknown, RouteObject>;

const dynamicRouteCreators: ReadonlyArray<DynamicRouteCreator> = [
  ({ session }) =>
    findLink('journals', session.links).map((link) => ({
      path: 'journals',
      element: <Journals link={link} />,
    })),
  ({ currentUser }) =>
    findLink('edit', currentUser.links).map((link) => ({
      path: 'profile/edit',
      element: <EditProfile link={link} />,
    })),
  ({ session }) =>
    findLink('public_keys', session.links).map((link) => ({
      path: 'public-keys',
      element: <PublicKeys link={link} />,
    })),
];

const dynamicRoutes = (props: Props): Array<RouteObject> =>
  dynamicRouteCreators.map((fn) => fn(props).getOrElseValue({}));

const authenticatedRouter = (props: Props) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: <Home currentUser={props.currentUser} />,
        ErrorBoundary: NotFound,
      },
      {
        path: 'profile/new',
        element: <Navigate to="/" replace />,
      },
      ...dynamicRoutes(props),
    ],
    { basename: '/app' },
  );

const AuthenticatedRouter: React.FC<Props> = (props) => (
  <RouterProvider router={authenticatedRouter(props)} />
);

export default observer(AuthenticatedRouter);
