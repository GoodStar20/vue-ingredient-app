<template>
  <div class="home">
    <v-layout row wrap>
      <v-flex xs6>
        <v-select
          :items="selectFridges"
          label="Select fridge"
          item-value="value"
          item-text="name"
          single-line
          v-model="selectedFridge"
          @input="changeFridge"
        ></v-select>
      </v-flex>
      <v-flex xs6 class="text-xs-right">
        <v-btn fab dark color="primary" @click.stop="showDialog">
          <v-icon dark>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="500px">
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline">New Item</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Name" v-model="newItem.name" :rules="nameRules" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    label="Fridge"
                    v-model="newItem.fridge"
                    :items="fridges"
                    :rules="[v => !!v || 'Fridge is required']"
                    item-value="value"
                    item-text="name"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="ingredients"
        :search="search"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.fridge }}</td>
          <td class="text-xs-left">{{ props.item.count }}</td>
          <td class="justify-center text-xs-right">
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
      <v-snackbar
        :timeout="3000"
        :color="snackbar.color"
        v-model="snackbar.show"
      >
        {{ snackbar.message }}
        <v-btn dark flat @click.native="hideSnackbar">Close</v-btn>
      </v-snackbar>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  data: () => {
    return {
      dialog: false,
      snackbar: {
        message: '',
        color: 'success',
        show: false,
      },
      valid: false,
      nameRules: [
        v => !!v || 'Name is required',
      ],
      selectedFridge: '',
      search: '',
      editedIndex: -1,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        { text: 'Fridge', value: 'fridge', sortable: false, },
        { text: 'Count', value: 'count' },
        { text: 'Actions', align: 'right', sortable: false },
      ],
      items: [],
      newItem: {
        name: '',
        fridge: '',
      },
    };
  },
  created() {
    this.$store.dispatch('getFridges');
    this.$store.dispatch('getIngredients', this.selectedFridge);
  },
  computed: {
    selectFridges() {
      return [{ value: '', name: 'All' }, ...this.$store.getters.fridges];
    },
    ...mapGetters(['ingredients', 'fridges']),
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    changeFridge() {
      this.$store.dispatch('getIngredients', this.selectedFridge);
    },
    close() {
      this.dialog = false;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addIngredient', this.newItem);
        this.dialog = false;
        this.$store.dispatch('getIngredients', this.selectedFridge);
        this.snackbar = {
          message: 'Added successfully',
          show: true,
          color: 'success',
        };
      }
    },
    showDialog() {
      this.$refs.form.reset();
      this.dialog = true;
    },
    deleteItem(item) {
      this.$store.dispatch('deleteIngredient', item);
      this.$store.dispatch('getIngredients', this.selectedFridge);
      this.snackbar = {
        message: 'Deleted successfully',
        show: true,
        color: 'success',
      };
    },
    hideSnackbar() {
      this.snackbar.show = false;
    },
  },
};
</script>
