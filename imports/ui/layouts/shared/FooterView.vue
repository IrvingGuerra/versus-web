<template>
    <v-footer padless>
        <v-col class="d-flex justify-center" cols="12">
            <span class="white--text">
                ©{{ currentLocalDate().getFullYear() }} Antware. Todos los derechos reservados.
            </span>
        </v-col>
    </v-footer>
</template>

<script>
    import dateMixin from '../../mixins/helpers/date';
    export default {
        name: "FooterView",
        mixins:[dateMixin]
    }
</script>

<style scoped>
    footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 50px;
        background-color: #8c191d !important;
    }
</style>
