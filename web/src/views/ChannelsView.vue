<template>
  <div class="col">
    <div class="row mb-1">
      <label class="col-auto d-flex align-items-center" for="s">Sort by</label>
      <div class="col">
        <select
          name="sortby"
          id="s"
          class="form-select form-select-sm"
          @change="fetchChannels"
        >
          <option selected value="0">Subscribers - high to low</option>
          <option value="1">Subscribers - low to high</option>
          <option value="2">Views - high to low</option>
          <option value="3">Views - low to high</option>
          <option value="4">Videos - high to low</option>
          <option value="5">Videos - low to high</option>
        </select>
      </div>
    </div>
    <div>
      <table class="table table-sm table-hover align-middle">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Subscibers</th>
            <th>Views</th>
            <th>Videos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in channels" :key="channel.id">
            <td class="m-0 p-0">
              <img
                :src="channel.smallThumbnail"
                :alt="channel.title"
                style="width: 2.5rem; height: 2.5rem"
              />
            </td>
            <td>
              <a :href="'/channel/' + channel.customURL.slice(1)">{{
                channel.title
              }}</a>
            </td>
            <td>{{ formatNumber(channel.subscriber_count) }}</td>
            <td>{{ formatNumber(channel.view_count) }}</td>
            <td>{{ formatNumber(channel.video_count) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center">
      <button
        type="button col-auto"
        class="btn btn-outline-secondary"
        @click="load_more"
      >
        ...
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      channels: [],
      page: 1,
    };
  },
  mounted() {
    this.fetchChannels();
  },
  methods: {
    formatNumber(value) {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + "M";
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K";
      }
      return value;
    },
    async fetchChannels() {
      try {
        const selection = {
          0: "&sort=subs&order=desc",
          1: "&sort=subs&order=asc",
          2: "&sort=views&order=desc",
          3: "&sort=views&order=asc",
          4: "&sort=videos&order=desc",
          5: "&sort=videos&order=asc",
        };

        const selected_option = document.getElementById("s").value;
        const response = await axios.get(
          "https://youtarin.mooo.com/api/channels?p=0" + selection[selected_option]
        );
        this.channels = response.data.channels || [];
      } catch (error) {
        console.error(error);
      }
    },
    async load_more() {
      try {
        const selection = {
          0: "&sort=subs&order=desc",
          1: "&sort=subs&order=asc",
          2: "&sort=views&order=desc",
          3: "&sort=views&order=asc",
          4: "&sort=videos&order=desc",
          5: "&sort=videos&order=asc",
        };
        this.page += 1;
        const selected_option = document.getElementById("s").value;
        const response = await axios.get(
          "https://youtarin.mooo.com/api/channels?p=" +
            this.page +
            selection[selected_option]
        );
        this.channels = [...this.channels, ...response.data.channels];
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
