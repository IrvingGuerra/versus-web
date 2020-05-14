import Users from "../views/Admin/Users/Users";
import UsersCreateEdit from "../views/Admin/Users/UsersCreateEdit";

export default {
    name: 'home.users',
    path: 'usuarios',
    meta: {
        breadcrumb: "Usuarios",
        permission: "users-view"
    },
    components: {
        sectionView: Users
    },
    children: [
        {
            name: 'home.users.create',
            path: 'crear',
            meta: {
                breadcrumb: "Crear usuario",
                permission: "users-create"
            },
            components: {
                usersOptionsView: UsersCreateEdit
            }
        },
        {
            name: 'home.users.edit',
            path: 'editar',
            meta: {
                breadcrumb: "Editar usuario",
                permission: "users-edit"
            },
            components: {
                usersOptionsView: UsersCreateEdit
            }
        }
    ]
}