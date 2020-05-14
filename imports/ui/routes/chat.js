import Chat from "../views/Chat/Chat";

export default {
    name: 'home.chat',
    path: 'chat',
    meta: {
        breadcrumb: "Chat",
        permission: "messages-view"
    },
    components:{
        sectionView:Chat
    }
}