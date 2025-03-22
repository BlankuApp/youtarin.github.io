<template>
  <!-- Videos -->
  <div class="row"><h1>ویدیو‌ها</h1></div>
  <div class="d-flex flex-wrap align-items-center pb-3">
    <div>مرتب‌سازی بر اساس</div>
    <div
      class="btn-group p-1"
      role="group"
      aria-label="Basic radio toggle button group"
      @change="fetchTopVideos"
    >
      <input
        type="radio"
        class="btn-check"
        name="vd_type"
        id="vd_created"
        autocomplete="off"
        value="created"
        v-model="vd_selected_type"
      />
      <label class="btn btn-outline-info" for="vd_created"
        >تاریخ انتشار</label
      >
      <input
        type="radio"
        class="btn-check"
        name="vd_type"
        id="vd_views"
        autocomplete="off"
        value="views"
        v-model="vd_selected_type"
      />
      <label class="btn btn-outline-info" for="vd_views">بازدید</label>

      <input
        type="radio"
        class="btn-check"
        name="vd_type"
        id="vd_likes"
        autocomplete="off"
        value="likes"
        v-model="vd_selected_type"
      />
      <label class="btn btn-outline-info" for="vd_likes">لایک</label>

      <input
        type="radio"
        class="btn-check"
        name="vd_type"
        id="vd_likes_ratio"
        autocomplete="off"
        value="likes_ratio"
        v-model="vd_selected_type"
      />
      <label class="btn btn-outline-info" for="vd_likes_ratio">محبوبیت</label>

      <input
        type="radio"
        class="btn-check"
        name="vd_type"
        id="vd_comments"
        autocomplete="off"
        value="comments"
        v-model="vd_selected_type"
      />
      <label class="btn btn-outline-info" for="vd_comments">کامنت</label>
    </div>

    <div
      class="btn-group"
      role="group"
      aria-label="Basic radio toggle button group"
      @change="fetchTopVideos"
    >
      <input
        type="radio"
        class="btn-check"
        name="vd_time"
        id="vd_3hours"
        autocomplete="off"
        value="-2 hours"
        v-model="vd_selected_time"
      />
      <label class="btn btn-outline-info" for="vd_3hours">3 ساعت</label>
      <input
        type="radio"
        class="btn-check"
        name="vd_time"
        id="vd_12hours"
        autocomplete="off"
        value="-11 hours"
        v-model="vd_selected_time"
      />
      <label class="btn btn-outline-info" for="vd_12hours">12 ساعت</label>
      <input
        type="radio"
        class="btn-check"
        name="vd_time"
        id="vd_daily"
        autocomplete="off"
        value="-1 day"
        v-model="vd_selected_time"
      />
      <label class="btn btn-outline-info" for="vd_daily">روز</label>

      <input
        type="radio"
        class="btn-check"
        name="vd_time"
        id="vd_weekly"
        autocomplete="off"
        value="-7 days"
        v-model="vd_selected_time"
      />
      <label class="btn btn-outline-info" for="vd_weekly">هفته</label>

      <input
        type="radio"
        class="btn-check"
        name="vd_time"
        id="vd_monthly"
        autocomplete="off"
        value="-30 days"
        v-model="vd_selected_time"
      />
      <label class="btn btn-outline-info" for="vd_monthly">ماه</label>
    </div>
  </div>
  <div v-if="top_videos && top_videos?.length">
    <div class="row">
      <div class="d-flex flex-wrap justify-content-around">
        <div
          v-for="video in top_videos"
          class="card flex-grow-1 p-1 col-12 col-sm-6 col-md-4 col-lg-3"
          style="border: none"
        >
          <div class="position-relative d-inline-block">
            <button
              class="btn btn-sm position-absolute bottom-0 start-0 m-1"
              :class="
                playlist.find((v) => v.video_id === video.video_id)
                  ? 'btn-danger'
                  : 'btn-info'
              "
              id="liveToastBtn"
              :name="video.video_id"
              @click="addVideo(video)"
            >
              اضافه به لیست پخش
            </button>
            <img
              :src="video.channel_thumbnail"
              alt=""
              style="max-width: 40px"
              class="position-absolute top-0 end-0"
            />
            <a :href="'video/' + video.video_id">
              <img
                :src="
                  'https://i.ytimg.com/vi/' + video.video_id + '/hqdefault.jpg'
                "
                :alt="video.title"
                class="w-100"
              />
            </a>
          </div>
          <div class="card-body pt-1 pb-3 px-1">
            <div class="d-flex flex-column">
              <div
                class="two-line-truncate mb-auto fw-bold pb-2"
                style="max-width: 320px; min-width: 100px"
              >
                {{ video.title }}
              </div>
              <div class="d-flex justify-content-between fs-6 fw-light">
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
              <div class="text-end fs-6 fw-light">
                <small>
                  {{ duration_text(video.duration) }}
                  <i class="bi bi-calendar-event"></i>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="vd_load_more"
      >
        بیشتر...
      </button>
    </div>
  </div>
  <div v-else class="text-center fs-5">درحال بارگذاری ...</div>
  <!-- Channels -->
  <div class="row"><h1>کانال‌ها</h1></div>
  <div class="d-flex flex-wrap align-items-center pb-3">
    <div>مرتب‌سازی بر اساس</div>
    <div
      class="btn-group p-1"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      <input
        type="radio"
        class="btn-check"
        name="ch_type"
        id="ch_views"
        autocomplete="off"
        value="view"
        v-model="ch_selected_type"
      />
      <label class="btn btn-outline-info" for="ch_views">بازدید</label>

      <input
        type="radio"
        class="btn-check"
        name="ch_type"
        id="ch_subscribers"
        autocomplete="off"
        value="subscriber"
        v-model="ch_selected_type"
      />
      <label class="btn btn-outline-info" for="ch_subscribers">مشترکین</label>

      <input
        type="radio"
        class="btn-check"
        name="ch_type"
        id="ch_videos"
        autocomplete="off"
        value="video"
        v-model="ch_selected_type"
      />
      <label class="btn btn-outline-info" for="ch_videos">ویدیو</label>
    </div>

    <div
      class="btn-group"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      <input
        type="radio"
        class="btn-check"
        name="ch_time"
        id="ch_daily"
        autocomplete="off"
        value="daily"
        v-model="ch_selected_time"
      />
      <label class="btn btn-outline-info" for="ch_daily">روز</label>

      <input
        type="radio"
        class="btn-check"
        name="ch_time"
        id="ch_weekly"
        autocomplete="off"
        value="weekly"
        v-model="ch_selected_time"
      />
      <label class="btn btn-outline-info" for="ch_weekly">هفته</label>

      <input
        type="radio"
        class="btn-check"
        name="ch_time"
        id="ch_monthly"
        autocomplete="off"
        value="monthly"
        v-model="ch_selected_time"
      />
      <label class="btn btn-outline-info" for="ch_monthly">ماه</label>
      <input
        type="radio"
        class="btn-check"
        name="ch_time"
        id="ch_total"
        autocomplete="off"
        value="total"
        v-model="ch_selected_time"
      />
      <label class="btn btn-outline-info" for="ch_total">کل</label>
    </div>
  </div>
  <div
    v-if="
      top_channels &&
      top_channels[ch_selected_time + '_' + ch_selected_type]?.length
    "
  >

    <div>
      <table class="table table-sm table-hover align-middle">
        <tbody>
          <tr
            v-for="(channel, index) in top_channels[
              ch_selected_time + '_' + ch_selected_type
            ]"
            :key="channel.channel_id"
          >
            <td>{{ index + 1 }}</td>
            <td class="m-0 p-0" style="width: 40px">
              <img
                :src="channel.smallThumbnail"
                :alt="channel.title"
                style="width: 40px"
              />
            </td>
            <td>
              <a :href="'channel/' + channel.customURL.slice(1)">{{
                channel.title
              }}</a>
            </td>
            <td class="text-end">
              {{
                formatNumber(channel[ch_selected_time + "_" + ch_selected_type])
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center pb-3">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="ch_load_more"
      >
        بیشتر...
      </button>
    </div>
  </div>
  <div v-else class="text-center fs-5">درحال بارگذاری ...</div>
  <!-- Playlist -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      id="liveToast"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="false"
      data-bs-animation="false"
    >
      <div class="toast-header">
        <strong class="me-auto">لیست پخش</strong>
        <a :href="playlistUrl" class="btn btn-sm btn-info text-center"
          >پخش در یوتیوب</a
        >
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body p-0">
        <ul class="list-group list-group-flush">
          <li
            v-for="video in playlist"
            :key="video.video_id"
            class="list-group-item"
          >
            {{ video.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      top_channels_full: [],
      top_channels: [],
      ch_selected_type: "view",
      ch_selected_time: "daily",
      ch_number: 10,
      top_videos_full: [],
      top_videos: {},
      vd_selected_type: "views",
      vd_selected_time: "-1 day",
      vd_number: 8,
      playlist: [],
    };
  },
  computed: {
    playlistUrl() {
      const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
      const videoIds = this.playlist.map((video) => video.video_id).join(",");
      return `${baseUrl}${videoIds}`;
    },
  },
  mounted() {
    this.fetchTopChannels();
    this.fetchTopVideos();
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
    async fetchTopChannels() {
      try {
        const response = await axios.get(
          "https://youtarin.mooo.com/api/top_channels"
        );
        this.top_channels_full = response.data;
        const keys = Object.keys(this.top_channels_full);
        for (let i = 0; i < keys.length; i++) {
          this.top_channels[keys[i]] = this.top_channels_full[keys[i]].slice(
            0,
            this.ch_number
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    ch_load_more() {
      this.ch_number += 10;
      const keys = Object.keys(this.top_channels_full);
      for (let i = 0; i < keys.length; i++) {
        this.top_channels[keys[i]] = this.top_channels_full[keys[i]].slice(
          0,
          Math.min(this.ch_number, this.top_channels_full[keys[i]].length)
        );
      }
    },
    async fetchTopVideos() {
      try {
        const response = await axios.get(
          "https://youtarin.mooo.com/api/top_videos",
          {
            params: {
              sort: this.vd_selected_type,
              time: this.vd_selected_time,
            },
          }
        );
        this.vd_number = 12;
        this.top_videos_full = response.data;
        this.top_videos = this.top_videos_full.slice(0, this.vd_number);
      } catch (error) {
        console.error(error);
      }
    },
    vd_load_more() {
      this.vd_number += 8;
      this.top_videos = this.top_videos_full.slice(
        0,
        Math.min(this.vd_number, this.top_videos_full.length)
      );
    },
    addVideo(video) {
      if (this.playlist.find((v) => v.video_id === video.video_id)) {
        this.playlist = this.playlist.filter(
          (v) => v.video_id !== video.video_id
        );
        const button = document.getElementsByName(video.video_id);
        button[0].textContent = "اضافه به لیست پخش";
        return;
      }

      this.playlist.push(video);
      const toastLiveExample = document.getElementById("liveToast");
      const toastBootstrap =
        bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastBootstrap.show();
      const button = document.getElementsByName(video.video_id);
      button[0].textContent = "حذف از لیست پخش";
    },
    duration_text(d) {
      let output = "";
      if (d[0] !== 0) {
        output += d[0] + "روز";
      }
      output += d[1] + "ساعت";
      output += d[2] + "دقیقه پیش";
      return output;
    },
  },
};
</script>
