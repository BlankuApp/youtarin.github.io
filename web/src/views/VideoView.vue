<template>
  <div class="ratio ratio-16x9">
    <iframe
      :src="'https://www.youtube.com/embed/' + video_id"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>
  <div v-if="video">
    <div class="d-flex mt-1">
      <div class="flex-shrink-1">
        <img
          :src="video.channel_thumbnail"
          :alt="video.channel_title"
          class="rounded ratio ratio-1x1"
        />
      </div>
      <div class="col p-1">
        <h2>{{ video.title }}</h2>
        <a
          :href="'/channel/' + video.channel.slice(1)"
          class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        >
          <h5>{{ video.channel_title }}</h5>
        </a>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading channel data...</p>
  </div>
  <div style="height: 300px">
    <canvas id="views_chart"></canvas>
  </div>
  <div style="height: 300px">
    <canvas id="likes_chart"></canvas>
  </div>
  <div style="height: 300px">
    <canvas id="comments_chart"></canvas>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "VideoView",
  data() {
    return {
      video: null,
    };
  },
  props: {
    video_id: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.fetchVideoData();
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
    async fetchVideoData() {
      try {
        const response = await axios.get(
          "https://youtarin.mooo.com/api/videos/" + this.video_id
        );
        this.video = response.data;
        this.renderChart();
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    },
    async renderChart() {
      if (!this.video) {
        return;
      }
      //   views chart
      const views_data = this.video.stats.map((x) => x[2]);
      const diff_views = this.video.stats.map((x) => x[5]);
      new Chart(document.getElementById("views_chart"), {
        type: "line",
        data: {
          labels: this.video.stats.map((x) => x[1].slice(0, 10)),
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
      //   likes chart
      const likes_data = this.video.stats.map((x) => x[3]);
      const diff_likes = this.video.stats.map((x) => x[6]);
      new Chart(document.getElementById("likes_chart"), {
        type: "line",
        data: {
          labels: this.video.stats.map((x) => x[1].slice(0, 10)),
          datasets: [
            {
              label: "daily",
              data: diff_likes,
              yAxisID: "y",
              cubicInterpolationMode: "monotone",
              type: "bar",
            },
            {
              label: "total",
              data: likes_data,
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
              text: "Likes",
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
      //   comments chart
      const comments_data = this.video.stats.map((x) => x[4]);
      const diff_comments = this.video.stats.map((x) => x[7]);
      new Chart(document.getElementById("comments_chart"), {
        type: "line",
        data: {
          labels: this.video.stats.map((x) => x[1].slice(0, 10)),
          datasets: [
            {
              label: "daily",
              data: diff_comments,
              yAxisID: "y",
              cubicInterpolationMode: "monotone",
              type: "bar",
            },
            {
              label: "total",
              data: comments_data,
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
              text: "Comments",
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
