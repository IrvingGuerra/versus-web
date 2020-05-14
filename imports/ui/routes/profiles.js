import Profiles from "../views/Admin/Profiles/Profiles";
import ProfilesCreateEdit from "../views/Admin/Profiles/ProfilesCreateEdit";

export default {
    name: 'home.profiles',
    path: 'perfiles',
    meta: {
        breadcrumb: "Perfiles",
        permission: "profiles-view"
    },
    components: {
        sectionView: Profiles
    },
    children: [
        {
            name: 'home.profiles.create',
            path: 'crear',
            meta: {
                breadcrumb: "Crear perfil",
                permission: "profiles-create"
            },
            components: {
                profilesOptionsView: ProfilesCreateEdit
            }
        },
        {
            name: 'home.profiles.edit',
            path: 'editar',
            meta: {
                breadcrumb: "Editar perfil",
                permission: "profiles-edit"
            },
            components: {
                profilesOptionsView: ProfilesCreateEdit
            }
        }
    ]
}
