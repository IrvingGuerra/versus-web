<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="headline">Configurar cuenta</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xs="12" sm="6" md="6">
                <GeneralData/>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="6">
                <update-password/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import UpdatePassword from "../../components/ConfigureAccount/UpdatePassword";
    import GeneralData from "../../components/ConfigureAccount/GeneralData";

    export default {
        name: "ConfigureAccount",
        components: {GeneralData, UpdatePassword}
    }
</script>

<style scoped>
</style>
