import loginRoutes from './login';
import userRoutes from './users';
import profileRoutes from './profiles';
import LytSPA from "../layouts/LytSPA";
import ConfigureAccount from "../views/Account/ConfigureAccount";
import Home from "../views/Home/Home";
import chatRoutes from "./chat";
import playersRoutes from "./players";

export default [
    {
        path: '*',
        redirect: '/login'
    },
    loginRoutes,
    {
        path: '/',
        components: {
            allPageView: LytSPA
        },
        meta: {
            requiresAuth: true,
            breadcrumb: "Inicio"
        },
        children: [
            {
                path: "",
                name: "home",
                meta: {
                    breadcrumb: "Inicio"
                },
                components: {
                    sectionView: Home
                }
            },
            {
                path: 'cuenta',
                name: 'home.account',
                meta: {
                    breadcrumb: "Configurar cuenta"
                },
                components: {
                    sectionView: ConfigureAccount
                }
            },
            userRoutes,
            profileRoutes,
            chatRoutes,
            playersRoutes
        ]
    }
]
