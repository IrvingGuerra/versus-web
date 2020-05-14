<template>
    <b-row>
        <slot name="pagination">
            <b-col cols="2">
                <b-form-select name="perPage" id="perPage" v-model="xPage" size="sm">
                    <option :value="totalRows">Todos los registros</option>
                    <option :value="5">5 registros</option>
                    <option :value="10">10 registros</option>
                    <option :value="25">25 registros</option>
                    <option :value="100">100 registros</option>
                </b-form-select>
            </b-col>
            <b-col cols="4">
                <small>
                    Mostrando {{ xPage*currentPage - (xPage - 1) }} al
                    {{ xPage*currentPage > totalRows ? totalRows : xPage*currentPage }}
                    de {{ totalRows }} registros
                </small>
            </b-col>
            <b-col>
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="xPage"
                    size="sm" align="right"
                    aria-controls="my-table"></b-pagination>
            </b-col>
        </slot>
        <b-col cols="12">
            <b-table id="tableA" class="mt-3"
                     hover outlined small foot-clone responsive head-variant="light"
                     :per-page="xPage" :current-page="currentPage"
                     :filter="getFilterValue"
                     :filter-function="onFilterByColumn"
                     @filtered="onFiltered"
                     :items="items"
                     ref="tableA"
                     :fields="fields"
                     :primary-key="primaryKey"
                     :tbody-transition-props="transProps"
                     show-empty>
                <template slot="empty" slot-scope="scope">
                    <div class="no-records">
                        <h4>No existen registros</h4>
                    </div>
                </template>
                <template slot="emptyfiltered" slot-scope="scope">
                    <div class="no-results">
                        <h4>Ningún resultado encontrado</h4>
                    </div>
                </template>
                <template slot="HEAD_opciones">
                    <div class="text-center">
                        <slot name="optionsIcon">
                            <font-awesome-icon icon="cog" class="icon-option"></font-awesome-icon>
                        </slot>
                    </div>
                </template>
                <template slot="thead-top">
                    <slot name="searchInputs"></slot>
                </template>
                <template v-for="field in fields" :slot="field.key" slot-scope="data">
                    <slot :name="field.key" :data="data">
                        {{ data.value }}
                    </slot>
                </template>
                <template slot="row-details" slot-scope="data">
                    <slot name="details" :data="data"></slot>
                </template>
            </b-table>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'TableA',
        props: {
            fields: {
                type: Array,
                required: true
            },
            filters: {
                type: Object,
                default() {
                    return {};
                }
            },
            customFilter: {
                type: Function,
                default() {
                    return (filterColumn, item) => '';
                }
            },
            perPage: {
                type: Number,
                default() {
                    return 10;
                }
            },
            primaryKey: {
            	type: String,
                default() {
            		return '_id';
                }
            }
        },
        data() {
            return {
                items: [],
                transProps: {
                    // Transition name
                    name: 'list-complete'
                },
                currentPage: 1,
                totalRows: 0,
                filter: null,
                xPage: this.perPage
            };
        },
        methods: {
            setItems(items) {
                this.totalRows = items.length;
                this.items = items;
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            },
            onFilterByColumn(item) {
                let matches = false;
                for (let filterColumn in this.filters) {
                    if (this.filters[filterColumn]) {
                        let columnStr = this.customFilter(filterColumn, item);
                        let filteredStr = this.filters[filterColumn].toString().toLowerCase();
                        filteredStr = this.$_.deburr(filteredStr);
                        columnStr = this.$_.deburr(columnStr);
                        if (columnStr.toLowerCase().indexOf(filteredStr) > -1) {
                            matches = true;
                        } else {
                            matches = false;
                            break;
                        }
                    }
                }
                return matches;
            }
        },
        computed: {
            getFilterValue() {
                let filterValue = '';
                for (let filterColumn in this.filters) {
                    if (this.filters[filterColumn]) {
                        filterValue += this.filters[filterColumn];
                    }
                }
                return filterValue;
            }
        }
    };
</script>

<style scoped>
    .no-records, .no-results {
        text-align: center;
        padding: 20px 0;
    }
</style>
