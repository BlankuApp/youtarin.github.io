<template>
  <div>
    <div class="row" v-if="channel">
      <div class="col-auto">
        <img
          :src="channel.smallThumbnail"
          :alt="channel.title"
          class="img-fluid rounded"
        />
      </div>
      <div class="col">
        <h2>{{ channel.title }}</h2>
        <div class="row">
          مشترکین:{{ formatNumber(channel.subscriber_count) }}
        </div>
        <div class="row">بازدیدها:{{ formatNumber(channel.view_count) }}</div>
        <div class="row">ویدیوها:{{ formatNumber(channel.video_count) }}</div>
        <div class="row">تاریخ شروع:{{ channel.created_at }}</div>
        <div class="row">{{ channel.description }}</div>
      </div>
    </div>
    <div v-else>
      <p>Loading channel data...</p>
    </div>
    <div style="height: 300px">
      <canvas id="views_chart"></canvas>
    </div>
    <div style="height: 300px">
      <canvas id="subscribers_chart"></canvas>
    </div>
    <div v-if="channel">
      <div class="row my-2">
        <label class="col-auto d-flex align-items-center" for="s"
          >مرتب سازی</label
        >
        <div class="col">
          <select
            name="sortby"
            id="s"
            class="form-select form-select-sm"
            @change="fetchChannelData(channel_name)"
          >
            <option selected value="0">تاریخ انتشار - جدیدترین</option>
            <option value="1">تاریخ انتشار - قدیمی ترین</option>
            <option value="2">بازدیدها - بیشترین</option>
            <option value="3">بازدیدها - کمترین</option>
            <option value="4">لایک ها - بیشترین</option>
            <option value="5">لایک ها - کمترین</option>
            <option value="6">نظرات - بیشترین</option>
            <option value="7">نظرات - کمترین</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="d-flex flex-wrap justify-content-around">
          <div
            v-for="video in channel.videos"
            class="card flex-grow-1 w-25 p-1"
            style="border: none; max-width: 350px; min-width: 200px"
          >
            <a :href="'/video/' + video.video_id">
              <img
                :src="
                  'https://i.ytimg.com/vi/' + video.video_id + '/hqdefault.jpg'
                "
                :alt="video.description"
                style="width: 100%"
              />
            </a>
            <div class="card-body pt-1 pb-3 px-1">
              <div class="d-flex flex-column">
                <div class="d-flex justify-content-between">
                  <small>
                    {{ formatNumber(video.view_count) }}
                    <i class="bi bi-eye"></i>
                  </small>
                  <small>
                    {{ formatNumber(video.like_count) }}
                    <i class="bi bi-hand-thumbs-up"></i>
                  </small>
                  <small>
                    {{ formatNumber(video.comment_count) }}
                    <i class="bi bi-chat-left"></i>
                  </small>
                </div>
                <div
                  class="two-line-truncate mb-auto"
                  style="max-width: 320px; min-width: 100px"
                >
                  {{ video.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      channel: null,
      views_chart: null,
      subscribers_chart: null,
    };
  },
  props: {
    channel_name: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.fetchChannelData(this.channel_name);
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
    async fetchChannelData(channel_name) {
      try {
        const selection = {
          0: "&sort=created&order=desc",
          1: "&sort=created&order=asc",
          2: "&sort=views&order=desc",
          3: "&sort=views&order=asc",
          4: "&sort=likes&order=desc",
          5: "&sort=likes&order=asc",
          6: "&sort=comments&order=desc",
          7: "&sort=comments&order=asc",
        };

        const element = document.getElementById("s");
        const selected_option = element ? element.value : 0;
        console.log(
          "https://youtarin.mooo.com/api/channels/" +
            channel_name +
            "?p=0" +
            selection[selected_option]
        );
        const response = await axios.get(
          "https://youtarin.mooo.com/api/channels/" +
            channel_name +
            "?p=0" +
            selection[selected_option]
        );
        this.channel = response.data;
        console.log(response.data);
        this.renderChart();
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    },
    async renderChart() {
      if (!this.channel) {
        return;
      }

      const views_data = this.channel.stats.map((x) => x[1]);
      const diff_views = this.channel.stats.map((x) => x[4]);
      const ctx = document.getElementById("views_chart").getContext("2d");
      if (this.views_chart) {
        this.views_chart.destroy();
      }
      this.views_chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.channel.stats.map((x) => x[0].slice(0, 10)),
          datasets: [
            {
              label: "daily",
              data: diff_views,
              yAxisID: "y",
              cubicInterpolationMode: "monotone",
              type: "bar",
            },
            {
              label: "total",
              data: views_data,
              yAxisID: "y1",
              cubicInterpolationMode: "monotone",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Views",
            },
          },
          scales: {
            y: {
              type: "linear",
              display: window.innerWidth > 750 ? true : false,
              position: "left",
              title: {
                display: true,
                text: "daily",
                color: "rgb(54, 162, 235)",
              },
              ticks: {
                color: "rgb(54, 162, 235)",
              },
            },
            y1: {
              type: "linear",
              display: window.innerWidth > 750 ? true : false,
              position: "right",
              title: {
                display: true,
                text: "total",
                color: "rgb(255, 99, 132)",
              },
              ticks: {
                color: "rgb(255, 99, 132)",
              },
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          },
        },
      });
      //   subs
      const subs_data = this.channel.stats.map((x) => x[2]);
      const diff_subs = this.channel.stats.map((x) => x[5]);
      const ctx2 = document
        .getElementById("subscribers_chart")
        .getContext("2d");
      if (this.subscribers_chart) {
        this.subscribers_chart.destroy();
      }
      this.subscribers_chart = new Chart(ctx2, {
        type: "line",
        data: {
          labels: this.channel.stats.map((x) => x[0].slice(0, 10)),
          datasets: [
            {
              label: "daily",
              data: diff_subs,
              yAxisID: "y",
              cubicInterpolationMode: "monotone",
              type: "bar",
            },
            {
              label: "total",
              data: subs_data,
              yAxisID: "y1",
              cubicInterpolationMode: "monotone",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Subscribers",
            },
          },
          scales: {
            y: {
              type: "linear",
              display: window.innerWidth > 750 ? true : false,
              position: "left",
              title: {
                display: true,
                text: "daily",
                color: "rgb(54, 162, 235)",
              },
              ticks: {
                color: "rgb(54, 162, 235)",
              },
            },
            y1: {
              type: "linear",
              display: window.innerWidth > 750 ? true : false,
              position: "right",
              title: {
                display: true,
                text: "total",
                color: "rgb(255, 99, 132)",
              },
              ticks: {
                color: "rgb(255, 99, 132)",
              },
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          },
        },
      });
    },
  },
};
</script>
