import Players from "../views/Players/Players";

export default {
    name: 'home.players',
    path: 'jugadores',
    meta: {
        breadcrumb: "Jugadores"
    },
    components:{
        sectionView : Players
    }
}