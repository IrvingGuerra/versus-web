import Login from "../views/Auth/Login";
import ForgotPassword from "../views/Auth/ForgotPassword";
import ResetPassword from "../views/Auth/ResetPassword";
import LytAuth from "../layouts/LytAuth";
import SetInitialPassword from "../views/Auth/SetInitialPassword";

export default {
    path: '/login',
    components: {
        allPageView: LytAuth
    },
    children: [
        {
            path: '',
            name: 'login',
            components: {
                sectionView: Login
            }
        },
        {
            name: 'olvideMiContrasena',
            path: '/olvide-mi-contrasena',
            components: {
                sectionView: ForgotPassword
            }
        },
        {
            name: 'restablecerContrasena',
            path: '/reset-password/:token',
            components: {
                sectionView: ResetPassword
            }
        },
        {
            name: 'establecerContrasenaInicial',
            path: '/enroll-account/:token',
            components: {
                sectionView: SetInitialPassword
            }
        }
    ]
}