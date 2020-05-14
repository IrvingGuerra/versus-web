<template>
    <v-dialog id="modalImport" max-width="500px" v-model="dialog">
        <v-card>
            <v-card-title class="headline">
                <div class="headline">
                    Agregar {{modalData.typeElement}}
                </div>
            </v-card-title>
            <v-card-text>
                <v-file-input :rules="modalData.rules" :accept="modalData.accept"
                              show-size :placeholder="'Selecciona tu '+modalData.typeElement"
                              v-model="file" :label="modalData.mainNameElement"
                              filled :prepend-icon="modalData.icon">
                </v-file-input>
                <div class="subtitle-1 orange--text">*{{modalData.warning}}</div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="default" text v-on:click="cancel">
                    Cancelar
                </v-btn>
                <v-btn color="primary" outlined depressed v-on:click="uploadFile">
                    Subir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'ModalImport',
        props: ["modalData"],
        data() {
            return {
                file: null,
                fileData: {
                    blob: null,
                    name: null,
                },
                tempSrc: null,
                dialog: false,
            };
        },
        watch: {
            file(newFile, oldFile) {
                if (newFile && typeof (FileReader) != 'undefined') {
                    const reader = new FileReader();
                    const reader2 = new FileReader();
                    reader.onload = function (ev) {
                        this.tempSrc = ev.target.result;
                    }.bind(this);
                    reader.readAsDataURL(newFile);

                    reader2.onload = (file) => {
                        this.fileData.blob = file.target.result;
                        this.fileData.name = newFile.name;
                    };
                    reader2.readAsBinaryString(newFile);

                }
            }
        },
        methods: {
            uploadFile() {
                this.dialog = false;
                this.$emit("uploadFile", this.fileData);
            },
            cancel() {
                this.dialog = false;
            }
        }
    };
</script>

<style scoped>

</style>
