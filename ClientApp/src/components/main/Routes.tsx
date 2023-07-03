import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import { Rola } from '../../types/enums/Rola';
import LoginForm from '../auth/LoginForm';
import UlogiraniKorisnik from '../korisnici/UlogiraniKorisnik';
import ProtectedRoute from '../auth/ProtectedRoute';
import Korisnici from '../korisnici/Korisnici';
import Korisnik from '../korisnici/Korisnik';
import Kompanije from '../kompanije/Kompanije';
import Kompanija from '../kompanije/Kompanija';
import Error from '../lib/errors/Error';
import NotFound from '../lib/errors/NotFound';
import Unauthorized from '../lib/errors/Unauthorized';
import App from "./App";
import Praksa from '../prakse/Praksa';
import Prakse from '../prakse/Prakse';


export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'login',
                element: <LoginForm />
            },
            {
                path: 'profil',
                element:
                <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <UlogiraniKorisnik />
                </ProtectedRoute>
            },
            {
                path: 'korisnici',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]} >
                        <Korisnici />
                    </ProtectedRoute>
            },
            {
                path: 'korisnici/novi',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator]}>
                        <Korisnik />
                    </ProtectedRoute>
            },
            {
                path: 'korisnici/:id',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <Korisnik />
                    </ProtectedRoute>
            },
            {
                path: 'kompanije',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <Kompanije />
                    </ProtectedRoute>
            },
            {
                path: 'kompanije/nova',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <Kompanija />
                    </ProtectedRoute>
            },
            {
                path: 'kompanije/:id',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <Kompanija />
                    </ProtectedRoute>
            },
            {
                path: 'prakse',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]} >
                        <Prakse />
                    </ProtectedRoute>
            },
            {
                path: 'prakse/nova',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <Praksa />
                    </ProtectedRoute>
            },
            {
                path: 'prakse/:id',
                element:
                    <ProtectedRoute requiredRole={[Rola.Administrator, Rola.Asistent, Rola.Profesor, Rola.Student]}>
                        <Praksa />
                    </ProtectedRoute>
            },
            {
                path: 'unauthorized',
                element:
                    <ProtectedRoute>
                        <Unauthorized />
                    </ProtectedRoute>
            },
            {
                path: 'error',
                element:
                    <ProtectedRoute>
                        <Error />
                    </ProtectedRoute>
            },
            {
                path: 'not-found',
                element:
                    <ProtectedRoute>
                        <NotFound />
                    </ProtectedRoute>
            },
            {
                path: '*',
                element: <Navigate to="/not-found" replace />
            }
        ]
    }
]

export const router = createBrowserRouter(routes);